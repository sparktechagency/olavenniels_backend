const express = require("express");
const router = express.Router();
const privacyController = require("./privacy.controller");
const { authAdmin } = require("../../middleware/authMiddleware");

router.post("/create", authAdmin, privacyController.createPrivacy);
router.get("/get", privacyController.getAllPrivacies);
// router.get("/get/:id", privacyController.getPrivacyById);
router.put("/update", authAdmin, privacyController.updatePrivacy);
router.delete("/delete/:id", authAdmin, privacyController.deletePrivacy);

module.exports = router;