const asyncHandler = require("../../utils/asyncHandler");
const EbookService = require("./ebook.service");

/** Create Ebook */
exports.createEbook = asyncHandler(async (req, res) => {
  const { bookName, synopsis, category, totalPages } = req.body;

  const ebook = await EbookService.createEbook(
    {
      bookName,
      synopsis,
      category,
      totalPages,
      bookCover: req.files?.bookCover?.[0]?.path || null,
      pdfFile: req.files?.pdfFile?.[0]?.path || null,
    },
    req.user
  );

  res.status(201).json({ success: true, message: "Ebook created successfully", data: ebook });
});

/** Get all ebooks (search + pagination) */
exports.getAllEbooks = asyncHandler(async (req, res) => {
  const result = await EbookService.getAllEbooks(req.query);
  res.status(200).json({ success: true, ...result });
});

/** Get single ebook */
exports.getEbookById = asyncHandler(async (req, res) => {
  const ebook = await EbookService.getEbookById(req.params.id);
  res.status(200).json({ success: true, data: ebook });
});

/** Update ebook */
exports.updateEbook = asyncHandler(async (req, res) => {
  const ebook = await EbookService.updateEbook(
    req.params.id,
    {
      ...req.body,
      bookCover: req.files?.bookCover?.[0]?.path || undefined,
      pdfFile: req.files?.pdfFile?.[0]?.path || undefined,
    },
    req.user
  );

  res.status(200).json({ success: true, message: "Ebook updated successfully", data: ebook });
});

/** Delete ebook */
exports.deleteEbook = asyncHandler(async (req, res) => {
  await EbookService.deleteEbook(req.params.id, req.user);
  res.status(200).json({ success: true, message: "Ebook deleted successfully" });
});
