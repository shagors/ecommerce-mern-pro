const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { createJSONWebToken } = require("../helper/jasonwebtoken");
const bcrypt = require("bcryptjs");
const { jwtAccessKey, jwtRefreshKey } = require("../secret");
const {
  setAccessTokenCookie,
  setRefreshTokenCookie,
} = require("../helper/cookie");

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
    const accessToken = createJSONWebToken({ user }, jwtAccessKey, "5m");
    // res.cookie("accessToken", accessToken, {
    //   maxAge: 5 * 60 * 1000,
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "none",
    // });
    setAccessTokenCookie(res, accessToken);

    //   refresh token
    const refreshToken = createJSONWebToken({ user }, jwtRefreshKey, "7d");
    // res.cookie("refreshToken", refreshToken, {
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "none",
    // });
    setRefreshTokenCookie(res, refreshToken);

    // password removed from body
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

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
    res.clearCookie("refreshToken");
    return successResponse(res, {
      statusCode: 200,
      message: "User Logout Successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

const handleRefreshToken = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    const decodedToken = jwt.verify(oldRefreshToken, jwtRefreshKey);

    if (!decodedToken) {
      throw createError(401, "Invalid refresh Token. Please login again");
    }

    //   token,cookies
    const accessToken = createJSONWebToken(
      decodedToken.user,
      jwtAccessKey,
      "5m"
    );
    setAccessTokenCookie(res, accessToken);
    // res.cookie("accessToken", accessToken, {
    //   maxAge: 5 * 60 * 1000,
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "none",
    // });

    return successResponse(res, {
      statusCode: 200,
      message: "New access token generated Successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};
const handleProtectedRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    const decodedToken = jwt.verify(accessToken, jwtAccessKey);

    if (!decodedToken) {
      throw createError(401, "Invalid access Token. Please login again");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Protected route access success!!",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleLogin,
  handleLogout,
  handleRefreshToken,
  handleProtectedRoute,
};
