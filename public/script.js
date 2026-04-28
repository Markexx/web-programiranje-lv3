let sviFilmovi = [];
let kosarica = [];

// ====== DOHVAT CSV ======
fetch('movies.csv')
    .then(res => res.text())
    .then(csv => {

        const rezultat = Papa.parse(csv, {
            header: true,
            skipEmptyLines: true
        });

        sviFilmovi = rezultat.data.map(film => ({
            naslov: film.Naslov,
            godina: Number(film.Godina),
            zanr: film.Zanr,
            trajanje: Number(film.Trajanje_min),
            ocjena: Number(film.Ocjena),
            drzava: film.Zemlja_porijekla
        }));

        prikaziTablicu(sviFilmovi);
    });


// ====== TABLICA ======
function prikaziTablicu(filmovi) {
    const tbody = document.querySelector('#filmovi-tablica tbody');
    tbody.innerHTML = '';

    filmovi.forEach((film, i) => {
        tbody.innerHTML += `
            <tr>
                <td>${i + 1}</td>
                <td>${film.naslov}</td>
                <td>${film.godina}</td>
                <td>${film.zanr}</td>
                <td>${film.trajanje}</td>
                <td>${film.drzava}</td>
                <td>${film.ocjena}</td>
                <td>
                    <button onclick="dodajUKosaricu(${i})">Dodaj</button>
                </td>
            </tr>
        `;
    });
}


// ====== FILTER ======
document.getElementById("filter-rating").addEventListener("input", e => {
    document.getElementById("rating-value").textContent = e.target.value;
});

document.getElementById("filter-btn").addEventListener("click", () => {

    const genre = document.getElementById("filter-genre").value;
    const year = Number(document.getElementById("filter-year").value);
    const rating = Number(document.getElementById("filter-rating").value);

    const filtrirani = sviFilmovi.filter(film => {

        const matchGenre = !genre || film.zanr.includes(genre);
        const matchYear = !year || film.godina >= year;
        const matchRating = film.ocjena >= rating;

        return matchGenre && matchYear && matchRating;
    });

    prikaziTablicu(filtrirani);
});


// ====== KOŠARICA ======
function dodajUKosaricu(index) {
    const film = sviFilmovi[index];

    if (!kosarica.includes(film)) {
        kosarica.push(film);
        osvjeziKosaricu();
    } else {
        alert("Film je već u košarici!");
    }
}

function osvjeziKosaricu() {
    const lista = document.getElementById("kosarica-lista");
    lista.innerHTML = '';

    kosarica.forEach((film, i) => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${film.naslov} (${film.godina})
            <button onclick="ukloniIzKosarice(${i})">X</button>
        `;
        lista.appendChild(li);
    });
}

function ukloniIzKosarice(index) {
    kosarica.splice(index, 1);
    osvjeziKosaricu();
}


// ====== POTVRDA ======
document.getElementById("potvrdi-kosaricu").addEventListener("click", () => {

    if (kosarica.length === 0) {
        alert("Košarica je prazna!");
        return;
    }

    alert(`Uspješno ste dodali ${kosarica.length} filmova!`);

    kosarica = [];
    osvjeziKosaricu();
});