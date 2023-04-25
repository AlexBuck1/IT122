

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

// define Book model in JSON key/value pairs
// values indicate the data type of each key
const albumSchema = new Schema({
 name: { type: String, required: true },
 artist: String,
 label: String,
 release_date: String
});

export const Album = mongoose.model('Album', albumSchema);