require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/user");
const { checkforauthentication, restrictTo } = require("./middlewares/auth");
const User = require("./models/user");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 8000;

// Database connection
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection error:", err));

// Updated CORS configuration
app.use(cors({
  origin: true, // Allow all origins
  credentials: true, // Allow credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization', 'Token'] // Allowed headers
}));

// Middleware
app.use(cookieParser());  
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../Frontend/dist')));
app.use("/images", express.static(path.join(__dirname, "../admin/public/img")));

// Routes
app.use("/", userRoute);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

// Admin route
app.get(
  "/admin",
  checkforauthentication(),
  restrictTo(["ADMIN"]),
  (req, res) => {
    res.json({ status: "admin access granted" });
    return res.redirect("/admin-dashboard");
  }
);

// Clear user route
app.get("/clear/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect("/doctors-detail");
  } catch (error) {
    console.error(error);
    res.status(500).send("server error");
  }
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend/dist/index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: err.message });
});

// Start server
app.listen(PORT, () => console.log(`Server started at port: ${PORT}`));
