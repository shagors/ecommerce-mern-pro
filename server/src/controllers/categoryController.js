const slugify = require("slugify");
const { successResponse } = require("./responseController");
const Category = require("../models/categoryModel");
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../services/categoryService");
const createError = require("http-errors");

// create new category
const handleCreateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    await createCategory(name);

    // create Category confirmation
    return successResponse(res, {
      statusCode: 201,
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
    const category = await getCategory(slug);

    if (!category) {
      throw createError(404, "Categories not found!!");
    }
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

// Update category
const handleUpdateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { slug } = req.params;

    const updatedCategory = await updateCategory(name, slug);
    if (!updatedCategory) {
      throw createError(404, "Category not found!!");
    }

    // create Category confirmation
    return successResponse(res, {
      statusCode: 200,
      message: "Category updated successfully",
      payload: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

// Delete category
const handleDeleteCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const result = await deleteCategory(slug);
    if (!result) {
      throw createError(404, "Category not found for delete!!");
    }

    // create Category confirmation
    return successResponse(res, {
      statusCode: 200,
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleCreateCategory,
  handleGetCategories,
  handleGetCategory,
  handleUpdateCategory,
  handleDeleteCategory,
};
