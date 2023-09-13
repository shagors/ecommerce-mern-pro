const express = require("express");
const runValidation = require("../validators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth");
const { validateCategory } = require("../validators/category");
const { handleCreateCategory } = require("../controllers/categoryController");
const categoryRouter = express.Router();

//
categoryRouter.post(
  "/",
  validateCategory,
  runValidation,
  isLoggedIn,
  isAdmin,
  handleCreateCategory
);

module.exports = categoryRouter;
