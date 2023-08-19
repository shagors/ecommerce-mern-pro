const createError = require("http-errors");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { findWithId } = require("../services/findItem");
const { deleteImage } = require("../helper/deleteImage");
const { createJSONWebToken } = require("../helper/jasonwebtoken");
const { jwtActivationKey, clientUrl } = require("../secret");
const emailWithNodeMailer = require("../helper/email");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises;

// get all users
const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const searchRegExp = new RegExp(".*" + search + ".*", "i");
    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
      ],
    };
    const options = { password: 0 };

    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await User.find(filter).countDocuments();

    if (!users) throw createError(404, "No users found");

    return successResponse(res, {
      statusCode: 200,
      message: "User is available in Server",
      payload: {
        users,
        pagination: {
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// get single user by id
const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(User, id, options);

    return successResponse(res, {
      statusCode: 200,
      message: "User were return successfully",
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};

// delete single user by id
const deleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(User, id, options);

    const userImagePath = user.image;

    deleteImage(userImagePath);

    await User.findByIdAndDelete({
      _id: id,
      isAdmin: false,
    });

    return successResponse(res, {
      statusCode: 200,
      message: "User Deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// user registration API make
const processRegister = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const userExists = await User.exists({ email: email });
    if (userExists) {
      // 409 error means for check same email exists or not
      throw createError(409, "This email is already registered. Please Login");
    }

    // jwt call for new user
    const token = createJSONWebToken(
      { name, email, password, phone, address },
      jwtActivationKey,
      "10m"
    );

    // prepare email with nodemailer
    const emailData = {
      email,
      subject: "Account activation mail",
      html: `
        <h2> Hi, ${name}</h2>
        <p>Please click here to this link for <a href="${clientUrl}/api/users/activate/${token}" target="_blank">activate your account</a></p>
      `,
    };

    // send email with nodemailer
    try {
      // await emailWithNodeMailer(emailData);
    } catch (emailError) {
      next(createError(500, "Failed to send verification email!!"));
      return;
    }

    // when get user then send success token send to browser for check valid user or not
    return successResponse(res, {
      statusCode: 200,
      message: `Please go to your ${email} for completing the registration process.`,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

//verify user with token is user valid or not or exists
const activateUserAccount = async (req, res, next) => {
  try {
    const token = req.body.token;
    if (!token) throw createError(404, "Token not found!!");

    try {
      const decoded = jwt.verify(token, jwtActivationKey);
      if (!decoded) throw createError(401, "Unable to verify user!!");

      const userExists = await User.exists({ email: decoded.email });
      if (userExists) {
        // 409 error means for check same email exists or not
        throw createError(
          409,
          "This email is already registered. Please Login"
        );
      }

      await User.create(decoded);

      return successResponse(res, {
        statusCode: 201,
        message: `User registered successfully`,
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw createError(401, "Token has Expired");
      } else if (error.name === "JsonWebTokenError") {
        throw createError(401, "Invalid Token");
      } else {
        throw error;
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  deleteUserById,
  processRegister,
  activateUserAccount,
};
