const express = require('express');
const router = express.Router();
const placeController = require('../controllers/placeController');

router.get('/', placeController.getAllPlaces);
router.get('/create', placeController.getCreatePlaceForm);
router.post('/', placeController.createPlace);
router.get('/:id', placeController.getPlace);
router.get('/:id/edit', placeController.getEditPlaceForm);
router.put('/:id', placeController.updatePlace);
router.delete('/:id', placeController.deletePlace);
router.post('/:id/reviews', placeController.createReview);

module.exports = router;