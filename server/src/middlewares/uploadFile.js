const multer = require("multer");
const path = require("path");

const UPLOAD_DIR = process.env.UPLOAD_FILE || "public/images/users";
const MAX_FILE_SIZE = process.env.MAX_FILE_SIZE || 2097152;
const ALLOWED_FILE_TYPES = process.env.ALLOWED_FILE_TYPES || [];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const extname = path.extname(file.originalname);
    cb(
      null,
      Date.now() + "_" + file.originalname.replace(extname, "") + extname
    );
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
