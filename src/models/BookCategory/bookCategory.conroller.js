const bookCategoryService = require("./bookCategory.service");
const asyncHandler = require("../../utils/asyncHandler");


exports.createBookCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const bookCategory = await bookCategoryService.createBookCategory(
        {
            name,
            image: req.file.path,
        },
        req.admin
    );
    res.json({ success: true, message: "Book category created successfully", data: bookCategory });
});

exports.getAllBookCategories = asyncHandler(async (req, res) => {
    const bookCategories = await bookCategoryService.getAllBookCategories(req.query);
    res.json({ success: true, message: "Book categories fetched successfully", data: bookCategories });
});

exports.getBookCategoryById = asyncHandler(async (req, res) => {
    const bookCategory = await bookCategoryService.getBookCategoryById(req.params.id);
    res.json({ success: true, message: "Book category fetched successfully", data: bookCategory });
});

exports.updateBookCategory = asyncHandler(async (req, res) => {
    const bookCategory = await bookCategoryService.updateBookCategory(
        req.params.id,
        {
            name: req.body.name,
            image: req.file.path,
        },
        req.admin
    );
    res.json({ success: true, message: "Book category updated successfully", data: bookCategory });
});

exports.deleteBookCategory = asyncHandler(async (req, res) => {
    const bookCategory = await bookCategoryService.deleteBookCategory(req.params.id, req.admin);
    res.json({ success: true, message: "Book category deleted successfully", data: bookCategory });
});
