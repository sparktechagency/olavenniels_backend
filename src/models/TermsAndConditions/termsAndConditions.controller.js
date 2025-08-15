const termsAndConditionsService = require("./termsAndConditions.service");
const asyncHandler = require("../../utils/asyncHandler");


exports.createTermsAndConditions = asyncHandler(async (req, res) => {
    const { description } = req.body;
    const termsAndConditions = await termsAndConditionsService.createTermsAndConditions({ description }, req.admin);
    res.status(201).json({ success: true, message: "Terms and conditions created successfully", data: termsAndConditions });
});

exports.getAllTermsAndConditions = asyncHandler(async (req, res) => {
    const termsAndConditions = await termsAndConditionsService.getTermsAndConditions();
    // console.log(privacies)
    res.json({ success: true, message: "Terms and conditions fetched successfully", termsAndConditions });
});

// exports.getPrivacyById = asyncHandler(async (req, res) => {
//     const privacy = await privacyService.getPrivacyById(req.params.id);
//     res.json({ success: true, message: "Privacy fetched successfully", privacy });
// });

exports.updateTermsAndConditions = asyncHandler(async (req, res) => {
    const { description } = req.body;
    const termsAndConditions = await termsAndConditionsService.updateTermsAndConditions(req.params.id, { description }, req.admin);
    res.json({ success: true, message: "Terms and conditions updated successfully", data: termsAndConditions });
});

exports.deleteTermsAndConditions = asyncHandler(async (req, res) => {
    const termsAndConditions = await termsAndConditionsService.deleteTermsAndConditions(req.params.id);
    res.json({ success: true, message: "Terms and conditions deleted successfully", data: termsAndConditions });
});
