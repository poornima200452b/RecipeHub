
const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
    {
        recipe: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Recipe",
            required: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
            validate: {
                validator: Number.isInteger,
                message: "Rating must be a whole number from 1 to 5"
            }
        }
    },
    {
        timestamps: true
    }
);

// One rating per user for each recipe
ratingSchema.index(
    { recipe: 1, user: 1 },
    { unique: true }
);

const Rating = mongoose.model("Rating", ratingSchema);

module.exports = Rating;
