// controllers/placeController.js
const Place = require('../models/place');
const axios = require('axios');
const warpAsync = require('../utils/warpAsync');
const mongoose = require('mongoose');

// ========== VALIDASI INPUT TEMPAT ==========
const validatePlaceInput = (data) => {
    const errors = {};

    if (!data.title || data.title.trim() === '') {
        errors.title = 'Judul tempat harus diisi';
    }

    if (!data.location || data.location.trim() === '') {
        errors.location = 'Lokasi harus diisi';
    }

    if (data.price && isNaN(parseFloat(data.price))) {
        errors.price = 'Harga harus berupa angka';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// ========== VALIDASI GAMBAR ==========
const validateImageUrl = async (imageUrl) => {
    try {
        const response = await axios.head(imageUrl);
        return response.status === 200 && response.headers['content-type'].startsWith('image/');
    } catch (error) {
        return false;
    }
};

// ========== CONTROLLER OBJECT ==========
const placeController = {

    getAllPlaces: warpAsync(async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = 9;
        const skip = (page - 1) * limit;

        const totalPlaces = await Place.countDocuments();
        const places = await Place.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        res.render('pages/places/index', {
            places,
            currentPage: page,
            totalPages: Math.ceil(totalPlaces / limit) || 1,
            totalPlaces: totalPlaces || 0,
            error: null
        });
    }),

    getCreatePlaceForm: (req, res) => {
        res.render('pages/places/create', {
            errors: {},
            formData: {},
            error: null
        });
    },

    createPlace: warpAsync(async (req, res) => {
        const { isValid, errors } = validatePlaceInput(req.body);

        if (!isValid) {
            return res.status(400).render('pages/places/create', {
                errors,
                formData: req.body
            });
        }

        const imageUrl = req.body.image || 'https://via.placeholder.com/800x400';
        const isValidImage = await validateImageUrl(imageUrl);

        const newPlace = new Place({
            title: req.body.title,
            price: parseFloat(req.body.price) || 0,
            description: req.body.description,
            location: req.body.location,
            images: {
                url: isValidImage ? imageUrl : 'https://via.placeholder.com/800x400',
                description: req.body.imageDescription || req.body.title
            }
        });

        await newPlace.save();
        res.redirect('/places');
    }),

    getPlace: warpAsync(async (req, res) => {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).render('pages/places/error', {
                error: {
                    message: 'ID tidak valid',
                    details: 'Format ID tidak sesuai'
                }
            });
        }

        const place = await Place.findById(id).populate('reviews');

        if (!place) {
            return res.status(404).render('pages/places/error', {
                error: {
                    message: 'Tempat tidak ditemukan',
                    details: 'ID tempat tidak valid'
                }
            });
        }

        const isValidImage = place.images?.url
            ? await validateImageUrl(place.images.url)
            : false;

        place.images = {
            url: isValidImage ? place.images.url : 'https://via.placeholder.com/800x400',
            description: place.images?.description || place.title
        };

        res.render('pages/places/show', { place });
    }),

    getEditPlaceForm: warpAsync(async (req, res) => {
        const place = await Place.findById(req.params.id);

        if (!place) {
            return res.status(404).render('pages/places/error', {
                error: {
                    message: 'Tempat tidak ditemukan',
                    details: 'ID tempat tidak valid'
                }
            });
        }

        res.render('pages/places/edit', {
            place,
            errors: {},
            formData: place
        });
    }),

    updatePlace: warpAsync(async (req, res) => {
        const { isValid, errors } = validatePlaceInput(req.body);

        if (!isValid) {
            return res.status(400).render('pages/places/edit', {
                errors,
                formData: req.body,
                place: { _id: req.params.id }
            });
        }

        const imageUrl = req.body.image || 'https://via.placeholder.com/800x400';
        const isValidImage = await validateImageUrl(imageUrl);

        const place = await Place.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                price: parseFloat(req.body.price) || 0,
                description: req.body.description,
                location: req.body.location,
                images: {
                    url: isValidImage ? imageUrl : 'https://via.placeholder.com/800x400',
                    description: req.body.imageDescription || req.body.title
                }
            },
            { new: true }
        );

        if (!place) {
            return res.status(404).render('pages/places/error', {
                error: {
                    message: 'Tempat tidak ditemukan',
                    details: 'ID tempat tidak valid'
                }
            });
        }

        res.redirect(`/places/${place._id}`);
    }),

    deletePlace: warpAsync(async (req, res) => {
        const { id } = req.params;

        const place = await Place.findByIdAndDelete(id);
        if (!place) return res.status(404).send("Place not found");

        res.redirect('/places');
    }),
};

module.exports = placeController;
