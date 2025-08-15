const express = require("express");
const router = express.Router();
const faqController = require("./faq.controller");
const { authAdmin } = require("../../middleware/authMiddleware");

router.post("/create", authAdmin, faqController.createFaq);
router.get("/get", faqController.getAllFaqs);
router.get("/get/:id", faqController.getFaqById);
router.put("/update/:id", authAdmin, faqController.updateFaq);
router.delete("/delete/:id", authAdmin, faqController.deleteFaq);

module.exports = router;