const Place = require('../models/place');
const Review = require('../models/review');
const warpAsync = require('../utils/warpAsync');

const validateReviewInput = (reviewData) => {
    const errors = {};
    let isValid = true;

    if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
        errors.rating = 'Rating harus di antara 1 dan 5';
        isValid = false;
    }

    if (!reviewData.body || reviewData.body.trim().length < 5) {
        errors.body = 'Ulasan harus memiliki minimal 5 karakter';
        isValid = false;
    }

    return { isValid, errors };
};


const reviewController = {

    // CREATE REVIEW
    createReview: warpAsync(async (req, res) => {
        const place = await Place.findById(req.params.id);

        if (!place) {
            return res.status(404).render('pages/places/error', {
                error: {
                    message: 'Tempat tidak ditemukan',
                    details: 'ID tempat tidak valid'
                }
            });
        }

        const { isValid, errors } = validateReviewInput(req.body.review);

        if (!isValid) {
            return res.status(400).render('pages/places/show', {
                errors,
                formData: req.body.review,
                place,
                showReviewForm: true
            });
        }

        const newReview = new Review({
            rating: parseInt(req.body.review.rating),
            body: req.body.review.body.trim(),
        });

        await newReview.save();

        place.reviews.push(newReview._id);
        await place.save();

        res.redirect(`/places/${place._id}`);
    }),

    // DELETE REVIEW
    deleteReview: warpAsync(async (req, res, next) => {
        const { id: placeId, reviewId } = req.params;

        const [place, review] = await Promise.all([
            Place.findById(placeId),
            Review.findById(reviewId)
        ]);

        if (!place) return res.status(404).send("Place not found");
        if (!review) return res.status(404).send("Review not found");

        await Promise.all([
            Place.findByIdAndUpdate(placeId, {
                $pull: { reviews: reviewId }
            }),
            Review.findByIdAndDelete(reviewId)
        ]);

        res.redirect(`/places/${placeId}`);
    })
};

module.exports = reviewController;
