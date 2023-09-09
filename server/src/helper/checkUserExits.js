const User = require("../models/userModel");

const checkUserExits = async (email) => {
  return await User.exists({ email: email });
};

module.exports = checkUserExits;
