const User = require("../User/User");
const bcrypt = require("bcryptjs");
const { ApiError } = require("../../errors/errorHandler");
const Book = require("../Book/Book");
const Ebook = require("../Ebook/Ebook");
const AudioBook = require("../AudioBook/AudioBook");

exports.getUserById = async (userId) => {
  const user = await User.findById(userId).select("-password").select("-verificationCode").select("-isVerified").select("-passwordResetCode");
  if (!user) throw new ApiError("User not found", 404);
  return user;
};

exports.updateUserProfile = async (userId, updateData) => {
  const user = await User.findById(userId).select("-password").select("-verificationCode").select("-isVerified").select("-passwordResetCode");
  if (!user) throw new ApiError("User not found", 404);

  if (typeof updateData.firstName !== "undefined") user.firstName = updateData.firstName;
  if (typeof updateData.lastName !== "undefined") user.lastName = updateData.lastName;
  if (typeof updateData.phone !== "undefined") user.phone = updateData.phone;
  if (typeof updateData.profilePicture !== "undefined") user.profilePicture = updateData.profilePicture;
   
  await user.save();
  return user;
};

exports.changeUserPassword = async (userId, currentPassword, newPassword, confirmPassword) => {
  const user = await User.findById(userId).select("+password");
//   console.log(user);
 
  if (!user) throw new ApiError("User not found", 404);

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new ApiError("Current password is incorrect", 400);

  if (newPassword !== confirmPassword)
    throw new ApiError("New password and confirm password do not match", 400);

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return true;
};


exports.toggleSaveBook = async (userId, bookId) => {
  const user = await User.findById(userId).select("-password").select("-verificationCode").select("-isVerified").select("-passwordResetCode");
  if (!user) throw new ApiError("User not found", 404);

  const book = await Book.findById(bookId);
  const ebook = await Ebook.findById(bookId);
  const audiobook = await AudioBook.findById(bookId);

  if (book && user.savedBooks.includes(bookId)) {
    user.savedBooks = user.savedBooks.filter(id => id !== bookId);
  } else if (ebook && user.savedEbooks.includes(bookId)) {
    user.savedEbooks = user.savedEbooks.filter(id => id !== bookId);
  } else if (audiobook && user.savedAudioBooks.includes(bookId)) {
    user.savedAudioBooks = user.savedAudioBooks.filter(id => id !== bookId);
  } else {
    if (book) user.savedBooks.push(bookId);
    if (ebook) user.savedEbooks.push(bookId);
    if (audiobook) user.savedAudioBooks.push(bookId);
  }

  await user.save();
  return user;
};

exports.allSavedBooks = async (userId) => {
  const user = await User.findById(userId).select("-password").select("-verificationCode").select("-isVerified").select("-passwordResetCode");
  if (!user) throw new ApiError("User not found", 404);
  return user.savedBooks;
};
