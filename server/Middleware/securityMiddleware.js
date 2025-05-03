import rateLimit from "express-rate-limit";

const blacklistedIps = new Set();

export const userAgentBlocker = (req, res, next) => {
  const userAgent = req.headers["user-agent"] || "";
  const blockedAgents = [
    /PostmanRuntime/i,
    /Insomnia/i,
    /curl/i,
    /wget/i,
    /python-requests/i,
    /httpie/i,
    /axios/i,
    /Go-http-client/i,
    /Java\/[0-9.]+/i,
    /libwww-perl/i,
  ];

  if (blockedAgents.some((pattern) => pattern.test(userAgent))) {
    return res
      .status(403)
      .json({ message: "Bots or automated tools are not allowed." });
  }
  next();
};

export const ipBlacklistMiddleware = (req, res, next) => {
  const ip = req.ip;
  if (blacklistedIps.has(ip)) {
    return res.status(403).json({ message: "Your IP has been blacklisted." });
  }
  next();
};

export const rapidRequestLimiter = rateLimit({
  windowMs: 1000,
  max: 5,
  handler: (req, res) => {
    res.status(429).json({
      status: 429,
      error: "Too many requests - slow down.",
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});
