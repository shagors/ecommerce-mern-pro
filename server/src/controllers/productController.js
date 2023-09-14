const createError = require("http-errors");
const { successResponse } = require("./responseController");
const { findWithId } = require("../services/findItem");
const Product = require("../models/productModel");
const slugify = require("slugify");
const {
  createProduct,
  getAllProduct,
  getSingleProduct,
  deleteSingleProduct,
} = require("../services/productService");

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

// All products Get  API make
const handleGetProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;

    // find all products and set pagination for pages because products comes many. User don't want to show all products at a time
    const productData = await getAllProduct(page, limit);

    // when get user then send success token send to browser for check valid user or not
    return successResponse(res, {
      statusCode: 200,
      message: "Products returned successfully",
      payload: {
        products: productData.products,
        pagination: {
          totalPages: productData.totalPages,
          currentPage: page,
          previousPage: page - 1,
          nextPage: page + 1,
          totalNumberOfProducts: productData.count,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
// product Get  API make
const handleGetProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const product = await getSingleProduct(slug);
    // when get user then send success token send to browser for check valid user or not
    return successResponse(res, {
      statusCode: 200,
      message: "Product returned successfully",
      payload: product,
    });
  } catch (error) {
    next(error);
  }
};

// product Delete  API make
const handleDeleteProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const product = await deleteSingleProduct(slug);
    // when get user then send success token send to browser for check valid user or not
    return successResponse(res, {
      statusCode: 200,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleCreateProduct,
  handleGetProducts,
  handleGetProduct,
  handleDeleteProduct,
};
