const slugify = require("slugify");
const { successResponse } = require("./responseController");
const Category = require("../models/categoryModel");
const {
  createCategory,
  getCategories,
  getCategory,
} = require("../services/categoryService");

// create new category
const handleCreateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    await createCategory(name);

    // create Category confirmation
    return successResponse(res, {
      statusCode: 200,
      message: "Category created successfully",
    });
  } catch (error) {
    next(error);
  }
};

// get category
const handleGetCategories = async (req, res, next) => {
  try {
    const categories = await getCategories();
    // create Category confirmation
    return successResponse(res, {
      statusCode: 200,
      message: "Categories fetch successfully",
      payload: categories,
    });
  } catch (error) {
    next(error);
  }
};

// single category
const handleGetCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const categories = await getCategory(slug);
    // create Category confirmation
    return successResponse(res, {
      statusCode: 200,
      message: "Categories fetch successfully",
      payload: categories,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleCreateCategory,
  handleGetCategories,
  handleGetCategory,
};
