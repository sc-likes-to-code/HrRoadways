// backend/server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import axios from "axios";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { sendBusDelayNotification, sendRouteCancellationNotification, sendTrafficUpdateNotification } from './utils/notificationEvents.js'; // Added notification events

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// --- Real-time Bus Data ---
let buses = {
  HR45: {
    busId: "HR45",
    route: "Hisar–Gurgaon",
    lat: 29.15,
    lng: 75.72,
    lastUpdated: Date.now(),
  },
  HR12: {
    busId: "HR12",
    route: "Delhi–Rohtak",
    lat: 28.66,
    lng: 77.23,
    lastUpdated: Date.now(),
  },
};

// Create HTTP + Socket.io server
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Fetch single bus location
app.get("/api/bus/:busId", (req, res) => {
  const bus = buses[req.params.busId];
  if (!bus) return res.status(404).json({ error: "Bus not found" });
  res.json(bus);
});

// Update bus location (from GPS/simulator)
app.post("/api/bus/:busId/update", (req, res) => {
  const { lat, lng } = req.body;
  const bus = buses[req.params.busId];
  if (!bus) return res.status(404).json({ error: "Bus not found" });

  bus.lat = lat;
  bus.lng = lng;
  bus.lastUpdated = Date.now();

  io.emit("busUpdate", bus); // notify all connected clients
  res.json({ success: true });
});

// --- Smart Route Finder (Google Maps + Haryana.json) ---
const dbPath = path.join(
  process.cwd(),
  "Databases/State_Database/Haryana.json"
);

app.post("/api/smart-routes", async (req, res) => {
  const { source, destination } = req.body;

  try {
    // Check if Haryana database exists
    if (!fs.existsSync(dbPath)) {
      return res.status(404).json({ message: "Database file not found" });
    }

    const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

    // Get distance + travel time using Google Maps API
    const gmapUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
      source
    )}&destinations=${encodeURIComponent(destination)}&key=${
      process.env.GOOGLE_MAPS_API_KEY
    }`;

    const response = await axios.get(gmapUrl);
    const element = response.data.rows[0].elements[0];
    const travelTime = element.duration?.text || "N/A";
    const distance = element.distance?.text || "N/A";

    // Match source/destination in bus routes
    const bestMatches = db.buses
      .filter(
        (b) =>
          b.route.toLowerCase().includes(source.toLowerCase()) &&
          b.route.toLowerCase().includes(destination.toLowerCase())
      )
      .map((bus) => ({
        busName: bus.name,
        route: bus.route,
        travelTime,
        distance,
        type: "Fastest Route",
        eta: bus.eta || 30,
        stops: bus.stops || [],
      }));

    res.json({ routes: bestMatches.slice(0, 3) });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error finding smart routes", error: error.message });
  }
});

// --- Notification Simulation Endpoints ---
// Endpoint to simulate bus delay
app.post("/api/simulate/delay", async (req, res) => {
  const { route, delay, estimatedTime } = req.body;
  
  try {
    // Send notification to all subscribers
    await sendBusDelayNotification(route, delay, estimatedTime);
    
    // Emit to all connected socket clients
    io.emit('notification', {
      type: 'delay',
      route,
      delay,
      estimatedTime
    });
    
    res.json({ message: 'Delay notification sent successfully' });
  } catch (error) {
    console.error('Error sending delay notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Endpoint to simulate route cancellation
app.post("/api/simulate/cancellation", async (req, res) => {
  const { route, reason } = req.body;
  
  try {
    // Send notification to all subscribers
    await sendRouteCancellationNotification(route, reason);
    
    // Emit to all connected socket clients
    io.emit('notification', {
      type: 'cancellation',
      route,
      reason
    });
    
    res.json({ message: 'Cancellation notification sent successfully' });
  } catch (error) {
    console.error('Error sending cancellation notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Endpoint to simulate traffic update
app.post("/api/simulate/traffic", async (req, res) => {
  const { route, update, impact } = req.body;
  
  try {
    // Send notification to all subscribers
    await sendTrafficUpdateNotification(route, update, impact);
    
    // Emit to all connected socket clients
    io.emit('notification', {
      type: 'traffic',
      route,
      update,
      impact
    });
    
    res.json({ message: 'Traffic update notification sent successfully' });
  } catch (error) {
    console.error('Error sending traffic notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// --- Start server ---
const PORT = process.env.PORT || 4000;
server.listen(PORT, () =>
  console.log(`🚀 Backend running on http://localhost:${PORT}`)
);