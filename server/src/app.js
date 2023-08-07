const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const createError = require("http-errors");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");

const app = express();

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: "Too many request from this IP. Please try again later!!",
});

// middleware
app.use(rateLimiter);
app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use(xssClean());
app.use(express.urlencoded({ extended: true }));

app.get("/test", (req, res) => {
  res.status(200).send({
    message: "api test is working fine",
  });
});

app.get("/api/users", (req, res) => {
  res.status(200).send({
    message: "api test is working fine",
  });
});

// client error message
app.use((req, res, next) => {
  next(createError(404, "Route not found"));
});

// server error message
app.use((err, req, res, next) => {
  return res.status(err.status || 500).json({
    success: false,
    message: err.message,
  });
});

module.exports = app;
