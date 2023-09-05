const express = require("express");
const {
  getUsers,
  getUserById,
  deleteUserById,
  processRegister,
  activateUserAccount,
  updateUserById,
  handleBanUserById,
  handleUnBanUserById,
  handleUpdatePassword,
} = require("../controllers/userController");
const upload = require("../middlewares/uploadFile");
const {
  validateUserRegistration,
  validateUserPasswordUpdate,
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
  processRegister
);
userRouter.post("/activate", isLoggedOut, activateUserAccount);
userRouter.get("/", isLoggedIn, isAdmin, getUsers);
userRouter.get("/:id", isLoggedIn, getUserById);
userRouter.delete("/:id", isLoggedIn, deleteUserById);
userRouter.put("/:id", upload.single("image"), isLoggedIn, updateUserById);
userRouter.put("/ban-user/:id", isLoggedIn, isAdmin, handleBanUserById);
userRouter.put("/unban-user/:id", isLoggedIn, isAdmin, handleUnBanUserById);
userRouter.put(
  "/update-password/:id",
  validateUserPasswordUpdate,
  runValidation,
  isLoggedIn,
  handleUpdatePassword
);

module.exports = userRouter;
