const asyncHandler = require("../../utils/asyncHandler");
const userService = require("./user.service");
const Book = require("../Book/Book");
const Ebook = require("../Ebook/Ebook");
const AudioBook = require("../AudioBook/AudioBook");
const {ApiError} = require("../../errors/errorHandler");

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


exports.toggleSaveBook = asyncHandler(async (req, res) => {
  const { id } = req.query;

  const contentType = await Book.findById(id) || await Ebook.findById(id) || await AudioBook.findById(id);
  console.log(contentType);
  if (!contentType) throw new ApiError("Content not found", 404);

  const book = await userService.toggleSaveBook(req.user._id || req.user.id, id, contentType);

  res.json({ success: true, message: "Book saved successfully", data: book });
});

exports.allSavedItems = asyncHandler(async (req, res) => {
  const books = await userService.allSavedItems(req.user._id || req.user.id);
  res.json({ success: true, books });
});

