const cors = require("cors");

const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const app = express();

const { protect, authorizeRoles } = require("./middleware/authMiddleware");

const recipeRoutes = require("./routes/recipeRoutes");

const userRoutes = require("./routes/userRoutes");

const ratingRoutes = require("./routes/ratingRoutes");

const reviewRoutes = require("./routes/reviewRoutes");

const questionRoutes = require("./routes/questionRoutes");

// Middleware to read JSON request bodies
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use("/api/questions", questionRoutes);

app.use("/api/reviews", reviewRoutes);

app.use("/api/ratings", ratingRoutes);

app.use("/api/users", userRoutes);

app.use("/api/recipes", recipeRoutes);


// Home route
app.get("/", (req, res) => {
    res.send("RecipeHub Backend is Running!");
});
app.get("/api/auth/profile", protect, (req, res) => {
    res.status(200).json({
        message: "You are authenticated!",
        user: req.user
    });
});

app.use("/api/auth", (req, res, next) => {
    console.log("AUTH REQUEST:", req.method, req.originalUrl);
    next();
});


// Authentication routes
app.use("/api/auth", authRoutes);

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

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");

        app.listen(process.env.PORT || 3000, () => {
            console.log("Server running on port 3000");
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });
