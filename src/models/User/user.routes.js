const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const { authUser } = require(".././../middleware/authMiddleware");
const upload = require("../../utils/upload"); // Multer setup=

router.get("/profile/get", authUser, userController.getUserProfile);
router.put("/profile/update", authUser, upload.single("profilePicture"), userController.updateUserProfile);
router.put("/profile/change-password", authUser, userController.changeUserPassword);

module.exports = router;
