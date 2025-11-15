import fs from 'fs';
import path from 'path';

// AI-powered route suggestion utilities

// Simulate user travel patterns (in a real app, this would come from a database)
const getUserTravelPatterns = (userId = 'default') => {
  const patternsPath = path.join(process.cwd(), 'Databases', 'user_patterns.json');

  try {
    if (fs.existsSync(patternsPath)) {
      const patterns = JSON.parse(fs.readFileSync(patternsPath, 'utf-8'));
      return patterns[userId] || {};
    }
  } catch (error) {
    console.error('Error reading user patterns:', error);
  }

  return {};
};

// Calculate environmental impact score (lower is better)
const calculateEnvironmentalImpact = (distance, routeType, trafficLevel) => {
  // Base carbon emission per km (in grams CO2)
  const baseEmissionPerKm = {
    'bus': 85,      // grams CO2 per km for bus
    'express': 90,  // slightly higher for express buses
    'local': 80,    // lower for local services
    'eco': 70,      // eco-friendly routes
    'green': 65,    // green line routes
    'solar': 60,    // solar powered
    'sustainable': 68 // sustainable routes
  };

  const baseEmission = baseEmissionPerKm[routeType.toLowerCase()] || 85;

  // Traffic multiplier (higher traffic = more idling = more emissions)
  const trafficMultiplier = 1 + (trafficLevel / 100) * 0.3;

  // Calculate total carbon footprint
  const carbonFootprint = distance * baseEmission * trafficMultiplier;

  // Environmental score (0-100, higher is better)
  const ecoScore = Math.max(0, 100 - (carbonFootprint / 10));

  return {
    carbonFootprint: Math.round(carbonFootprint),
    ecoScore: Math.round(ecoScore),
    isEcoFriendly: ecoScore > 70
  };
};

// Simulate weather impact on traffic
const getWeatherImpact = () => {
  // Simplified weather simulation
  const weatherConditions = ['clear', 'rainy', 'foggy', 'stormy'];
  const randomWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];

  const weatherMultipliers = {
    'clear': 1.0,
    'rainy': 1.3,  // Rain increases travel time
    'foggy': 1.4,  // Fog reduces visibility
    'stormy': 1.6  // Storms can cause delays
  };

  return {
    condition: randomWeather,
    multiplier: weatherMultipliers[randomWeather],
    impact: randomWeather === 'clear' ? 'Minimal' :
            randomWeather === 'rainy' ? 'Moderate' : 'High'
  };
};

// Simulate real-time traffic conditions
const getTrafficConditions = (source, destination) => {
  // In a real app, this would call a traffic API
  // For now, simulate based on time and route
  const currentHour = new Date().getHours();
  const currentDay = new Date().getDay(); // 0 = Sunday, 6 = Saturday

  // Get weather impact
  const weather = getWeatherImpact();

  // Base traffic levels
  let baseTraffic = Math.random() * 40;

  // Time-based traffic patterns
  if (currentHour >= 7 && currentHour <= 9) {
    baseTraffic += 35; // Morning rush hour
  } else if (currentHour >= 17 && currentHour <= 19) {
    baseTraffic += 40; // Evening rush hour
  } else if (currentHour >= 11 && currentHour <= 13) {
    baseTraffic += 15; // Lunch hour
  }

  // Weekend adjustments
  if (currentDay === 0 || currentDay === 6) {
    baseTraffic *= 0.7; // Less traffic on weekends
  }

  // Route-specific factors
  const routeKey = `${source.toLowerCase()}-${destination.toLowerCase()}`;
  const busyRoutes = ['delhi', 'gurgaon', 'chandigarh'];

  busyRoutes.forEach(busyRoute => {
    if (routeKey.includes(busyRoute)) {
      baseTraffic += 15;
    }
  });

  // Seasonal/weather simulation (simplified)
  const month = new Date().getMonth();
  if (month >= 5 && month <= 8) { // Monsoon season
    baseTraffic += 10; // More traffic due to weather
  }

  // Apply weather multiplier
  baseTraffic *= weather.multiplier;

  return Math.min(100, Math.max(0, baseTraffic));
};

// AI algorithm to score and rank routes
const scoreRoutesWithAI = (routes, source, destination, userId = 'default') => {
  const userPatterns = getUserTravelPatterns(userId);

  return routes.map(route => {
    const trafficLevel = getTrafficConditions(source, destination);
    const envImpact = calculateEnvironmentalImpact(
      parseFloat(route.distance) || 10, // fallback distance
      route.type || 'bus',
      trafficLevel
    );

    // AI scoring factors
    let score = 0;

    // 1. Travel time preference (based on user patterns)
    const preferredSpeed = userPatterns.preferredSpeed || 'balanced';
    const timeWeight = preferredSpeed === 'fast' ? 0.4 :
                      preferredSpeed === 'eco' ? 0.2 : 0.3;
    score += (100 - route.eta) * timeWeight; // Lower ETA = higher score

    // 2. Environmental preference
    const ecoWeight = userPatterns.ecoPreference ? 0.3 : 0.1;
    score += envImpact.ecoScore * ecoWeight;

    // 3. Traffic consideration
    const trafficPenalty = trafficLevel * 0.2;
    score -= trafficPenalty;

    // 4. Route familiarity (prefer routes user has taken before)
    const familiarityBonus = userPatterns.favoriteRoutes?.includes(route.busName) ? 10 : 0;
    score += familiarityBonus;

    // 5. Distance efficiency
    const distanceEfficiency = Math.max(0, 100 - (parseFloat(route.distance) || 10));
    score += distanceEfficiency * 0.1;

    return {
      ...route,
      aiScore: Math.round(Math.max(0, Math.min(100, score))),
      trafficLevel: Math.round(trafficLevel),
      environmentalImpact: envImpact,
      recommendationReason: generateRecommendationReason(route, envImpact, trafficLevel, userPatterns)
    };
  }).sort((a, b) => b.aiScore - a.aiScore); // Sort by AI score descending
};

// Generate human-readable recommendation reason
const generateRecommendationReason = (route, envImpact, trafficLevel, userPatterns) => {
  const reasons = [];

  if (envImpact.isEcoFriendly) {
    reasons.push('Low carbon footprint');
  }

  if (trafficLevel < 30) {
    reasons.push('Light traffic expected');
  } else if (trafficLevel > 70) {
    reasons.push('May experience traffic delays');
  }

  if (route.eta < 45) {
    reasons.push('Quick travel time');
  }

  if (userPatterns.favoriteRoutes?.includes(route.busName)) {
    reasons.push('Previously used route');
  }

  return reasons.length > 0 ? reasons.join(', ') : 'Balanced option';
};

// Update user travel patterns when they select a route
const updateUserTravelPattern = (userId = 'default', routeName, source, destination) => {
  const patternsPath = path.join(process.cwd(), 'Databases', 'user_patterns.json');

  try {
    let patterns = {};
    if (fs.existsSync(patternsPath)) {
      patterns = JSON.parse(fs.readFileSync(patternsPath, 'utf-8'));
    }

    if (!patterns[userId]) {
      patterns[userId] = {
        favoriteRoutes: [],
        preferredSpeed: 'balanced',
        ecoPreference: false,
        travelHistory: []
      };
    }

    // Add to favorite routes if used multiple times
    if (!patterns[userId].favoriteRoutes.includes(routeName)) {
      patterns[userId].favoriteRoutes.push(routeName);
    }

    // Add to travel history
    patterns[userId].travelHistory.push({
      route: routeName,
      source,
      destination,
      timestamp: new Date().toISOString()
    });

    // Keep only last 10 trips
    if (patterns[userId].travelHistory.length > 10) {
      patterns[userId].travelHistory = patterns[userId].travelHistory.slice(-10);
    }

    fs.writeFileSync(patternsPath, JSON.stringify(patterns, null, 2));
  } catch (error) {
    console.error('Error updating user patterns:', error);
  }
};

export {
  scoreRoutesWithAI,
  calculateEnvironmentalImpact,
  getTrafficConditions,
  updateUserTravelPattern,
  getUserTravelPatterns
};