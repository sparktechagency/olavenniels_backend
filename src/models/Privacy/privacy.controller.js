const privacyService = require("./privacy.service");
const asyncHandler = require("../../utils/asyncHandler");


exports.createPrivacy = asyncHandler(async (req, res) => {
    const { description } = req.body;
    const privacy = await privacyService.createPrivacy({ description }, req.admin);
    res.status(201).json({ success: true, message: "Privacy created successfully", data: privacy });
});

exports.getAllPrivacies = asyncHandler(async (req, res) => {
    const privacies = await privacyService.getPrivacy();
    // console.log(privacies)
    res.json({ success: true, message: "Privacies fetched successfully", privacies });
});

// exports.getPrivacyById = asyncHandler(async (req, res) => {
//     const privacy = await privacyService.getPrivacyById(req.params.id);
//     res.json({ success: true, message: "Privacy fetched successfully", privacy });
// });

exports.updatePrivacy = asyncHandler(async (req, res) => {
    const { description } = req.body;
    const privacy = await privacyService.updatePrivacy(req.params.id, { description }, req.admin);
    res.json({ success: true, message: "Privacy updated successfully", data: privacy });
});

exports.deletePrivacy = asyncHandler(async (req, res) => {
    const privacy = await privacyService.deletePrivacy(req.params.id);
    res.json({ success: true, message: "Privacy deleted successfully", data: privacy });
});
