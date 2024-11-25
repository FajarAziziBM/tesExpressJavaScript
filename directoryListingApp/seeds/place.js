const mongoose = require('mongoose');
const Place = require('../models/place');
const hereMaps = require('../utils/hereMaps');


mongoose.connect("mongodb://localhost:27017/directorylistingapp")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));

function generateRandomPlace(index) {
    const titles = [
        'Taman Mini Indonesia Indah', 'Pantai Kuta', 'Borobudur', 'Kawah Putih',
        'Malioboro', 'Pantai Tanjung Aan', 'Bukit Bintang', 'Candi Prambanan',
        'Danau Toba', 'Kawah Ijen', 'Pantai Sanur', 'Candi Borobudur',
        'Pulau Komodo', 'Taman Nasional Gunung Rinjani', 'Bukit Tinggi',
        'Pulau Weh', 'Taman Safari Indonesia', 'Gunung Merbabu',
        'Pulau Lombok', 'Tanjung Lesung'
    ];

    const descriptions = [
        'Deskripsi tempat yang menarik.', 'Tempat yang indah untuk dikunjungi.',
        'Sangat cocok untuk keluarga.', 'Pengalaman yang tidak terlupakan.',
        'Pemandangan yang menakjubkan.', 'Kegiatan yang menyenangkan.',
        'Tempat yang kaya akan budaya.', 'Sangat direkomendasikan untuk wisatawan.'
    ];

    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
    const randomPrice = Math.floor(Math.random() * 1000000); // Random price up to 1,000,000
    const randomLocation = `${randomTitle}, Indonesia`;
    const randomImage = 'https://source.unsplash.com/collection/2349781/1280x720';

    return {
        title: `${randomTitle} ${index + 1}`,
        price: randomPrice,
        description: randomDescription,
        location: randomLocation,
        image: randomImage
    };
}

async function seedPlaces() {
    const places = Array.from({ length: 100 }, (_, index) => generateRandomPlace(index));

    const newPlace = await Promise.all(places.map(async (place) => {
        let geoData = await hereMaps.geometry(place.location);
        if (!geoData) {
            geoData = { type: 'Point', coordinates: [116.32883, -8.90952] }; // Default coordinates
        }
        return {
            ...place,
            author: '643d36579773b789e91ef660',
            images: {
                url: 'public\\images\\image-1681876521153-260851838.jpg',
                filename: 'image-1681876521153-260851838.jpg'
            },
            geometry: { ...geoData }
        };
    }));

    try {
        await Place.deleteMany({});
        await Place.insertMany(newPlace);
        console.log('Data berhasil disimpan');
    } catch (err) {
        console.log('Terjadi kesalahan saat menyimpan data:', err);
    } finally {
        mongoose.disconnect();
    }
}

seedPlaces();