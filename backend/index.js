require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const cron = require("node-cron");
const updateDelayedReports = require("./utils/delayedReport.js");

const connectDB = require("./config/mongodb.js");
const connectCloudinary = require("./config/cloudinary.js");

const adminRouter = require("./routes/adminRoute.js");
const userRouter = require("./routes/userRoute.js");
const workerRoute = require("./routes/workerRoute.js");
const reportRouter = require("./routes/reportRoute.js");
const notificationRouter = require("./routes/notificationRoute.js");
const settingsRouter = require("./routes/settingsRoute.js");
const zoneModel = require("./models/zoneModel.js");

// app config
const app = express();
const port = process.env.PORT || 3000;

connectDB();
connectCloudinary();

const server = http.createServer(app);

//socket setup
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174", "https://ecobin-platform.vercel.app", "https://ecobin-admin-platform.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

cron.schedule("*/1 * * * *", async () => {
  console.log("Checking delayed reports...");
  await updateDelayedReports(io);
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    console.log("Registered User:", userId);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected::", socket.id);
  });
});

app.set("io", io);

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "https://ecobin-platform.vercel.app", "https://ecobin-admin-platform.vercel.app"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);

// routes
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
app.use("/api/worker", workerRoute);
app.use("/api/report", reportRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/settings", settingsRouter);

app.get("/", (req, res) => {
  res.send("Server is Working Good");
});

app.get("/api/zones", async (req, res) => {
  try {
    const zones = await zoneModel.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      zones,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
