const { body } = require("express-validator");

const validateProduct = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product Name is required!!")
    .isLength({ min: 3, max: 150 })
    .withMessage("Product Name should at least 3 to 150 characters long!!"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required!!")
    .isLength({ min: 5 })
    .withMessage("Description should at least 5 characters long!!"),
  body("price")
    .trim()
    .notEmpty()
    .withMessage("Price is required!!")
    .isLength({ min: 0 })
    .withMessage("Price must be positive number!!"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("quantity")
    .trim()
    .notEmpty()
    .withMessage("Quantity is required!!")
    .isLength({ min: 1 })
    .withMessage("Quantity must be positive number!!"),
];

module.exports = {
  validateProduct,
};
