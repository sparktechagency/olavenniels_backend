const asyncHandler = require("../../utils/asyncHandler");
const userService = require("./user.service");

exports.getUserProfile = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.user._id || req.user.id);
  res.json({ success: true, user });
});

exports.updateUserProfile = asyncHandler(async (req, res) => {
  const updatePayload = {
    firstName: req.body?.firstName,
    lastName: req.body?.lastName,
    phone: req.body?.phone,
    profilePicture: req.file?.path, // will store file path if uploaded
  };

  console.log(updatePayload);
  const updatedUser = await userService.updateUserProfile(
    req.user._id || req.user.id,
    updatePayload
  );

  res.json({ success: true, message: "Profile updated successfully", data: updatedUser });
});

exports.changeUserPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  await userService.changeUserPassword(
    req.user._id || req.user.id,
    currentPassword,
    newPassword,
    confirmPassword
  );

  res.json({ success: true, message: "Password updated successfully" });
});
