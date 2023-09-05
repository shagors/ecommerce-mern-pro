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
  body("image")
    .custom((value, { req }) => {
      if (!req.file || !req.file.buffer) {
        throw new Error("User image is required");
      }
      return true;
    })
    .withMessage("User image is required"),
];

// login validation
const validateUserLogin = [
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
];

// password Validation
const validateUserPasswordUpdate = [
  body("oldPassword")
    .trim()
    .notEmpty()
    .withMessage("Old Password is required!!")
    .isLength({ min: 6 })
    .withMessage(
      "Password should be at least ? characters long it's you know!!"
    )
    .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
    .withMessage(
      "Password should contain at least one uppercase letter, one lowercase letter, one number and special character"
    ),
  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New Password is required!!")
    .isLength({ min: 6 })
    .withMessage("New Password should be at least 6 characters long!!")
    .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
    .withMessage(
      "Password should contain at least one uppercase letter, one lowercase letter, one number and special character"
    ),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Password didn't match!!");
    }
    return true;
  }),
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateUserPasswordUpdate,
};
