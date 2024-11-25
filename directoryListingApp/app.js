const express = require("express");
const { connect } = require("http2");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const { title } = require("process");
const Place = require('./models/place');

// const dotenv = require("dotenv");
// const authRoute = require("./routes/auth");
// const userRoute = require("./routes/users");
// const postRoute = require("./routes/posts");
// const categoryRoute = require("./routes/categories");
// const multer = require("multer");
// const cors = require("cors");

// connect to mongodb
mongoose.connect("mongodb://localhost:27017/directorylistingapp")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {

    res.render("home");

});

app.get("/places", (req, res) => {
    Place.find().then((places) => {
        res.render("places/index", { places: places });
    }).catch((err) => {
        console.log(err);
    });

});

app.get("/places/create", (req, res) => {
    res.render("places/create");
})

app.get("/places/:id", async (req, res) => {
    try {
        const place = await Place.findById(req.params.id); // Menggunakan findById untuk mendapatkan tempat berdasarkan ID
        if (!place) {
            return res.status(404).send("Place not found"); // Menangani jika tempat tidak ditemukan
        }
        res.render("places/show", { place: place });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error retrieving place"); // Menangani kesalahan saat mengambil tempat
    }
});

// app.get('/seed/places', async (req, res) => {
//     const places = new Place({
//         title: "Eiffel Tower",
//         price: "$50",
//         description: "A beautiful tower",
//         location: "Paris, France"
//     });

//     try {
//         await places.save();
//         res.send(places );
//     } catch (error) {
//         res.status(500).send("Error creating seed: " + error.message);
//     }
// });

app.listen(8080, () => {
    console.log("Server is running on port http://localhost:8080");
});