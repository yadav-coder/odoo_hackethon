const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const tripRoutes = require("./routes/tripRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const itineraryRoutes = require("./routes/itineraryRoutes");
const userRoutes = require("./routes/userRoutes");
const packingRoutes = require("./routes/packingRoutes");
const noteRoutes = require("./routes/noteRoutes");
const communityRoutes = require("./routes/communityRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const adminRoutes = require("./routes/adminRoutes");
const destinationRoutes = require("./routes/destinationRoutes");
const previousTripRoutes = require("./routes/previousTripRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TraveEaseloop API is running"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/previous-trips", previousTripRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/itineraries", itineraryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/packing", packingRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

