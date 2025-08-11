const express = require('express');
const router = express.Router();
const audioBookController = require('./audioBook.controller');
const upload = require('../../utils/upload');
const { authAdmin } = require('../../middleware/authMiddleware');

// Upload multiple files: bookCover and audioFile
// Expect form-data keys: "bookCover" and "audioFile"
const uploadFields = upload.fields([
  { name: 'bookCover', maxCount: 1 },
  { name: 'audioFile', maxCount: 1 }
]);

router.post('/create', authAdmin, uploadFields, audioBookController.createAudioBook);
router.get('/get', audioBookController.getAllAudioBooks);
router.get('/get/:id', audioBookController.getAudioBookById);
router.put('/update/:id', authAdmin, uploadFields, audioBookController.updateAudioBook);
router.delete('/delete/:id', authAdmin, audioBookController.deleteAudioBook);

module.exports = router;
