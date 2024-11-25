const express = require('express');
const app = express();
const port = 8080;

app.get('/', (req, res) => {
  res.send(`
    <h1>Home</h1>
    <p>Ini merupakan halaman utama</p>
  `);
});

// Mempelajari Route Parameter Di Express.Js


app.get('/about/:about', (req, res) => {
  // Akses parameter dengan req.params.about
  const about = req.params.about;
  res.send(`Belajar tentang mengambil nilai parameter dari sebuah route, contohnya : ${about}`);
})

app.get('/user/:username/post/:postId', (req, res) => { // jalan kan di browser http://localhost:8080/user/johndoe/post/123
  const { username, postId } = req.params;
  res.send(`Username: ${username}, Post ID: ${postId}`);
});


app.get('*', (req, res) => { // route ini harus paling bawah!
  res.send('<h1>Anda tersesat</h1>');
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
