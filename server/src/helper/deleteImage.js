const fs = require("fs").promises;

const deleteImage = async (imagePath) => {
  try {
    await fs.access(imagePath);
    await fs.unlink(imagePath);
    console.log("User image deleted!!");
  } catch (error) {
    console.error("User image not found");
  }
};

module.exports = { deleteImage };
