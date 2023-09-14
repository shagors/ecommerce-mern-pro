const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [3, "Product name minimum length 3 characters"],
      maxlength: [150, "Product name maximum length 150 characters"],
    },
    slug: {
      type: String,
      required: [true, "Product slug is required"],
      lowercase: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      lowercase: true,
      minlength: [5, "Product description minimum length 5 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      trim: true,
      validate: {
        validator: (v) => v > 0, // price check is negative or positive
        message: (props) =>
          `${props.value} is not a valid price! Price must positive number`,
      },
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
      trim: true,
      validate: {
        validator: (v) => v > 0, // quantity check is negative or positive
        message: (props) =>
          `${props.value} is not a valid quantity! quantity must positive number`,
      },
    },
    sold: {
      type: Number,
      required: [true, "Product sold is required"],
      trim: true,
      default: 0,
      //   validate: {
      //     validator: (v) => v > 0,
      //     message: (props) =>
      //       `${props.value} is not a valid sold quantity! sold quantity must positive number`,
      //   },
    },
    shipping: {
      type: Number,
      default: 0, // shipping fee 0 when shipment cost is free
    },
    image: {
      type: Buffer,
      contentType: String,
      required: [true, "Product image is required"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

const Product = model("Product", productSchema);

module.exports = Product;
