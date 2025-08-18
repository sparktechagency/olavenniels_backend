const Faq = require("../Faq/Faq");
const { ApiError } = require("../../errors/errorHandler");
const asyncHandler = require("../../utils/asyncHandler");


exports.createFaq = async (data, admin) => {
    const faq = await Faq.create({ ...data, createdBy: admin.id });
    if (!faq) throw new ApiError("Faq not created", 400);
    return faq;
}

exports.getAllFaqs = async (query) => {
    const faqs = await Faq.find(query);
    if (!faqs) return [];
    return faqs;
};

exports.getFaqById = async (id) => {
    const faq = await Faq.findById(id);
    if (!faq) return null;
    return faq;
};

exports.updateFaq = async (id, data, admin) => {
    const faq = await Faq.findByIdAndUpdate(id, { ...data, updatedBy: admin.id }, { new: true });
    if (!faq) throw new ApiError("Faq not found", 404);
    return faq;
};

exports.deleteFaq = async (id) => {
    const faq = await Faq.findByIdAndDelete(id);
    if (!faq) throw new ApiError("Faq not found", 404);
    return faq;
};
