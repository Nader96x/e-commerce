const express = require("express");
const usersController = require("./UsersController");
const upload = require("../../helpers/upload.helper");

const router = express.Router();

const assignImage = (req, res, next) => {
  req.body.image = req.file.location;
  next();
};

router
  .route("/")
  .get(usersController.getAllUsers)
  .post(upload.single("image"), assignImage, usersController.createUser);
router
  .route("/:id")
  .get(usersController.getUser)
  .delete(usersController.deleteUser);

module.exports = router;
