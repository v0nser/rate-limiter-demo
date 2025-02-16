const RateLimit = require("../models/RateLimit");

const mongoRateLimiter = async (req, res, next) => {
  const ip = req.ip;
  const userId = req.user?.id; // If using authentication
  const endpoint = req.originalUrl;
  const maxRequests = 10; // Max requests per minute

  const existingRecord = await RateLimit.findOne({ ip, endpoint });

  if (existingRecord) {
    if (existingRecord.requests >= maxRequests) {
      return res.status(429).json({ message: "Too many requests. Please try again later." });
    }
    existingRecord.requests += 1;
    await existingRecord.save();
  } else {
    await RateLimit.create({ ip, userId, endpoint });
  }

  next();
};

module.exports = mongoRateLimiter;
