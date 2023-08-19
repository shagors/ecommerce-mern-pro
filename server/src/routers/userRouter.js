const express = require("express");
const {
  getUsers,
  getUserById,
  deleteUserById,
  processRegister,
  activateUserAccount,
} = require("../controllers/userController");
const upload = require("../middlewares/uploadFile");
const userRouter = express.Router();

userRouter.post("/process-register", upload.single("image"), processRegister);
userRouter.post("/verify", activateUserAccount);
userRouter.get("/", getUsers);
userRouter.get("/:id", getUserById);
userRouter.delete("/:id", deleteUserById);

module.exports = userRouter;
