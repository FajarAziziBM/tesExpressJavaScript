directoryListingApp/
│
├── config/                          // Folder ini berisi file konfigurasi untuk aplikasi
│   ├── database.js                  // Konfigurasi koneksi database, termasuk pengaturan seperti URL, username, dan password
│   └── server.js                    // Konfigurasi server, seperti pengaturan port dan middleware yang digunakan
│
├── controllers/                     // Folder ini berisi kontroler yang menangani logika bisnis
│   ├── api/                         // Kontroler untuk API
│   │   └── placeController.js       // Kontroler untuk menangani permintaan API terkait "Place"
│   └── web/                         // Kontroler untuk tampilan web
│       └── placeController.js       // Kontroler untuk menangani permintaan tampilan web terkait "Place"
│
├── middleware/                      // Folder ini berisi middleware yang digunakan dalam aplikasi
│   ├── authMiddleware.js            // Middleware untuk otentikasi pengguna, memeriksa apakah pengguna terautentikasi
│   └── errorHandler.js              // Middleware untuk menangani error secara global dalam aplikasi
│
├── models/                          // Folder ini berisi model data untuk entitas yang digunakan dalam aplikasi
│   └── place.js                     // Model untuk entitas "Place", mendefinisikan skema dan interaksi dengan database
│
├── seeds/                           // Folder ini berisi skrip untuk mengisi database dengan data awal
│   └── place.js                     // Skrip untuk menambahkan data contoh ke dalam tabel "Place"
│
├── routes/                          // Folder ini berisi definisi rute untuk aplikasi
│   ├── api/                         // Rute untuk API
│   │   └── placeRoutes.js           // Rute API untuk "Place", mendefinisikan endpoint dan metode HTTP
│   └── web/                         // Rute untuk tampilan web
│       └── placeRoutes.js           // Rute web untuk "Place", mendefinisikan endpoint untuk tampilan
│
├── utils/                           // Folder ini berisi utilitas atau fungsi pembantu
│   └── wrapAsync.js                 // Utility untuk membungkus fungsi asinkron, menangani error dengan lebih baik
│
├── views/                           // Folder ini berisi file tampilan (template) untuk rendering halaman
│   ├── home.ejs                     // Halaman utama aplikasi
│   ├── pages/                       // Folder untuk halaman-halaman spesifik
│   │   └── places/                  // Folder untuk halaman terkait "Place"
│   │       ├── index.ejs            // Halaman daftar tempat
│   │       ├── create.ejs           // Halaman untuk membuat tempat baru
│   │       ├── edit.ejs             // Halaman untuk mengedit tempat
│   │       └── show.ejs             // Halaman untuk menampilkan detail tempat
│   ├── 404.ejs                      // Halaman untuk error 404 (halaman tidak ditemukan)
│   └── error.ejs                    // Halaman untuk menampilkan error umum
│
├── public/                          // Folder ini berisi file statis yang dapat diakses oleh klien
│   ├── css/                         // Folder untuk file CSS
│   ├── js/                          // Folder untuk file JavaScript
│   └── images/                      // Folder untuk gambar
│
├── .env                             // File untuk variabel lingkungan, seperti konfigurasi database dan API keys
├── .gitignore                       // File untuk menentukan file atau folder yang harus diabaikan oleh Git
├── app.js                           // File utama untuk menginisialisasi dan menjalankan aplikasi
├── package.json                     // File konfigurasi proyek Node.js, berisi dependensi dan skrip
└── README.md                        // Dokumentasi proyek yang menjelaskan cara menggunakan dan mengatur aplikasi

best praktik direktori express untuk app setelah ku pelajari