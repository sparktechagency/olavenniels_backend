const BookCategory = require("../BookCategory/BookCategory");
const { ApiError } = require("../../errors/errorHandler");

const fs = require("fs");
const path = require("path");



const deleteFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(path.resolve(filePath));
  }
};




exports.createBookCategory = async (data, user) => {
    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") throw new ApiError("Only admins or super admins can create book categories", 403);
    const bookCategory = await BookCategory.create({
         ...data, 
         createdBy: user.id,
    });
    return bookCategory;
};

exports.getAllBookCategories = async (query) => {
    const { limit = 10, page = 1 } = query;
    const skip = (page - 1) * limit;

    const bookCategories = await BookCategory.find()
        .skip(skip)
        .limit(parseInt(limit));

    if(bookCategories.length === 0) return { bookCategories: [], pagination: { total: 0, page: parseInt(page), pages: 0 } };
    const total = await BookCategory.countDocuments();

    return {
        bookCategories,
        pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
        },
    };
};

exports.getBookCategoryById = async (id) => {
    const bookCategory = await BookCategory.findById(id);
    if (!bookCategory) throw new ApiError("Book category not found", 404);
    return bookCategory;
};

exports.updateBookCategory = async (id, data, user) => {
    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") throw new ApiError("Only admins or super admins can update book categories", 403);
    
    const bookCategory = await BookCategory.findById(id);
    if (!bookCategory) throw new ApiError("Book category not found", 404);

    if (data?.image) {
        deleteFile(bookCategory.image);
    }
    
    const updated = await BookCategory.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: false } // disable required validation for partial update
      );
      return updated;
};

exports.deleteBookCategory = async (id  , user) => {
    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") throw new ApiError("Only admins or super admins can delete book categories", 403);
    const bookCategory = await BookCategory.findByIdAndDelete(id);
    if (!bookCategory) throw new ApiError("Book category not found", 404);
    deleteFile(bookCategory.image);
    return bookCategory;
};