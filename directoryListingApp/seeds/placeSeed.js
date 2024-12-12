const mongoose = require('mongoose');
const axios = require('axios');
const Place = require('../models/place');
const hereMaps = require('../utils/hereMaps');

// Konfigurasi Pexels API
const PEXELS_API_KEY = 'g5jLYFGjo0bnR0WH1lXAEctsKK18GrwWhaAtq30nyCQo2H6cLFRDbFhJ';
const PEXELS_API_URL = 'https://api.pexels.com/v1/search';

mongoose.connect("mongodb://localhost:27017/directorylistingapp")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));

async function fetchPexelsImages(query = 'travel landscape', count = 100) {
    try {
        const response = await axios.get(PEXELS_API_URL, {
            headers: {
                'Authorization': PEXELS_API_KEY
            },
            params: {
                query: query,
                per_page: count,
                page: 1
            }
        });

        return response.data.photos.map(photo => ({
            url: photo.src.large2x,
            thumbnail: photo.src.medium,
            photographer: photo.photographer,
            description: photo.alt || 'Travel Landscape'
        }));
    } catch (error) {
        console.error('Error fetching Pexels images:', error);
        return [];
    }
}

function generateRandomPlace(index, images) {
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

    // Perbaikan: Gunakan Number() atau langsung gunakan bilangan bulat
    const randomPrice = Math.floor(Math.random() * 1000000);

    const randomLocation = `${randomTitle}, Indonesia`;

    // Pilih gambar dari daftar gambar Pexels
    const imageData = images[index % images.length] || {
        url: 'https://via.placeholder.com/1280x720',
        description: randomTitle,
        photographer: 'Unknown'
    };

    return {
        title: randomTitle,
        price: randomPrice,
        description: randomDescription,
        location: randomLocation,
        image: imageData.url,
        imageDescription: imageData.description,
        photographer: imageData.photographer
    };
}

async function seedPlaces() {
    try {
        // Hapus data lama terlebih dahulu
        await Place.deleteMany({});

        // Ambil gambar dari Pexels
        const pexelsImages = await fetchPexelsImages('travel landscape', 100);

        // Buat array untuk menyimpan tempat
        const placesToSave = [];

        // Loop untuk membuat tempat
        for (let i = 0; i < 100; i++) {
            // Buat tempat acak
            const place = generateRandomPlace(i, pexelsImages);

            try {
                // Coba dapatkan data geometri
                let geoData = await hereMaps.geometry(place.location);

                // Jika gagal, gunakan koordinat default
                if (!geoData) {
                    geoData = {
                        type: 'Point',
                        coordinates: [116.32883, -8.90952]
                    };
                }

                // Buat objek tempat untuk disimpan
                const newPlace = new Place({
                    title: place.title,
                    price: place.price,
                    description: place.description,
                    location: place.location,

                    // Optional fields
                    author: '643d36579773b789e91ef660', // ID author default

                    images: {
                        url: place.image || 'https://via.placeholder.com/1280x720',
                        filename: `image-${Date.now()}-${i}.jpg`,
                        description: place.imageDescription,
                        photographer: place.photographer
                    },

                    geometry: {
                        type: 'Point',
                        coordinates: geoData.coordinates
                    }
                });

                // Tambahkan ke array
                placesToSave.push(newPlace);

            } catch (geoError) {
                console.error(`Gagal memproses geometri untuk ${place.title}:`, geoError);
            }
        }

        // Simpan semua tempat sekaligus
        const savedPlaces = await Place.insertMany(placesToSave);

        console.log(`Berhasil menyimpan ${savedPlaces.length} tempat`);

    } catch (error) {
        console.error('Kesalahan saat menyimpan tempat:', error);
    } finally {
        // Putuskan koneksi mongoose
        mongoose.disconnect();
    }
}

// Jalankan fungsi dengan penanganan error
seedPlaces().catch(err => {
    console.error('Kesalahan fatal:', err);
    mongoose.disconnect();
});