const express = require("express");
const router = express.Router();
const authController = require("../Auth/auth.controller");
const { authAdmin, authSuperAdmin } = require("../../middleware/authMiddleware");
const adminController = require("./admin.controller");
const upload = require("../../utils/upload");

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


router.get("/profile/get", authAdmin, adminController.getAdminProfile);
router.put("/profile/update", authAdmin, upload.single("profilePicture"), adminController.updateAdminProfile);
router.put("/profile/change-password", authAdmin, adminController.changeAdminPassword)
router.get("/get-all-admins", authSuperAdmin, adminController.getAllAdmins)

module.exports = router;

