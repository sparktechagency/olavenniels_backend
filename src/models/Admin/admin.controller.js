const asyncHandler = require("../../utils/asyncHandler");
const adminService = require("./admin.service");

exports.getAdminProfile = asyncHandler(async (req, res) => {
  const admin = await adminService.getAdminById(req.admin._id || req.admin.id);
  res.json({ success: true, admin });
});

exports.updateAdminProfile = asyncHandler(async (req, res) => {
    const updatePayload = {
      name: req.body?.name,
      phone: req.body?.phone,
      profilePicture: req.file?.path,
    };
  
    const updatedAdmin = await adminService.updateAdminProfile(
      req.admin._id || req.admin.id,
      updatePayload
    );
  
    res.json({ success: true, message: "Profile updated successfully", data: updatedAdmin });
  });

exports.changeAdminPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  await adminService.changeAdminPassword(
    req.admin._id || req.admin.id,
    currentPassword,
    newPassword,
    confirmPassword
  );

  res.json({ success: true, message: "Password updated successfully" });
});
