const AudioBook = require('./AudioBook');
const { ApiError } = require('../../errors/errorHandler');
const fs = require('fs');
const path = require('path');

const deleteFile = (filePath) => {
  if (filePath && fs.existsSync(path.resolve(filePath))) {
    fs.unlinkSync(path.resolve(filePath));
  }
};

exports.createAudioBook = async (data, user) => {
  if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    throw new ApiError('Only admins or super admins can create audiobooks', 403);
  }

  const audioBook = await AudioBook.create({
    ...data,
    createdBy: user.id,  // add if your schema has createdBy, else remove
  });
  return audioBook;
};

exports.getAllAudioBooks = async (query) => {
  const { limit = 10, page = 1, search, categoryName } = query;
  const skip = (page - 1) * limit;

  const filter = {};

  if (search) filter.bookName = { $regex: search, $options: "i" };
  if (categoryName) filter.categoryName = { $regex: `^${categoryName}$`, $options: "i" };

  const audioBooks = await AudioBook.find(filter)
    .skip(skip)
    .limit(parseInt(limit))
    .populate('category', 'name');

    if(audioBooks.length === 0) throw new ApiError("AudioBooks not found", 404);

  const total = await AudioBook.countDocuments(filter);

  return {
    audioBooks,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    },
  };
};

exports.getAudioBookById = async (id) => {
  const audioBook = await AudioBook.findById(id).populate('category', 'name');
  if (!audioBook) throw new ApiError('AudioBook not found', 404);
  return audioBook;
};

exports.updateAudioBook = async (id, data, user) => {
  if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    throw new ApiError('Only admins or super admins can update audiobooks', 403);
  }

  const audioBook = await AudioBook.findById(id);
  if (!audioBook) throw new ApiError('AudioBook not found', 404);

  // If updating files stored locally, delete old ones before updating
  if (data.bookCover && data.bookCover !== audioBook.bookCover) {
    deleteFile(audioBook.bookCover);
  }
  if (data.audioFile && data.audioFile !== audioBook.audioFile) {
    deleteFile(audioBook.audioFile);
  }

  Object.assign(audioBook, data);
  await audioBook.save();
  return audioBook;
};

exports.deleteAudioBook = async (id, user) => {
  if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    throw new ApiError('Only admins or super admins can delete audiobooks', 403);
  }

  const audioBook = await AudioBook.findByIdAndDelete(id);
  if (!audioBook) throw new ApiError('AudioBook not found', 404);

  deleteFile(audioBook.bookCover);
  deleteFile(audioBook.audioFile);

  return audioBook;
};
