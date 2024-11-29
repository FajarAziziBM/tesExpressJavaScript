const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const placeSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    images: {
        url: {
            type: String,
            default: 'default-image-url.jpg'
        },
        filename: {
            type: String
        }
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Place", placeSchema);