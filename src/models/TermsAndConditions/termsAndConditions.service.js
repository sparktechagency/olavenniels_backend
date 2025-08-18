const TermsAndConditions = require("./TermsAndConditions");
const { ApiError } = require("../../errors/errorHandler");


exports.createTermsAndConditions = async (data, admin) => {
    const termsAndConditions = await TermsAndConditions.create({ ...data, createdBy: admin.id });
    if (!termsAndConditions) throw new ApiError("Terms and conditions not created", 400);
    return termsAndConditions;
};

exports.getTermsAndConditions = async () => {
    const termsAndConditions = await TermsAndConditions.findOne();
    if (!termsAndConditions) return null;
    return termsAndConditions;
};

// exports.getPrivacyById = asyncHandler(async (id) => {
//     const privacy = await Privacy.findById(id);
//     if (!privacy) throw new ApiError("Privacy not found", 404);
//     return privacy;
// });

exports.updateTermsAndConditions = async (id, data, admin) => {
    const termsAndConditions = await TermsAndConditions.findByIdAndUpdate(id, { ...data, updatedBy: admin.id }, { new: true });
    if (!termsAndConditions) throw new ApiError("Terms and conditions not found", 404);
    return termsAndConditions;
};

exports.deleteTermsAndConditions = async (id) => {
    const termsAndConditions = await TermsAndConditions.findByIdAndDelete(id);
    if (!termsAndConditions) throw new ApiError("Terms and conditions not found", 404);
    return termsAndConditions;
};