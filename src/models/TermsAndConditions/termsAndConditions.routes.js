const express = require("express");
const router = express.Router();
const termsAndConditionsController = require("./termsAndConditions.controller");
const { authAdmin } = require("../../middleware/authMiddleware");

router.post("/create", authAdmin, termsAndConditionsController.createTermsAndConditions);
router.get("/get", termsAndConditionsController.getAllTermsAndConditions);
router.put("/update", authAdmin, termsAndConditionsController.updateTermsAndConditions);
router.delete("/delete/:id", authAdmin, termsAndConditionsController.deleteTermsAndConditions);

module.exports = router;