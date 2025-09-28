const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const axios = require("axios");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://aiswo-simple-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.database();

// 🔹 Dummy bins (bin2, bin3)
const dummyBins = {
  bin2: {
    weightKg: 12,
    fillPct: 85,
    status: "Full",
    updatedAt: new Date().toISOString(),
    name: "Main Street Bin",
    location: "Main Street, Downtown",
    capacity: 50,
    operatorId: "op1",
    history: [
      { ts: "2025-09-20 10:00", weightKg: 10, fillPct: 70 },
      { ts: "2025-09-20 11:00", weightKg: 12, fillPct: 85 }
    ]
  },
  bin3: {
    weightKg: 7,
    fillPct: 50,
    status: "Normal",
    updatedAt: new Date().toISOString(),
    name: "Park Avenue Bin",
    location: "Park Avenue, Central Park",
    capacity: 40,
    operatorId: "op2",
    history: [
      { ts: "2025-09-20 10:00", weightKg: 6, fillPct: 45 },
      { ts: "2025-09-20 11:00", weightKg: 7, fillPct: 50 }
    ]
  }
};

// 🔹 Dummy operators
const dummyOperators = {
  op1: {
    name: "John Smith",
    email: "john.smith@smartbins.com",
    phone: "+1-555-0123",
    assignedBins: ["bin2"],
    createdAt: new Date().toISOString()
  },
  op2: {
    name: "Sarah Johnson",
    email: "sarah.johnson@smartbins.com",
    phone: "+1-555-0124",
    assignedBins: ["bin3"],
    createdAt: new Date().toISOString()
  }
};


// ================= Email & FCM Notification Setup =================

// Track bins that have already triggered an alert
const notifiedBins = {};
// Configure your email here
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "m.charaghyousafkhan@gmail.com", // TODO: Replace with your email
    pass: "vskvkbyqrfqjdail" // TODO: Replace with your app password (not your Gmail password)
  }
});

function sendBinAlertEmail(binId, fillPct) {
  const mailOptions = {
    from: 'm.charaghyousafkhan@gmail.com',
    to: 'm.charagh02@gmail.com',
    subject: `ALERT: Bin ${binId} is almost full!`,
    text: `Bin ${binId} is at ${fillPct}% fill. Please take action.`
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error('Error sending email:', error);
    }
    console.log('Email sent:', info.response);
  });
}

// FCM push notification function
function sendBinAlertPush(binId, fillPct, fcmToken) {
  const message = {
    notification: {
      title: `Bin ${binId} is almost full!`,
      body: `Bin ${binId} is at ${fillPct}% fill. Please take action.`
    },
    token: fcmToken
  };
  admin.messaging().send(message)
    .then((response) => {
      console.log('Push notification sent:', response);
    })
    .catch((error) => {
      console.error('Error sending push notification:', error);
    });
}

// ================= Weather Monitoring =================

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || "f4c33dca360f8875d88a28fbd7cf34e3";
let lastWeatherCheck = 0;
const WEATHER_CHECK_INTERVAL = 3 * 60 * 60 * 1000; // 3 hours

async function checkWeatherAndSendAlerts() {
  try {
    const currentTime = Date.now();
    if (currentTime - lastWeatherCheck < WEATHER_CHECK_INTERVAL) {
      return; // Skip if checked recently
    }

    lastWeatherCheck = currentTime;
    
    // Get current location (you can modify this to get actual location)
    const lat = 40.7128; // New York coordinates as default
    const lon = -74.0060;
    
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    
    const weather = weatherResponse.data;
    const weatherId = weather.weather[0].id;
    
    // Check for rain conditions
    if (weatherId >= 500 && weatherId < 600) {
      console.log("🌧️ Rain detected! Sending weather alerts...");
      
      // Send alerts to all operators
      for (const [operatorId, operator] of Object.entries(dummyOperators)) {
        const weatherAlertEmail = {
          from: 'm.charaghyousafkhan@gmail.com',
          to: operator.email,
          subject: `🌧️ Weather Alert: Rain Expected - Bin Monitoring Required`,
          text: `Dear ${operator.name},\n\nRain is expected in your area. Please check your assigned bins for potential overflow issues.\n\nWeather Details:\n- Condition: ${weather.weather[0].description}\n- Temperature: ${weather.main.temp}°C\n- Humidity: ${weather.main.humidity}%\n\nPlease ensure bins are properly secured and monitor for overflow.\n\nBest regards,\nSmart Bin Monitoring System`
        };
        
        transporter.sendMail(weatherAlertEmail, (error, info) => {
          if (error) {
            console.error('Error sending weather alert email:', error);
          } else {
            console.log(`Weather alert email sent to ${operator.name}:`, info.response);
          }
        });
      }
    }
  } catch (error) {
    console.error('Error checking weather:', error);
  }
}

// ================= Routes =================

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 🔹 All bins (merge real bin1 + dummy bins)
app.get("/bins", async (req, res) => {
  try {
    const snapshot = await db.ref("bins/bin1").once("value");
    const bin1 = snapshot.val() || {};   // safe return

    const bins = {
      bin1,
      ...dummyBins
    };

    // Add last updated timestamp to each bin
    Object.keys(bins).forEach(id => {
      if (bins[id]) {
        bins[id].lastFetched = new Date().toISOString();
      }
    });

    // 🔔 Notification check (email & push alert)
    // TODO: Replace with real FCM tokens for each user/device
    const testFcmToken = "fkGOPdEiReizD1mj7d3a0M:APA91bG2d9ACAzMgclkwT9xgsy9AC5dMZRNH-65Gyya3nu8ATEJQKJcHruVOHJDAfECJTn8PbYvI_viILwFppiirF2oaNBKJpcznBwFPt11zdsQK54eaSqY";
    Object.entries(bins).forEach(([id, bin]) => {
      if (bin.fillPct > 80) {
        if (!notifiedBins[id]) {
          console.log(`⚠️ ALERT: ${id} is almost full (${bin.fillPct}%)`);
          
          // Send email to assigned operator
          if (bin.operatorId && dummyOperators[bin.operatorId]) {
            const operator = dummyOperators[bin.operatorId];
            const operatorAlertEmail = {
              from: 'm.charaghyousafkhan@gmail.com',
              to: operator.email,
              subject: `🚨 URGENT: Bin ${id} is Full - Immediate Action Required`,
              text: `Dear ${operator.name},\n\nBin ${id} (${bin.name || id}) is at ${bin.fillPct}% capacity and needs immediate attention.\n\nBin Details:\n- Location: ${bin.location || 'Not specified'}\n- Current Weight: ${bin.weightKg} kg\n- Fill Level: ${bin.fillPct}%\n- Status: ${bin.status}\n\nPlease empty this bin as soon as possible to prevent overflow.\n\nBest regards,\nSmart Bin Monitoring System`
            };
            
            transporter.sendMail(operatorAlertEmail, (error, info) => {
              if (error) {
                console.error('Error sending operator alert email:', error);
              } else {
                console.log(`Operator alert email sent to ${operator.name}:`, info.response);
              }
            });
          }
          
          // Send general alert email
          sendBinAlertEmail(id, bin.fillPct);
          
          if (testFcmToken && testFcmToken !== "YOUR_FCM_DEVICE_TOKEN_HERE") {
            sendBinAlertPush(id, bin.fillPct, testFcmToken);
          }
          notifiedBins[id] = true;
        }
      } else {
        // Reset notification if bin is no longer above threshold
        notifiedBins[id] = false;
      }
    });

    // Check weather and send alerts
    await checkWeatherAndSendAlerts();

    res.json(bins);
  } catch (err) {
    console.error("Error fetching bins:", err);
    res.status(500).json({ error: "Failed to fetch bins" });
  }
});

// 🔹 Single bin
app.get("/bins/:id", async (req, res) => {
  const id = req.params.id;
  try {
    if (id === "bin1") {
      const snapshot = await db.ref("bins/bin1").once("value");
      return res.json(snapshot.val() || {}); // safe return
    } else if (dummyBins[id]) {
      return res.json(dummyBins[id]);
    } else {
      return res.status(404).json({ error: "Bin not found" });
    }
  } catch (err) {
    console.error(`Error fetching bin ${id}:`, err);
    res.status(500).json({ error: "Failed to fetch bin" });
  }
});

// 🔹 Bin history
app.get("/bins/:id/history", async (req, res) => {
  const id = req.params.id;
  try {
    if (id === "bin1") {
      const snapshot = await db.ref("bins/bin1/history").once("value");
      return res.json(snapshot.val() || []); // safe return
    } else if (dummyBins[id]) {
      return res.json(dummyBins[id].history);
    } else {
      return res.status(404).json({ error: "History not found" });
    }
  } catch (err) {
    console.error(`Error fetching history for ${id}:`, err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// 🔹 Statistics endpoint
app.get("/stats", async (req, res) => {
  try {
    const snapshot = await db.ref("bins/bin1").once("value");
    const bin1 = snapshot.val() || {};
    
    const allBins = {
      bin1,
      ...dummyBins
    };

    const stats = {
      totalBins: Object.keys(allBins).length,
      normalBins: Object.values(allBins).filter(bin => bin.fillPct <= 60).length,
      warningBins: Object.values(allBins).filter(bin => bin.fillPct > 60 && bin.fillPct <= 80).length,
      fullBins: Object.values(allBins).filter(bin => bin.fillPct > 80).length,
      averageFillLevel: Object.values(allBins).reduce((sum, bin) => sum + (bin.fillPct || 0), 0) / Object.keys(allBins).length,
      totalWeight: Object.values(allBins).reduce((sum, bin) => sum + (bin.weightKg || 0), 0),
      lastUpdated: new Date().toISOString()
    };

    res.json(stats);
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

// ================= Operator Management =================

// Get all operators
app.get("/operators", (req, res) => {
  res.json(dummyOperators);
});

// Get single operator
app.get("/operators/:id", (req, res) => {
  const id = req.params.id;
  if (dummyOperators[id]) {
    res.json(dummyOperators[id]);
  } else {
    res.status(404).json({ error: "Operator not found" });
  }
});

// Create new operator
app.post("/operators", (req, res) => {
  const { id, name, email, phone, assignedBins } = req.body;
  
  if (!id || !name || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  
  dummyOperators[id] = {
    name,
    email,
    phone: phone || '',
    assignedBins: assignedBins || [],
    createdAt: new Date().toISOString()
  };
  
  res.json({ message: "Operator created successfully", operator: dummyOperators[id] });
});

// Update operator
app.put("/operators/:id", (req, res) => {
  const id = req.params.id;
  const { name, email, phone, assignedBins } = req.body;
  
  if (!dummyOperators[id]) {
    return res.status(404).json({ error: "Operator not found" });
  }
  
  dummyOperators[id] = {
    ...dummyOperators[id],
    name: name || dummyOperators[id].name,
    email: email || dummyOperators[id].email,
    phone: phone || dummyOperators[id].phone,
    assignedBins: assignedBins || dummyOperators[id].assignedBins,
    updatedAt: new Date().toISOString()
  };
  
  res.json({ message: "Operator updated successfully", operator: dummyOperators[id] });
});

// Delete operator
app.delete("/operators/:id", (req, res) => {
  const id = req.params.id;
  
  if (!dummyOperators[id]) {
    return res.status(404).json({ error: "Operator not found" });
  }
  
  delete dummyOperators[id];
  res.json({ message: "Operator deleted successfully" });
});

// ================= Bin Management =================

// Create new bin
app.post("/bins", (req, res) => {
  const { id, name, location, capacity, operatorId, status } = req.body;
  
  if (!id) {
    return res.status(400).json({ error: "Bin ID is required" });
  }
  
  dummyBins[id] = {
    weightKg: 0,
    fillPct: 0,
    status: status || "Active",
    updatedAt: new Date().toISOString(),
    name: name || id,
    location: location || '',
    capacity: capacity || 50,
    operatorId: operatorId || '',
    history: []
  };
  
  res.json({ message: "Bin created successfully", bin: dummyBins[id] });
});

// Update bin
app.put("/bins/:id", (req, res) => {
  const id = req.params.id;
  const { name, location, capacity, operatorId, status } = req.body;
  
  if (!dummyBins[id]) {
    return res.status(404).json({ error: "Bin not found" });
  }
  
  dummyBins[id] = {
    ...dummyBins[id],
    name: name || dummyBins[id].name,
    location: location || dummyBins[id].location,
    capacity: capacity || dummyBins[id].capacity,
    operatorId: operatorId || dummyBins[id].operatorId,
    status: status || dummyBins[id].status,
    updatedAt: new Date().toISOString()
  };
  
  res.json({ message: "Bin updated successfully", bin: dummyBins[id] });
});

// Delete bin
app.delete("/bins/:id", (req, res) => {
  const id = req.params.id;
  
  if (!dummyBins[id]) {
    return res.status(404).json({ error: "Bin not found" });
  }
  
  delete dummyBins[id];
  res.json({ message: "Bin deleted successfully" });
});

// ==========================================

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚀 Backend running on http://localhost:${PORT}`)
);
