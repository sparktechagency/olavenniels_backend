const User = require("../User/User");
const asyncHandler = require("../../utils/asyncHandler");
const userService = require("../User/user.service");

exports.getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password");
    res.json({ success: true, users });
});

exports.getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) throw new ApiError("User not found", 404);
    res.json({ success: true, user });
});


exports.getBlockedUsersTotal = asyncHandler(async (req, res) => {
    const total = await userService.getBlockedUsersTotal();
    res.json({ success: true, total });
});
