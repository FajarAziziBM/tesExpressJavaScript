const Place = require('../models/place');
const Review = require('../models/review');
const axios = require('axios');
const warpAsync = require('../utils/warpAsync');
const mongoose = require('mongoose');
const ExpressError = require('../utils/ErrorHandler');


// Validasi input untuk tempat
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

// Middleware untuk memeriksa gambar
const validateImageUrl = async (imageUrl) => {
    try {
        const response = await axios.head(imageUrl);
        return response.status === 200 && response.headers['content-type'].startsWith('image/');
    } catch (error) {
        return false;
    }
};

exports.getAllPlaces = warpAsync(async (req, res) => {
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
});

exports.getCreatePlaceForm = (req, res) => {
    res.render('pages/places/create', {
        errors: {},
        formData: {},
        error: null
    });
};

exports.createPlace = warpAsync(async (req, res) => {
    // Validasi input
    const { isValid, errors } = validatePlaceInput(req.body);

    if (!isValid) {
        return res.status(400).render('pages/places/create', {
            errors,
            formData: req.body
        });
    }

    // Validasi URL gambar jika ada
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
});

exports.getPlace = warpAsync(async (req, res) => {
    const { id } = req.params;

    // Validasi ID
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
});

exports.getEditPlaceForm = warpAsync(async (req, res) => {
    const place = await Place.findById(req.params.id);

    if (!place) {
        return res.status(404).render('places/error', {
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
});

exports.updatePlace = warpAsync(async (req, res) => {
    const { isValid, errors } = validatePlaceInput(req.body);

    if (!isValid) {
        return res.status(400).render('pages/places/edit', {
            errors,
            formData: req.body,
            place: { _id: req.params.id }
        });
    }

    // Validasi URL gambar
    const imageUrl = req.body.image || 'https://via.placeholder.com/800x400';
    const isValidImage = await validateImageUrl(imageUrl);

    const place = await Place.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        price: parseFloat(req.body.price) || 0,
        description: req.body.description,
        location: req.body.location,
        images: {
            url: isValidImage ? imageUrl : 'https://via.placeholder.com/800x400',
            description: req.body.imageDescription || req.body.title
        }
    }, { new: true });

    if (!place) {
        return res.status(404).render('pages/places/error', {
            error: {
                message: 'Tempat tidak ditemukan',
                details: 'ID tempat tidak valid'
            }
        });
    }

    res.redirect(`/places/${place._id}`);
});

exports.deletePlace = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Hapus Place → trigger hook post('findOneAndDelete') untuk review
        const place = await Place.findByIdAndDelete(id);
        if (!place) return res.status(404).send("Place not found");

        // Semua review terkait sudah otomatis terhapus oleh hook
        res.redirect('/places');
    } catch (err) {
        next(err);
    }
};

exports.createReview = warpAsync(async (req, res) => {
    const createReview = async (req, res, next) => {
        console.log('Received review body:', req.body); // ✅ This is the correct place
        // rest of your logic...
    };

    try {
        const place = await Place.findById(req.params.id);

        if (!place) {
            return res.status(404).render('pages/places/error', {
                error: {
                    message: 'Tempat tidak ditemukan',
                    details: 'ID tempat tidak valid'
                }
            });
        }

        // Validasi input review
        const { isValid, errors } = validateReviewInput(req.body.review);

        if (!isValid) {
            return res.status(400).render('pages/places/show', {
                errors,
                formData: req.body.review,
                place: place,
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
    } catch (error) {
        console.error('Error creating review:', error);
        return res.status(500).render('pages/places/error', {
            error: {
                message: 'Gagal menambahkan ulasan',
                details: error.message || 'Terjadi kesalahan pada server'
            }
        });
    }
});

// Fungsi validasi input review
function validateReviewInput(reviewData) {
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
}

exports.deleteReview = async (req, res, next) => {
    try {
        const { id: placeId, reviewId } = req.params;

        // Pastikan Place & Review ada (jalankan paralel)
        const [place, review] = await Promise.all([
            Place.findById(placeId),
            Review.findById(reviewId)
        ]);

        if (!place) return res.status(404).send("Place not found");
        if (!review) return res.status(404).send("Review not found");

        // Hapus review dari place dan hapus dokumen review secara paralel
        await Promise.all([
            Place.findByIdAndUpdate(placeId, {
                $pull: { reviews: reviewId }
            }),

            Review.findByIdAndDelete(reviewId)
        ]);

        res.redirect(`/places/${placeId}`);
    } catch (err) {
        next(err);
    }
};