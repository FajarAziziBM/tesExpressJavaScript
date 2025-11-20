const express = require('express');
const router = express.Router();

const placeController = require('../controllers/placeController');
const { validatePlace, validateReview } = require('../middleware/validation');

// === SET DEFAULT PAGE TITLE (BERLAKU UNTUK SEMUA ROUTE DI FILE INI) ===
router.use((req, res, next) => {
    res.locals.title = 'BestPoint';
    next();
});

// === LIST SEMUA TEMPAT ===
    router.get('/', placeController.getAllPlaces);

// === FORM CREATE TEMPAT ===
router.get('/create', placeController.getCreatePlaceForm);

// === CREATE TEMPAT ===
router.post('/', validatePlace, placeController.createPlace);

// === FORM EDIT TEMPAT ===
router.get('/:id/edit', placeController.getEditPlaceForm);

// === UPDATE TEMPAT ===
router.put('/:id', validatePlace, placeController.updatePlace);

// === DELETE TEMPAT ===
router.delete('/:id', placeController.deletePlace);

// === CREATE REVIEW ===
router.post('/:id/reviews', validateReview, placeController.createReview);

// === DELETE REVIEW ===
router.delete('/:id/reviews/:reviewId', placeController.deleteReview);

// === DETAIL TEMPAT ===
router.get('/:id', placeController.getPlace);

module.exports = router;
