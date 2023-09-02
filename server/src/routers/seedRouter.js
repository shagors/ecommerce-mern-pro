const express = require("express");
const { seedUser } = require("../controllers/seedController");
const upload = require("../middlewares/uploadFile");
const seedRouter = express.Router();

seedRouter.get("/users", upload.single("image"), seedUser);

module.exports = seedRouter;
