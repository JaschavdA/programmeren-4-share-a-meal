const express = require("express");
const router = express.Router();
const controller = require("../controllers/user-controllers");

router.post(
  "/api/user",
  controller.validateUser,
  controller.validateEmailCreateUser,
  controller.addUser
);

router.get("/api/user", controller.getAllUsers);

router.get("/api/user/profile", controller.getUserProfile);

router.get("/api/user/:userID", controller.getUserById);

router.put("/api/user/:userID", controller.updateUser);

router.delete("/api/user/:userID", controller.deleteUserById);
module.exports = router;
