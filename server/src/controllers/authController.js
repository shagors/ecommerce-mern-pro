const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { createJSONWebToken } = require("../helper/jasonwebtoken");
const bcrypt = require("bcryptjs");
const { jwtAccessKey } = require("../secret");

const handleLogin = async (req, res, next) => {
  try {
    //  email and password
    const { email, password } = req.body;
    //  isExists
    const user = await User.findOne({ email });
    if (!user) {
      throw createError(
        404,
        "User doesn't exists with this email.Please register first"
      );
    }
    //  compare the password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw createError(401, "Email/Password didn't match. Please try another");
    }
    //   isBanned
    if (user.isBanned) {
      throw createError(403, "You are Banned. Please contact our help center!");
    }

    //   token,cookies
    const accessToken = createJSONWebToken({ user }, jwtAccessKey, "15m");
    res.cookie("accessToken", accessToken, {
      maxAge: 15 * 60 * 1000, // 15 minutes validate token
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    // password removed from body
    const userWithoutPassword = await User.findOne({ email }).select(
      "-password"
    );

    //   success user found with email address
    return successResponse(res, {
      statusCode: 200,
      message: "User Login Successfully",
      payload: { userWithoutPassword },
    });
  } catch (error) {
    next(error);
  }
};

const handleLogout = async (req, res, next) => {
  try {
    res.clearCookie("accessToken");
    //   success user found with email address
    return successResponse(res, {
      statusCode: 200,
      message: "User Logout Successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { handleLogin, handleLogout };
