const Privacy = require("./Privacy");
const { ApiError } = require("../../errors/errorHandler");
const asyncHandler = require("../../utils/asyncHandler");


exports.createPrivacy = async (data, admin) => {
    const privacy = await Privacy.create({ ...data, createdBy: admin.id });
    if (!privacy) throw new ApiError("Privacy not created", 400);
    return privacy;
};

exports.getPrivacy = async () => {
    const privacy = await Privacy.findOne();
    if (!privacy) return [];
    return privacy;
};

// exports.getPrivacyById = asyncHandler(async (id) => {
//     const privacy = await Privacy.findById(id);
//     if (!privacy) throw new ApiError("Privacy not found", 404);
//     return privacy;
// });

exports.updatePrivacy = async (id, data, admin) => {
    const privacy = await Privacy.findByIdAndUpdate(id, { ...data, updatedBy: admin.id }, { new: true, upsert: true });
    if (!privacy) throw new ApiError("Privacy not found", 404);
    return privacy;
};

exports.deletePrivacy = async (id) => {
    const privacy = await Privacy.findByIdAndDelete(id);
    if (!privacy) throw new ApiError("Privacy not found", 404);
    return privacy;
};