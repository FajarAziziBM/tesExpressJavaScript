const express = require('express');
const router = express.Router({ mergeParams: true });

const reviewController = require('../controllers/reviewController');
const { validateReview } = require('../middleware/validation');

router.use((req, res, next) => {
    res.locals.title = 'BestPoint';
    next();
});

// CREATE REVIEW
router.post('/', validateReview, reviewController.createReview);

// DELETE REVIEW
router.delete('/:reviewId', reviewController.deleteReview);

module.exports = router;
