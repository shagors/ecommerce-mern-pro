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
const getAllProduct = async (page = 1, limit = 4) => {
  const products = await Product.find({})
    .populate("category")
    .skip((page - 1) * limit) // set pagination
    .limit(limit) // page limit make
    .sort({ createdAt: -1 }); // sort with when the product make

  if (!products) throw createError(404, "No products found!!");

  const count = await Product.find({}).countDocuments();

  return { products, count, totalPages: Math.ceil(count / limit) };
};

const getSingleProduct = async (slug) => {
  const product = await Product.findOne({ slug }).populate("category");

  if (!product) throw createError(404, "No products found!!");

  return product;
};

const deleteSingleProduct = async (slug) => {
  const product = await Product.findOneAndDelete({ slug });

  if (!product) throw createError(404, "No products found!!");

  return product;
};

const updateProductBySlug = async (slug, updates, image, updateOptions) => {
  if (updates.name) {
    updates.slug = slugify(updates.name);
  }

  if (image) {
    if (image.size > 2 * 1024 * 1024) {
      throw new Error("Image size is too large. Please select below 2 MB");
    }
    updates.image = image.buffer.toString("base64");
  }
  const updatedProduct = await Product.findOneAndUpdate(
    { slug },
    updates,
    updateOptions
  );

  if (!updatedProduct) {
    throw createError(404, "User ID doesn't exist!");
  }
  return updatedProduct;
};

module.exports = {
  createProduct,
  getAllProduct,
  getSingleProduct,
  deleteSingleProduct,
  updateProductBySlug,
};
