const express = require("express");
const runValidation = require("../validators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth");
const { validateCategory } = require("../validators/category");
const {
  handleCreateCategory,
  handleGetCategories,
  handleGetCategory,
} = require("../controllers/categoryController");
const categoryRouter = express.Router();

// category making
categoryRouter.post(
  "/",
  validateCategory,
  runValidation,
  isLoggedIn,
  isAdmin,
  handleCreateCategory
);
// Get Category
categoryRouter.get("/", handleGetCategories);
categoryRouter.get("/:slug", handleGetCategory);

module.exports = categoryRouter;
