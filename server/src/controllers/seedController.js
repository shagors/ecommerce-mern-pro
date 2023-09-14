const data = require("../data");
const Product = require("../models/productModel");
const User = require("../models/userModel");

const seedUser = async (req, res, next) => {
  try {
    //   delete all existing users
    await User.deleteMany({});

    //   insert new users
    const users = await User.insertMany(data.users);

    //   server response
    return res.status(201).json(users);
  } catch (error) {
    next(error);
  }
};
const seedProducts = async (req, res, next) => {
  try {
    //   delete all existing users
    await Product.deleteMany({});

    //   insert new users
    const products = await Product.insertMany(data.products);

    //   server response
    return res.status(201).json(products);
  } catch (error) {
    next(error);
  }
};

module.exports = { seedUser, seedProducts };
