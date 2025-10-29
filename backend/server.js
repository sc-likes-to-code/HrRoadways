// backend/server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import axios from "axios";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

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

// Real-time socket connection
io.on("connection", (socket) => {
  console.log("🟢 New client connected");
  socket.emit("initialData", Object.values(buses));
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

// --- Start server ---
const PORT = process.env.PORT || 4000;
server.listen(PORT, () =>
  console.log(`🚀 Backend running on http://localhost:${PORT}`)
);
