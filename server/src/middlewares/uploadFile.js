const multer = require("multer");
const { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } = require("../config");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, UPLOAD_USER_IMG_DIRECTORY);
//   },
//   filename: function (req, file, cb) {
//     const extname = path.extname(file.originalname);
//     cb(
//       null,
//       Date.now() + "_" + file.originalname.replace(extname, "") + extname
//     );
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const extname = path.extname(file.originalname);
//   if (!ALLOWED_FILE_TYPES.includes(extname.substring(1))) {
//     return cb(new Error("File type is not valid"), false);
//   }
//   cb(null, true);
// };
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image file allowed"), false);
  }
  if (file.size > MAX_FILE_SIZE) {
    return cb(new Error("Image file must be less then 2MB"), false);
  }
  if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    return cb(new Error("Image file type not valid"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter,
});

module.exports = upload;
