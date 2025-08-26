const express = require("express");
const router = express.Router();
const { authAdminOrSuperAdmin } = require("../../middleware/authMiddleware");
const userManagementController = require("./userManagement.controller");


router.get("/get-all-users", authAdminOrSuperAdmin, userManagementController.getAllUsers);
router.get("/get-user-by-id", authAdminOrSuperAdmin, userManagementController.getUserById);
router.put("/block-user", authAdminOrSuperAdmin, userManagementController.blockUser);
router.put("/unblock-user", authAdminOrSuperAdmin, userManagementController.unblockUser);
router.get("/get-user-growth", authAdminOrSuperAdmin, userManagementController.getUserGrowth);

module.exports = router;
