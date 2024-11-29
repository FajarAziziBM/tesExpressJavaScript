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
    const randomPrice = Math.floor(Math.random() * 1000000).toString(); // Convert to string
    const randomLocation = `${randomTitle}, Indonesia`;
    const randomImage = 'https://source.unsplash.com/collection/2349781/1280x720';

    return {
        title: randomTitle,
        price: randomPrice,
        description: randomDescription,
        location: randomLocation,
        image: randomImage
    };
}

async function seedPlaces() {
    try {
        // Hapus data lama terlebih dahulu
        await Place.deleteMany({});

        // Buat array untuk menyimpan tempat
        const placesToSave = [];

        // Loop untuk membuat tempat
        for (let i = 0; i < 100; i++) {
            // Buat tempat acak
            const place = generateRandomPlace(i);

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
                        url: place.image || 'default-image-url.jpg',
                        filename: `image-${Date.now()}-${i}.jpg`
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