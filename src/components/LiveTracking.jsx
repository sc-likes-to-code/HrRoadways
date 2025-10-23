import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const socket = io("http://localhost:4000"); // backend URL

function LiveTracking() {
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    socket.on("initialData", (data) => setBuses(data));
    socket.on("busUpdate", (bus) => {
      setBuses((prev) => {
        const i = prev.findIndex((b) => b.busId === bus.busId);
        if (i !== -1) {
          const updated = [...prev];
          updated[i] = bus;
          return updated;
        } else return [...prev, bus];
      });
    });
    return () => socket.disconnect();
  }, []);

  const center = buses.length > 0 ? [buses[0].lat, buses[0].lng] : [28.6, 77.2];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">
        🗺️ Live Bus Tracking
      </h2>
      <MapContainer
        center={center}
        zoom={8}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {buses.map((bus) => (
          <Marker key={bus.busId} position={[bus.lat, bus.lng]}>
            <Popup>
              <strong>{bus.route}</strong>
              <br />
              Bus ID: {bus.busId}
              <br />
              Last Updated: {new Date(bus.lastUpdated).toLocaleTimeString()}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default LiveTracking;
