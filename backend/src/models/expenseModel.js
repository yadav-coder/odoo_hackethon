const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Expense title is required"],
      trim: true
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: 0
    },
    category: {
      type: String,
      enum: ["food", "transport", "hotel", "activity", "shopping", "other"],
      default: "other"
    },
    date: {
      type: Date,
      default: Date.now
    },
    note: {
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

module.exports = mongoose.model("Expense", expenseSchema);

