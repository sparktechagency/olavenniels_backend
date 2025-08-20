const express = require("express");
const router = express.Router();
const { createBanner, getAllBanners, getBannerById, updateBanner, deleteBanner } = require("./banner.controller");
const { authAdmin } = require("../../middleware/authMiddleware");
const upload = require("../../utils/upload");

router.post("/create", authAdmin, upload.single("image"), createBanner);
router.get("/get", getAllBanners);
router.get("/get/:id", getBannerById);
router.put("/update", authAdmin, upload.single("image"), updateBanner);
router.delete("/delete", authAdmin, deleteBanner);

module.exports = router;
