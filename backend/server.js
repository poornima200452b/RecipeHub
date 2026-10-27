
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const userRoutes = require("./routes/userRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const questionRoutes = require("./routes/questionRoutes");

const { protect, authorizeRoles } = require("./middleware/authMiddleware");

const app = express();

// Middleware
app.use(express.json());

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://recipehub-frontend-huha.onrender.com"
        ]
    })
);

// API routes
app.use("/api/questions", questionRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/recipes", recipeRoutes);

// Home route
app.get("/", (req, res) => {
    res.send("RecipeHub Backend is Running!");
});

// Auth profile route
app.get("/api/auth/profile", protect, (req, res) => {
    res.status(200).json({
        message: "You are authenticated!",
        user: req.user
    });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Chef dashboard
app.get(
    "/api/chef/dashboard",
    protect,
    authorizeRoles("chef"),
    (req, res) => {
        res.status(200).json({
            message: "Welcome to the Chef Dashboard!",
            user: req.user
        });
    }
);

// Server startup
const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000
        });

        console.log("MongoDB connected successfully!");

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
}

startServer();
