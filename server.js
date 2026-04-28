const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Postavljanje EJS-a
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Posluživanje statičkih datoteka iz "public"
app.use(express.static('public'));

// Početna ruta
app.get('/', (req, res) => {
    // Ako imaš index.html u public, posluži ga
    const indexPath = path.join(__dirname, 'public', 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.send('<h1>Dobrodošli na moju web stranicu!</h1><p><a href="/slike">Galerija</a></p>');
    }
});

// Ruta za galeriju
app.get('/slike', (req, res) => {
    const folderPath = path.join(__dirname, 'public', 'images');
    let files = [];

    // Provjera da mapa postoji
    if (fs.existsSync(folderPath)) {
        files = fs.readdirSync(folderPath);
    }

    const images = files
        .filter(file => file.endsWith('.jpg') || file.endsWith('.png'))
        .map((file, index) => ({
            url: `/images/${file}`,
            id: `slika${index + 1}`,
            title: `Slika ${index + 1}`
        }));

    // Renderanje EJS predloška
    res.render('slike', { images });
});

// Pokretanje servera na dinamičkom portu
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server pokrenut na portu ${PORT}`);
});