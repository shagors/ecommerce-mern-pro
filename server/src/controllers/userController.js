const createError = require("http-errors");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { findWithId } = require("../services/findItem");
const { deleteImage } = require("../helper/deleteImage");
const { createJSONWebToken } = require("../helper/jasonwebtoken");
const {
  jwtActivationKey,
  clientUrl,
  jwtPasswordResetKey,
} = require("../secret");
const emailWithNodeMailer = require("../helper/email");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
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

    const image = req.file;
    if (!image) {
      throw createError(400, "Image file is required");
    }

    if (image.size > 2 * 1024 * 1024) {
      throw new Error("Image size is too large. Please select below 2 MB");
    }

    const imageBufferString = image.buffer.toString("base64");

    const userExists = await User.exists({ email: email });
    if (userExists) {
      // 409 error means for check same email exists or not
      throw createError(409, "This email is already registered. Please Login");
    }

    // jwt call for new user
    const token = createJSONWebToken(
      { name, email, password, phone, address, image: imageBufferString },
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
      await emailWithNodeMailer(emailData);
    } catch (emailError) {
      next(createError(500, "Failed to send verification email!!"));
      return;
    }

    // when get user then send success token send to browser for check valid user or not
    return successResponse(res, {
      statusCode: 200,
      message: `Please go to your ${email} for completing the registration process.`,
      payload: { token, imageBufferString },
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

// delete single user by id
const updateUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const options = { password: 0 };
    await findWithId(User, userId, options);
    const updateOptions = { new: true, runValidators: true, context: "query" };
    let updates = {};

    for (let key in req.body) {
      if (["name", "password", "phone", "address"].includes(key)) {
        updates[key] = req.body[key];
      } else if (["email"].includes(key)) {
        throw new Error("Email can't be updated!");
      }
    }

    const image = req.file;
    if (image) {
      if (image.size > 2 * 1024 * 1024) {
        throw new Error("Image size is too large. Please select below 2 MB");
      }
      updates.image = image.buffer.toString("base64");
    }

    // delete updates.email;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    ).select("-password");

    if (!updatedUser) {
      throw createError(404, "User ID doesn't exist!");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "User Updated successfully",
      payload: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// Banned user by id
const handleBanUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await findWithId(User, userId);
    const updates = { isBanned: true };
    const updateOptions = { new: true, runValidators: true, context: "query" };

    // User Ban by ID
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    ).select("-password");

    if (!updatedUser) {
      throw createError(400, "User wasn't banned successfully!");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "User Banned successfully",
    });
  } catch (error) {
    next(error);
  }
};

// UnBanned user by id
const handleUnBanUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await findWithId(User, userId);
    const updates = { isBanned: false };
    const updateOptions = { new: true, runValidators: true, context: "query" };

    // User Ban by ID
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    ).select("-password");

    if (!updatedUser) {
      throw createError(400, "User wasn't unbanned successfully!");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "User UnBanned successfully",
    });
  } catch (error) {
    next(error);
  }
};

// password update by user
const handleUpdatePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.params.id;
    const user = await findWithId(User, userId);

    //  compare the password
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      throw createError(401, "Old Password didn't match!!");
    }

    const filter = { userId };
    const updates = { $set: { password: newPassword } };
    const updateOptions = { new: true };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    ).select("-password");

    if (!updatedUser) {
      throw createError(400, "Password can't updated!");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Your Password updated successfully!",
      payload: { updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

// forget password
const handleForgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const userData = await User.findOne({ email: email });
    if (!userData) {
      throw createError(
        404,
        "Email is incorrect Or You don't registred our server!"
      );
    }

    // jwt call for new user
    const token = createJSONWebToken({ email }, jwtPasswordResetKey, "10m");

    // prepare email with nodemailer
    const emailData = {
      email,
      subject: "Reset Password Email",
      html: `
        <h2> Hi, ${userData.name}</h2>
        <p>Please click here to this link for <a href="${clientUrl}/api/users/reset-password/${token}" target="_blank">Reset your Password</a></p>
      `,
    };

    // send email with nodemailer
    try {
      await emailWithNodeMailer(emailData);
    } catch (emailError) {
      next(createError(500, "Failed to send Reset Password email!!"));
      return;
    }

    return successResponse(res, {
      statusCode: 200,
      message: `Please go to your ${email} for Reset Your Password.`,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

// Reset password
const handleResetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const decoded = jwt.verify(token, jwtPasswordResetKey);
    if (!decoded) {
      throw createError(400, "Invalid or expired token!!");
    }

    const filter = { email: decoded.email };
    const updates = { password: password };
    const options = { new: true };

    const updatedUser = await User.findOneAndUpdate(
      filter,
      updates,
      options
    ).select("-password");

    if (!updatedUser) {
      throw createError(400, "Password Reset Failed!");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Password Reset successfully!",
    });
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
  updateUserById,
  handleBanUserById,
  handleUnBanUserById,
  handleUpdatePassword,
  handleForgetPassword,
  handleResetPassword,
};
