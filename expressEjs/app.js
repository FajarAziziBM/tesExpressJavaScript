const express = require('express');
const path = require('path');
const fs = require('fs');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const port = 8088;

// Konfigurasi EJS dan Express Layouts
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Tentukan layout utama
app.set('layout', 'template');

// Middleware untuk menangani parsing body (jika diperlukan)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Load data dari JSON file (opsional)
let tagsData = [];
try {
  const rawData = fs.readFileSync(path.join(__dirname, 'data.json'));
  tagsData = JSON.parse(rawData);
} catch (error) {
  console.error('Error reading data.json:', error);
}

// Middleware global untuk menambahkan data umum ke semua route
app.use((req, res, next) => {
  // Data tags yang akan digunakan di sidebar atau navigasi
  res.locals.tags = [
    { name: 'Email', url: '/tag/email' },
    { name: 'Phone', url: '/tag/phone' },
    { name: 'Address', url: '/tag/address' }
  ];

  // Tambahkan waktu saat ini
  res.locals.currentTime = new Date().toLocaleString();

  next();
});

// Route Utama (Beranda)
app.get('/', (req, res) => {
  res.render('pages/home', {
    title: 'Halaman Utama',
    welcomeMessage: 'Selamat datang di aplikasi kami!'
  });
});

// Route Angka Acak
app.get('/rand', (req, res) => {
  const randomNum = Math.floor(Math.random() * 100) + 1;
  res.render('pages/random', {
    title: 'Angka Acak',
    randomNum: randomNum
  });
});

// Route Tag Dinamis
app.get('/tag/:tag', (req, res) => {
  const tag = req.params.tag;

  // Filter data berdasarkan tag
  const foundItems = tagsData
    .filter(item =>
      item[tag] !== undefined &&
      item[tag] !== null &&
      item[tag] !== ''
    )
    .map(item => ({
      id: item.id,
      value: item[tag],
      type: typeof item[tag]
    }));

  // Render halaman tag
  if (foundItems.length > 0) {
    res.render('pages/tag', {
      title: `Tag ${tag.charAt(0).toUpperCase() + tag.slice(1)}`,
      tag,
      foundItems,
      message: `Ditemukan ${foundItems.length} item untuk tag "${tag}"`
    });
  } else {
    res.render('pages/notfound', {
      title: 'Tag Tidak Ditemukan',
      tag,
      message: `Tidak ada item yang ditemukan untuk tag "${tag}"`
    });
  }
});

// Route Daftar Kucing
app.get('/cats', (req, res) => {
  const cats = [
    {
      name: "Garfield",
      age: 2,
      color: "Oranye"
    },
    {
      name: "Whiskers",
      age: 3,
      color: "Putih"
    },
    {
      name: "Tom",
      age: 4,
      color: "Abu-abu"
    }
  ];

  res.render('pages/cats', {
    title: 'Daftar Kucing',
    cats: cats
  });
});

// Route Kontak
app.get('/contact', (req, res) => {
  res.render('pages/contact', {
    title: 'Hubungi Kami',
    contactInfo: {
      email: 'info@example.com',
      phone: '+62 123 4567 890',
      address: 'Jl. Contoh No. 123, Kota'
    }
  });
});

// Middleware Error 404 (Halaman Tidak Ditemukan)
app.use((req, res, next) => {
  res.status(404).render('pages/notfound', {
    title: '404 - Halaman Tidak Ditemukan',
    message: 'Maaf, halaman yang Anda cari tidak dapat ditemukan.'
  });
});

// Middleware Penanganan Kesalahan Global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('pages/error', {
    title: 'Kesalahan Server',
    message: 'Terjadi kesalahan pada server.',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Jalankan Server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
  console.log(`Mode: ${process.env.NODE_ENV || 'development'}`);
});

// Tangani penutupan server dengan baik
process.on('SIGINT', () => {
  console.log('Server ditutup');
  process.exit();
});