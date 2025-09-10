const express = require('express');
const router = express.Router();
const placeController = require('../controllers/placeController');
const { validatePlace } = require('../middleware/validation');



router.get('/', placeController.getAllPlaces);
router.all('/*', (req, res, next) => { res.locals.title = 'BestPoint'; next(); });
router.post('/', validatePlace, placeController.createPlace);
router.get('/create', placeController.getCreatePlaceForm);
router.post('/', placeController.createPlace);
router.get('/:id', placeController.getPlace);
router.get('/:id/edit', placeController.getEditPlaceForm);
router.put('/:id', placeController.updatePlace);
router.delete('/:id', placeController.deletePlace);
router.post('/:id/reviews', placeController.createReview);

module.exports = router;