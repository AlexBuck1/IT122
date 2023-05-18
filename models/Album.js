

import mongoose from 'mongoose';
import {connectionString} from "../credentials.js";
const { Schema } = mongoose;



mongoose.connect(connectionString, {
    dbName: 'class-projects',
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('open', () => {
  console.log('Mongoose connected.');
});

// define Album model in JSON key/value pairs
// values indicate the data type of each key
const albumSchema = new Schema({
 title: { type: String, required: true },
 artist: String,
 label: String,
 releaseDate: String
});

export const Album = mongoose.model('Album', albumSchema);