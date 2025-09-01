const Banner = require("../Banner/Banner");
const asyncHandler = require("../../utils/asyncHandler");
const { ApiError } = require("../../errors/errorHandler");


const deleteFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(path.resolve(filePath));
  }
};

exports.createBanner = async (data, user) => {
    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") throw new ApiError("Only admins or super admins can create banners", 403);
    const banner = await Banner.create({
         ...data, 
         createdBy: user.id,
    });
    return banner;
};

exports.getAllBanners = async (query) => {
    const { limit = 10, page = 1 } = query;
    const skip = (page - 1) * limit;

    const [banners, total] = await Promise.all([
        Banner.find()
            .skip(skip)
            .limit(parseInt(limit))
            .lean(),
        Banner.countDocuments()
    ]);

    if(banners.length === 0) return { banners: [], pagination: { total: 0, page: parseInt(page), pages: 0 } };
    
    return {
        banners,
        pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
        },
    };
};

exports.getBannerById = async (id) => {
    const banner = await Banner.findById(id);
    if (!banner) throw new ApiError("Banner not found", 404);
    return banner;
};

exports.updateBanner = async (id, data, user) => {
    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") throw new ApiError("Only admins or super admins can update banners", 403);
    const banner = await Banner.findByIdAndUpdate(id, data, { new: true });
    if (!banner) throw new ApiError("Banner not found", 404);
    if (data.image && banner.image) deleteFile(banner.image);
    return banner;
};

exports.deleteBanner = async (id, user) => {
    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") throw new ApiError("Only admins or super admins can delete banners", 403);
    const banner = await Banner.findByIdAndDelete(id);
    if (!banner) throw new ApiError("Banner not found", 404);
    return banner;
};
