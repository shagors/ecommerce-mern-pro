const { body } = require("express-validator");

// registration validation
const validateUserRegistration = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required!!")
    .isLength({ min: 3, max: 31 })
    .withMessage("Name should at least 3-31 characters long!!"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required!!")
    .isEmail()
    .withMessage("Invalid Email Address!!"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required!!")
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 characters long!!")
    .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
    .withMessage(
      "Password should contain at least one uppercase letter, one lowercase letter, one number and special character"
    ),
  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required!!")
    .isLength({ min: 3 })
    .withMessage("Password should be at least 6 characters long!!"),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone Number is required!!")
    .isLength({ min: 11 })
    .withMessage("Phone should be 11 characters long!!"),
  body("image").optional().isString().withMessage("Address is required!!"),
];

module.exports = { validateUserRegistration };
