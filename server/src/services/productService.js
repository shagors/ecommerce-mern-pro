const slugify = require("slugify");
const Product = require("../models/productModel");
const createError = require("http-errors");

const createProduct = async (productData) => {
  const {
    name,
    description,
    price,
    quantity,
    shipping,
    category,
    imageBufferString,
  } = productData;
  const productExists = await Product.exists({ name: name });
  if (productExists) {
    throw createError(409, "Product name already exists!!");
  }

  // create new product
  const product = await Product.create({
    name: name,
    slug: slugify(name),
    description: description,
    price: price,
    quantity: quantity,
    shipping: shipping,
    image: imageBufferString,
    category: category,
  });
  return product;
};

module.exports = {
  createProduct,
};
