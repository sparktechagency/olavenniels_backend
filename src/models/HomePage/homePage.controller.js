const AudioBook = require('../AudioBook/AudioBook');
const Ebook = require('../Ebook/Ebook');
const asyncHandler = require('../../utils/asyncHandler');

// Common fields to select for both AudioBooks and Ebooks
const commonSelectFields = 'bookCover bookName categoryName';

// @desc    Get home page data
// @route   GET /api/home
// @access  Public
const getHomePageData = asyncHandler(async (req, res) => {
    // Run all queries in parallel for better performance
    const [
        recommendedAudioBooks,
        newAudioBooks,
        trendingAudioBooks,
        recommendedEbooks,
        newEbooks,
        trendingEbooks
    ] = await Promise.all([
        // AudioBooks
        AudioBook.find({ tags: { $in: ['recommended'] } })
            .sort({ createdAt: -1 })
            .limit(5)
            .select(commonSelectFields)
            .lean(),

        AudioBook.find({ 
            createdAt: { 
                $gte: new Date(new Date().setDate(new Date().getDate() - 30)) 
            }
        })
        .sort({ createdAt: -1 })
        .limit(5)
        .select(commonSelectFields)
        .lean(),

        AudioBook.find()
            .sort({ viewCount: -1 })
            .limit(5)
            .select(commonSelectFields)
            .lean(),

        // Ebooks
        Ebook.find({ tags: { $in: ['recommended'] } })
            .sort({ createdAt: -1 })
            .limit(5)
            .select(commonSelectFields)
            .lean(),

        Ebook.find({ 
            createdAt: { 
                $gte: new Date(new Date().setDate(new Date().getDate() - 30)) 
            }
        })
        .sort({ createdAt: -1 })
        .limit(5)
        .select(commonSelectFields)
        .lean(),

        Ebook.find()
            .sort({ viewCount: -1 })
            .limit(5)
            .select(commonSelectFields)
            .lean()
    ]);

    // Structure the response
    res.json({
        success: true,
        data: {
            recommended: {
                audioBooks: recommendedAudioBooks,
                ebooks: recommendedEbooks
            },
            newReleases: {
                audioBooks: newAudioBooks,
                ebooks: newEbooks
            },
            trending: {
                audioBooks: trendingAudioBooks,
                ebooks: trendingEbooks
            }
        }
    });
});

module.exports = {
    getHomePageData
};