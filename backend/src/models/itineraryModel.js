const mongoose = require("mongoose");

const itinerarySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Itinerary title is required"],
      trim: true
    },
    location: {
      type: String,
      default: ""
    },
    notes: {
      type: String,
      default: ""
    },
    date: {
      type: Date,
      required: [true, "Date is required"]
    },
    startTime: {
      type: String,
      default: ""
    },
    endTime: {
      type: String,
      default: ""
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Itinerary", itinerarySchema);

