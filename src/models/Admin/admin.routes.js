const express = require("express");
const router = express.Router();
const authController = require("../Auth/auth.controller");
const { authAdmin, authSuperAdmin, authAdminOrSuperAdmin } = require("../../middleware/authMiddleware");
const adminController = require("./admin.controller");
const upload = require("../../utils/upload");

router.post(
  "/register-admin",
  authSuperAdmin,
  authController.registerAdmin
);

router.post(
  "/login-admin",
  authController.loginAdmin
);


router.post(
  "/logout",
  authAdminOrSuperAdmin,
  authController.logout
);


router.get("/profile/get", authAdminOrSuperAdmin, adminController.getAdminProfile);
router.put("/profile/update", authAdminOrSuperAdmin, upload.single("profilePicture"), adminController.updateAdminProfile);
router.put("/profile/change-password", authAdminOrSuperAdmin, adminController.changeAdminPassword)
router.get("/get-all-admins", authSuperAdmin, adminController.getAllAdmins)
router.delete("/delete-admin/:id", authSuperAdmin, adminController.deleteAdmin)
 

module.exports = router;

