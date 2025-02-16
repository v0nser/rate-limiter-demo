const mongoose = require("mongoose");

const rateLimitSchema = new mongoose.Schema({
  ip: { type: String, required: true }, // Store IP address
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // Optional: User-based rate limiting
  endpoint: { type: String, required: true }, // API route being accessed
  requests: { type: Number, default: 1 }, // Number of requests made
  createdAt: { type: Date, default: Date.now, expires: 60 }, // Auto-delete after 60 sec
});

module.exports = mongoose.model("RateLimit", rateLimitSchema);
