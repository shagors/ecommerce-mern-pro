const express = require("express");
const upload = require("../middlewares/uploadFile");
const runValidation = require("../validators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth");
const {
  handleCreateProduct,
  handleGetProducts,
  handleGetProduct,
  handleDeleteProduct,
} = require("../controllers/productController");
const { validateProduct } = require("../validators/product");
const productRouter = express.Router();

productRouter.post(
  "/",
  upload.single("image"),
  validateProduct,
  isLoggedIn,
  isAdmin,
  runValidation,
  handleCreateProduct
);
productRouter.get("/", handleGetProducts);

// get single product
productRouter.get("/:slug", handleGetProduct);

// delete single product
productRouter.delete("/:slug", isLoggedIn, isAdmin, handleDeleteProduct);

module.exports = productRouter;
