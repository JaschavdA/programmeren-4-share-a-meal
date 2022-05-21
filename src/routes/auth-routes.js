const express = require("express");
const router = express.Router();
const userController = require("../controllers/");

router.post(
    "/api/auth/login",
    userController.validateUser,
    userController.addUser
);
