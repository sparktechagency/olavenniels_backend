const faqService = require("./faq.service");
const { ApiError } = require("../../errors/errorHandler");
const asyncHandler = require("../../utils/asyncHandler");
const { deleteFile } = require("../../utils/unLinkFiles");


exports.createFaq = asyncHandler(async (req, res) => {
    const { question, answer } = req.body;
    const faq = await faqService.createFaq({ question, answer }, req.admin);
    console.log(faq)
    res.status(201).json({ success: true, message: "Faq created successfully", data: faq });
});

exports.getAllFaqs = asyncHandler(async (req, res) => {
    const faqs = await faqService.getAllFaqs(req.query);
    res.json({ success: true, message: "Faqs fetched successfully", data: faqs });
});

exports.getFaqById = asyncHandler(async (req, res) => {
    const faq = await faqService.getFaqById(req.params.id);
    res.json({ success: true, message: "Faq fetched successfully", data: faq });
});

exports.updateFaq = asyncHandler(async (req, res) => {
    const { question, answer } = req.body;
    const faq = await faqService.updateFaq(req.params.id, { question, answer }, req.admin);
    res.json({ success: true, message: "Faq updated successfully", data: faq });
});

exports.deleteFaq = asyncHandler(async (req, res) => {
    const faq = await faqService.deleteFaq(req.params.id);
    if (!faq) throw new ApiError("Faq not found", 404);
    res.json({ success: true, message: "Faq deleted successfully", data: faq });
});
