let albums = [
    {"name": "The House is Burning", "artist": "Isaiah Rashad", "label": "Top dawg Entertainment", "release date": "July 30, 2021"},
    {"name": "Astroworld", "artist": "Travis Scott", "label": "Cactus Jack/Epic/Grand Hustle", "release date": "August 3, 2018"},
    {"name": "2001", "artist": "Dr. Dre", "label": "Aftermath Entertainment/Interscope Records", "release date": "November 16, 1999"},
    {"name": "HEROES & VILLAINS", "artist": "Metro Boomin", "label": "Boominati Worldwide/Republic Records", "release date": "December 2, 2022"},
    {"name": "KOD", "artist": "J. Cole", "label": "Dreamville/Roc Nation Records", "release date": "April 20, 2018"}

]

const getAll = () => {
    return albums;
}

const getItem = (name) => {
    return albums.find((album) => album.name === name);
}

export {getItem};
export {getAll};