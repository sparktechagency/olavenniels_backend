const express = require("express");
const router = express.Router();
const authController = require("../Auth/auth.controller");
const { authAdmin } = require("../../middleware/authMiddleware");


router.post(
    "/register-admin",
    authAdmin,
    authController.registerAdmin
  );

router.post(
    "/login-admin",
    authController.loginAdmin
  );


  router.post(
    "/logout",
    authAdmin,
    authController.logout
  );

module.exports = router;

