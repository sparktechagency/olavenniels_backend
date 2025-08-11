const express = require("express");
const router = express.Router();
const bookCategoryController = require("./bookCategory.conroller");
const upload = require("../../utils/upload");
const { authAdmin } = require("../../middleware/authMiddleware");


router.post("/create", authAdmin, upload.single("image"), bookCategoryController.createBookCategory);
router.get("/get", bookCategoryController.getAllBookCategories);
router.get("/get/:id", bookCategoryController.getBookCategoryById);
router.put("/update/:id", authAdmin, upload.single("image"), bookCategoryController.updateBookCategory);
router.delete("/delete/:id", authAdmin, bookCategoryController.deleteBookCategory);

module.exports = router;
