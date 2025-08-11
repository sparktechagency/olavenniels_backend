const audioBookService = require('./audioBook.service');
const asyncHandler = require('../../utils/asyncHandler');

exports.createAudioBook = asyncHandler(async (req, res) => {
  // Assuming bookCover and audioFile are uploaded files
  // You may receive them as req.files.bookCover[0], req.files.audioFile[0] if using multer.fields()
  // Adjust according to your multer setup

  const { bookName, synopsis, category } = req.body;

  const bookCoverPath = req.files?.bookCover ? req.files.bookCover[0].path : undefined;
  const audioFilePath = req.files?.audioFile ? req.files.audioFile[0].path : undefined;

  const data = {
    bookCover: bookCoverPath,
    audioFile: audioFilePath,
    bookName,
    synopsis,
    category,
  };

  const audioBook = await audioBookService.createAudioBook(data, req.admin);
  res.json({ success: true, message: 'AudioBook created successfully', data: audioBook });
});

exports.getAllAudioBooks = asyncHandler(async (req, res) => {
  const audioBooks = await audioBookService.getAllAudioBooks(req.query);
  res.json({ success: true, message: 'AudioBooks fetched successfully', data: audioBooks });
});

exports.getAudioBookById = asyncHandler(async (req, res) => {
  const audioBook = await audioBookService.getAudioBookById(req.params.id);
  res.json({ success: true, message: 'AudioBook fetched successfully', data: audioBook });
});

exports.updateAudioBook = asyncHandler(async (req, res) => {
    const data = {
      bookName: req.body.bookName,
      synopsis: req.body.synopsis,
      category: req.body.category,
    };
  
    // Only add bookCover if new file uploaded
    if (req.files?.bookCover && req.files.bookCover.length > 0) {
      data.bookCover = req.files.bookCover[0].path;
    }
  
    // Only add audioFile if new file uploaded
    if (req.files?.audioFile && req.files.audioFile.length > 0) {
      data.audioFile = req.files.audioFile[0].path;
    }
  
    const audioBook = await audioBookService.updateAudioBook(req.params.id, data, req.admin);
    res.json({ success: true, message: 'AudioBook updated successfully', data: audioBook });
  });
  

exports.deleteAudioBook = asyncHandler(async (req, res) => {
  const audioBook = await audioBookService.deleteAudioBook(req.params.id, req.admin);
  res.json({ success: true, message: 'AudioBook deleted successfully', data: audioBook });
});
