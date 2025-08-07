const express = require("express");
const router = express.Router();
const ebookController = require("./ebook.controller");
const {authAdmin} = require("../../middleware/authMiddleware");
const upload = require("../../utils/upload");

// Admin-only routes
router.post(
  "/",
  authAdmin,
  upload.fields([{ name: "bookCover", maxCount: 1 }, { name: "pdfFile", maxCount: 1 }]),
  ebookController.createEbook
);

router.put(
  "/:id",
  authAdmin,
  upload.fields([{ name: "bookCover", maxCount: 1 }, { name: "pdfFile", maxCount: 1 }]),
  ebookController.updateEbook
);

router.delete("/:id", authAdmin, ebookController.deleteEbook);

// Public routes
router.get("/", ebookController.getAllEbooks);
router.get("/:id", ebookController.getEbookById);

module.exports = router;
