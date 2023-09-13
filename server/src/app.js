const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const createError = require("http-errors");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");
const userRouter = require("./routers/userRouter");
const seedRouter = require("./routers/seedRouter");
const { errorResponse } = require("./controllers/responseController");
const authRouter = require("./routers/authRouter");
const categoryRouter = require("./routers/categoryRouter");

const app = express();

// set user limit request per minuits
const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: "Too many request from this IP. Please try again later!!",
});

// middleware
app.use(cookieParser());
app.use(rateLimiter);
app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use(xssClean());
app.use(express.urlencoded({ extended: true }));

// routers
app.use("/api/seed", seedRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/categories", categoryRouter);

// client error message
app.use((req, res, next) => {
  next(createError(404, "Route not found"));
});

// server error message
app.use((err, req, res, next) => {
  return errorResponse(res, {
    statusCode: err.status,
    message: err.message,
  });
});

module.exports = app;
