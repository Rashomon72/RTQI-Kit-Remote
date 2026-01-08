const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

// ----------------- MIDDLEWARE -----------------
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.body);
  console.log(req.url, req.method, req.headers['authorization']);
  next();
});

// ----------------- DATABASE CONNECTION -----------------
const MONGODB_ATLAS_URL = "mongodb+srv://RTQI:RTQI%40123@btp.ry9kl.mongodb.net/Control";
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_ATLAS_URL);
    console.log("✅ Connected to MongoDB!");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
  }
}
await connectDB();

// ----------------- TEST ROUTES -----------------
app.get("/", (req, res) => res.send('yo'));


// ----------------- ACTUAL ROUTES -----------------
app.use('/', require("./test"));


// ----------------- START SERVER -----------------
app.listen(3000, () => {
  console.log(`🚀 Server is running on http://0.0.0.0:3000`);
});
