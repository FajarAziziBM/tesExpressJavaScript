const Place = require('../models/place');

exports.getAllPlaces = async (req, res) => {
    try {
        const places = await Place.find();
        res.render('places/index', { places });
    } catch (err) {
        res.status(500).render('error', { error: err });
    }
};

exports.getCreatePlaceForm = (req, res) => {
    res.render('places/create');
};

exports.createPlace = async (req, res) => {
    try {
        const newPlace = new Place({
            title: req.body.title,
            price: parseFloat(req.body.price),
            description: req.body.description,
            location: req.body.location
        });

        await newPlace.save();
        res.redirect('/places');
    } catch (err) {
        res.status(400).render('places/create', { error: err });
    }
};

exports.getPlace = async (req, res) => {
    try {
        const place = await Place.findById(req.params.id);
        if (!place) {
            return res.status(404).send('Place not found');
        }
        res.render('places/show', { place });
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.getEditPlaceForm = async (req, res) => {
    try {
        const place = await Place.findById(req.params.id);
        if (!place) {
            return res.status(404).send('Place not found');
        }
        res.render('places/edit', { place });
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.updatePlace = async (req, res) => {
    try {
        const place = await Place.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            price: parseFloat(req.body.price),
            description: req.body.description,
            location: req.body.location
        }, { new: true });

        if (!place) {
            return res.status(404).send('Place not found');
        }
        res.redirect(`/places/${place._id}`);
    } catch (err) {
        res.status(400).send('Update failed');
    }
};

exports.deletePlace = async (req, res) => {
    try {
        await Place.findByIdAndDelete(req.params.id);
        res.redirect('/places');
    } catch (err) {
        res.status(500).send('Delete failed');
    }
};