const Faq = require("../Faq/Faq");
const { ApiError } = require("../../errors/errorHandler");
const { deleteFile } = require("../../utils/unLinkFiles");
const asyncHandler = require("../../utils/asyncHandler");


exports.createFaq = asyncHandler(async (data, admin) => {
    const faq = await Faq.create({ ...data, createdBy: admin.id });
    return faq;
});

exports.getAllFaqs = asyncHandler(async (query) => {
    const faqs = await Faq.find(query);
    return faqs;
});

exports.getFaqById = asyncHandler(async (id) => {
    const faq = await Faq.findById(id);
    return faq;
});

exports.updateFaq = asyncHandler(async (id, data, admin) => {
    const faq = await Faq.findByIdAndUpdate(id, { ...data, updatedBy: admin.id }, { new: true });
    return faq;
});

exports.deleteFaq = asyncHandler(async (id) => {
    const faq = await Faq.findByIdAndDelete(id);
    return faq;
});
