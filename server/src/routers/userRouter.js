const express = require("express");
const { getUsers, getUser } = require("../controllers/userController");
const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.get("/:id", getUser);

module.exports = userRouter;
