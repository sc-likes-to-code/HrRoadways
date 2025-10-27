import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaLeaf, FaClock, FaRoute, FaTrafficLight, FaStar } from "react-icons/fa";

const SmartRoute = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const handleFindRoutes = async () => {
    if (!source || !destination) {
      alert("Please enter both source and destination");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/smart-route", {
        source,
        destination,
        userId: localStorage.getItem('userId') || 'default'
      });
      setRoutes(res.data.routes);
    } catch (error) {
      console.error(error);
      alert("Error fetching routes");
    } finally {
      setLoading(false);
    }
  };

  const handleRouteSelect = async (route) => {
    setSelectedRoute(route);

    // Record the selection for AI learning
    try {
      await axios.post("http://localhost:5000/api/smart-route/select-route", {
        userId: localStorage.getItem('userId') || 'default',
        routeName: route.busName,
        source,
        destination
      });
    } catch (error) {
      console.error('Error recording route selection:', error);
    }
  };

  const getEcoColor = (ecoScore) => {
    if (ecoScore >= 80) return 'text-green-600';
    if (ecoScore >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrafficColor = (trafficLevel) => {
    if (trafficLevel <= 30) return 'text-green-600';
    if (trafficLevel <= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <motion.div
      className="p-6 bg-white rounded-2xl shadow-md max-w-4xl mx-auto mt-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold text-center mb-4 flex items-center justify-center gap-2">
        <FaStar className="text-blue-600" />
        AI-Powered Smart Route Suggestions
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Intelligent recommendations balancing speed, sustainability, and your preferences
      </p>

      <div className="flex flex-col gap-3 mb-6">
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="Enter Source Location"
          className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Enter Destination Location"
          className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={handleFindRoutes}
          className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Analyzing Routes..." : "Find AI-Suggested Routes"}
        </button>
      </div>

      <div className="space-y-4">
        {routes.map((route, index) => (
          <motion.div
            key={index}
            className={`p-4 border-2 rounded-lg shadow-sm cursor-pointer transition-all ${
              selectedRoute?.busName === route.busName
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-gray-50 hover:border-gray-300'
            }`}
            whileHover={{ scale: 1.02 }}
            onClick={() => handleRouteSelect(route)}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-lg text-gray-800">{route.busName}</h3>
                <p className="text-sm text-gray-600">{route.recommendationReason}</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-700">AI Score</div>
                <div className="text-2xl font-bold text-blue-600">{route.aiScore}/100</div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
              <div className="flex items-center gap-2">
                <FaClock className="text-gray-500" />
                <div>
                  <div className="text-sm text-gray-600">Travel Time</div>
                  <div className="font-medium">{route.travelTime}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <FaRoute className="text-gray-500" />
                <div>
                  <div className="text-sm text-gray-600">Distance</div>
                  <div className="font-medium">{route.distance}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <FaTrafficLight className={getTrafficColor(route.trafficLevel)} />
                <div>
                  <div className="text-sm text-gray-600">Traffic</div>
                  <div className={`font-medium ${getTrafficColor(route.trafficLevel)}`}>
                    {route.trafficLevel}% congestion
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <FaLeaf className={getEcoColor(route.environmentalImpact.ecoScore)} />
                <div>
                  <div className="text-sm text-gray-600">Eco Score</div>
                  <div className={`font-medium ${getEcoColor(route.environmentalImpact.ecoScore)}`}>
                    {route.environmentalImpact.ecoScore}/100
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Type: {route.type}</span>
                {route.environmentalImpact.isEcoFriendly && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    🌱 Eco-Friendly
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600">
                CO₂: {route.environmentalImpact.carbonFootprint}g
              </div>
            </div>

            {route.stops && route.stops.length > 0 && (
              <div className="mt-3">
                <div className="text-sm text-gray-600 mb-1">Stops:</div>
                <div className="text-sm text-gray-800">
                  {route.stops.join(" → ")}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {routes.length === 0 && !loading && (
        <div className="text-center text-gray-500 mt-8">
          Enter locations above to get AI-powered route suggestions
        </div>
      )}
    </motion.div>
  );
};

export default SmartRoute;
