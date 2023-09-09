const express = require("express");
const {
  handleBanUserById,
  handleUnBanUserById,
  handleUpdatePassword,
  handleForgetPassword,
  handleResetPassword,
  handleProcessRegister,
  handleActivateUserAccount,
  handleGetUsers,
  handleGetUserById,
  handleDeleteUserById,
  handleUpdateUserById,
} = require("../controllers/userController");
const upload = require("../middlewares/uploadFile");
const {
  validateUserRegistration,
  validateUserPasswordUpdate,
  validateUserForgetPassword,
  validateUserResetPassword,
} = require("../validators/auth");
const runValidation = require("../validators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth");
const userRouter = express.Router();

userRouter.post(
  "/process-register",
  upload.single("image"),
  isLoggedOut,
  validateUserRegistration,
  runValidation,
  handleProcessRegister
);
userRouter.post("/activate", isLoggedOut, handleActivateUserAccount);
userRouter.get("/", isLoggedIn, isAdmin, handleGetUsers);
// normal way get user id
userRouter.get("/:id", isLoggedIn, handleGetUserById);
// moongoose id validate with this REGEX and this way get valid ID
// userRouter.get("/:id([0-9a-fA-F]{24})", isLoggedIn, getUserById);
userRouter.delete("/:id", isLoggedIn, handleDeleteUserById);
userRouter.put(
  "/reset-password",
  validateUserResetPassword,
  runValidation,
  handleResetPassword
);
userRouter.put(
  "/:id",
  upload.single("image"),
  isLoggedIn,
  handleUpdateUserById
);
userRouter.put("/ban-user/:id", isLoggedIn, isAdmin, handleBanUserById);
userRouter.put("/unban-user/:id", isLoggedIn, isAdmin, handleUnBanUserById);
userRouter.put(
  "/update-password/:id",
  validateUserPasswordUpdate,
  runValidation,
  isLoggedIn,
  handleUpdatePassword
);
userRouter.post(
  "/forget-password",
  validateUserForgetPassword,
  runValidation,
  handleForgetPassword
);

module.exports = userRouter;
