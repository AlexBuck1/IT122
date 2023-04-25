import { Album } from "./models/Album.js";

// return all records
Album.find({}).lean()
  .then((albums) => {
    console.log(albums);
  })
  .catch(err => next(err));
