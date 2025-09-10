require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

// Configuration Imports
const serverConfig = require('./config/server');

// Route Imports
const placeRoutes = require('./routes/placeRoutes');

class Application {
    constructor() {
        this.app = express();
        this.initializeConfiguration();
        this.initializeDatabase();
        this.initializeMiddleware();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }

    initializeConfiguration() {
        this.app.engine('ejs', ejsMate);
        this.app.set('view engine', 'ejs');
        this.app.set('views', path.join(__dirname, 'views'));
    }

    initializeDatabase() {
        mongoose.connect(process.env.MONGODB_URI)
            .then(() => console.log('✅ Database Connected Successfully'))
            .catch((error) => {
                console.error('❌ Database Connection Error:', error);
                process.exit(1);
            });
    }

    initializeMiddleware() {
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
        this.app.use(methodOverride('_method'));
        this.app.use(express.static(path.join(__dirname, 'public')));

        this.app.use(this.configureSession());

        this.app.use((req, res, next) => {
            res.locals.title = 'BestPoint';
            res.locals.currentPage = req.path.split('/')[1] || 'home';
            next();
        });
    }

    configureSession() {
        return session({
            secret: process.env.SESSION_SECRET || 'defaultSecretKey',
            resave: false,
            saveUninitialized: false,
            store: MongoStore.create({
                mongoUrl: process.env.MONGODB_URI,
                collectionName: 'sessions',
                autoRemove: 'interval',
                autoRemoveInterval: 10
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24,
                secure: process.env.NODE_ENV === 'production'
            }
        });
    }

    initializeRoutes() {
        this.app.get("/", this.homeRouteHandler.bind(this));
        this.app.use("/places", placeRoutes);
        this.app.use(this.notFoundHandler.bind(this));
    }

    homeRouteHandler(req, res) {
        res.render("home", { title: "Home Page" });
    }

    notFoundHandler(req, res) {
        res.status(404).render('pages/404', {
            title: 'Halaman Tidak Ditemukan'
        });
    }

    initializeErrorHandling() {
        this.app.use((err, req, res, next) => {
            const statusCode = err.statusCode || 500;
            const status = err.status || 'error';

            res.status(statusCode).render('pages/error', {
                title: 'Error',
                error: {
                    status,
                    statusCode,
                    message: err.message,
                    details: process.env.NODE_ENV === 'development' ? err.stack : ''
                }
            });
        });
    }

    start() {
        const PORT = process.env.PORT || serverConfig.defaultPort;
        const server = this.app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
        });

        process.on('SIGTERM', () => {
            console.log('SIGTERM signal received: closing HTTP server');
            server.close(() => {
                console.log('HTTP server closed');
                mongoose.connection.close(false, () => {
                    console.log('MongoDB connection closed');
                    process.exit(0);
                });
            });
        });
    }
}

// Singleton Pattern
class ApplicationSingleton {
    static getInstance() {
        if (!this.instance) {
            this.instance = new Application();
        }
        return this.instance;
    }
}

const app = ApplicationSingleton.getInstance();
app.start();

module.exports = app;
