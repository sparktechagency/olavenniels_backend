const express = require("express");
const router = express.Router();
const ebookController = require("./ebook.controller");
const {auth} = require("../../middleware/authMiddleware");
const upload = require("../../utils/upload");

// Admin-only routes
router.post(
  "/",
  auth(["ADMIN"]),
  upload.fields([{ name: "bookCover", maxCount: 1 }, { name: "pdfFile", maxCount: 1 }]),
  ebookController.createEbook
);

router.put(
  "/:id",
  auth(["ADMIN"]),
  upload.fields([{ name: "bookCover", maxCount: 1 }, { name: "pdfFile", maxCount: 1 }]),
  ebookController.updateEbook
);

router.delete("/:id", auth(["ADMIN"]), ebookController.deleteEbook);

// Public routes
router.get("/", ebookController.getAllEbooks);
router.get("/:id", ebookController.getEbookById);

module.exports = router;
