const Ebook = require("./Ebook");
const {ApiError} = require("../../errors/errorHandler");
const fs = require("fs");
const path = require("path");

/** Delete file helper */
const deleteFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(path.resolve(filePath));
  }
};

/**
 * Create ebook (Admin only)
 */
exports.createEbook = async (data, user) => {
  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") throw new ApiError("Only admins or super admins can create ebooks", 403);

  const ebook = await Ebook.create({
    ...data,
    createdBy: user.id,
  });
  return ebook;
};

/**
 * Get all ebooks with search & pagination
 */
exports.getAllEbooks = async (query) => {
  const { search, category, page = 1, limit = 10 } = query;
  const filter = {};

  if (search) filter.bookName = { $regex: search, $options: "i" };
  if (category) filter.category = category;

  const skip = (page - 1) * limit;

  const ebooks = await Ebook.find(filter)
    .populate("createdBy", "name email")
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Ebook.countDocuments(filter);

  return {
    ebooks,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get single ebook
 */
exports.getEbookById = async (id) => {
  const ebook = await Ebook.findById(id).populate("createdBy", "name email");
  if (!ebook) throw new ApiError("Ebook not found", 404);
  return ebook;
};

/**
 * Update ebook (Admin only)
 */
exports.updateEbook = async (id, data, user) => {
  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") throw new ApiError("Only admins or super admins can update ebooks", 403);

  const ebook = await Ebook.findById(id);
  if (!ebook) throw new ApiError("Ebook not found", 404);

  // Delete old files if new ones are uploaded
  if (data.bookCover && ebook.bookCover) deleteFile(ebook.bookCover);
  if (data.pdfFile && ebook.pdfFile) deleteFile(ebook.pdfFile);

  Object.assign(ebook, data);
  await ebook.save();
  return ebook;
};

/**
 * Delete ebook (Admin only)
 */
exports.deleteEbook = async (id, user) => {
  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") throw new ApiError("Only admins or super admins can delete ebooks", 403);

  const ebook = await Ebook.findById(id);
  if (!ebook) throw new ApiError("Ebook not found", 404);

  // Delete files
  deleteFile(ebook.bookCover);
  deleteFile(ebook.pdfFile);

  await ebook.deleteOne();
  return true;
};
