const createError = require("http-errors");
const { successResponse } = require("./responseController");
const { findWithId } = require("../services/findItem");
const Product = require("../models/productModel");
const slugify = require("slugify");
const { createProduct } = require("../services/productService");

// product create API make
const handleCreateProduct = async (req, res, next) => {
  try {
    const { name, description, price, quantity, shipping, category } = req.body;

    const image = req.file;
    if (!image) {
      throw createError(400, "Image file is required");
    }

    if (image.size > 2 * 1024 * 1024) {
      throw new Error("Image size is too large. Please select below 2 MB");
    }

    const imageBufferString = image.buffer.toString("base64");

    const productData = {
      name,
      description,
      price,
      quantity,
      shipping,
      category,
      imageBufferString,
    };

    const product = await createProduct(productData);

    // when get user then send success token send to browser for check valid user or not
    return successResponse(res, {
      statusCode: 200,
      message: "Product created successfully",
      payload: product,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { handleCreateProduct };
