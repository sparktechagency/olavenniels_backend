const Privacy = require("./Privacy");
const { ApiError } = require("../../errors/errorHandler");
const asyncHandler = require("../../utils/asyncHandler");


exports.createPrivacy = asyncHandler(async (data, admin) => {
    const privacy = await Privacy.create({ ...data, createdBy: admin.id });

    return privacy;
});

exports.getAllPrivacies = asyncHandler(async () => {
    const privacies = await Privacy.findOne();
    if (!privacies) throw new ApiError("Privacies not found", 404);
    return privacies;
});

exports.getPrivacyById = asyncHandler(async (id) => {
    const privacy = await Privacy.findById(id);
    if (!privacy) throw new ApiError("Privacy not found", 404);
    return privacy;
});

exports.updatePrivacy = asyncHandler(async (id, data, admin) => {
    const privacy = await Privacy.findByIdAndUpdate(id, { ...data, updatedBy: admin.id }, { new: true });
    if (!privacy) throw new ApiError("Privacy not found", 404);
    return privacy;
});

exports.deletePrivacy = asyncHandler(async (id) => {
    const privacy = await Privacy.findByIdAndDelete(id);
    if (!privacy) throw new ApiError("Privacy not found", 404);
    return privacy;
});