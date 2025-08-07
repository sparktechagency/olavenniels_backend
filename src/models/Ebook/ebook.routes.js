const express = require("express");
const router = express.Router();
const ebookController = require("./ebook.controller");
const {authAdmin} = require("../../middleware/authMiddleware");
const upload = require("../../utils/upload");

// Admin-only routes
router.post(
  "/create",
  authAdmin,
  upload.fields([{ name: "bookCover", maxCount: 1 }, { name: "pdfFile", maxCount: 1 }]),
  ebookController.createEbook
);

router.put(
  "/update/:id",
  authAdmin,
  upload.fields([{ name: "bookCover", maxCount: 1 }, { name: "pdfFile", maxCount: 1 }]),
  ebookController.updateEbook
);

router.delete("/delete/:id", authAdmin, ebookController.deleteEbook);

// Public routes
router.get("/get", ebookController.getAllEbooks);
router.get("/get/:id", ebookController.getEbookById);

module.exports = router;
