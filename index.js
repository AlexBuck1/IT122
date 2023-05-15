import express from 'express';
import { Album } from "./models/Album.js";

const app = express();
app.set('port', process.env.PORT || 3000);
app.use(express.static('./public'));
app.use(express.urlencoded());
app.use(express.json());

import cors from 'cors';
app.use('/api', cors());

app.set('view engine', 'ejs');

//defined routes with mongodb
app.get('/', (req, res, next) => {
    Album.find({}).lean()
      .then((albums) => {
        res.render('home_react', {items: JSON.stringify(albums)});

      });
    });

    app.get('/detail', (req,res,next) => {
        Album.findOne({name:req.query.name}).lean()
        .then((book) => {
            res.render('detail', {result: book, name: req.query.name});
        })
        .catch(err => next(err));
    });

    app.get('/about', (req,res) => {
        res.type('text/html');
        res.render('about');
    });

    //api's
    app.get('/api/album/:name', (req, res, next) => {
        let name = req.params.name;
        console.log(name);
        Album.findOne({name: name}).then((album) => {
            res.json(album);
        })
        .catch(err => next(err));
    });

    app.get('/api/albums', (req, res, next) => {
        Album.find({}).then((err, result) => {
            if(err) {
                res.send(err);
            }
            res.json(result);
        });
    });

    app.get('/api/delete/:name', (req, res, next) => {
        Album.deleteOne({"name":req.params.name}).then((err, rusult) => {
            if (err) {
                return next(err);
            }
            else {
                console.log(result)
                res.json({"deleted": result});
            }
        });
    });

    app.get('/api/add/:name/:artist/:label/:releasDate', (req, res, next) => {
        let name = req.params.name;
        Album.updateMany({name: name}, {name: name, artist: req.params.artist, label: req.params.label, releaseDate: req.params.releaseDate}, {upsert: true}, (err, result) => {
            if (err) return next(err);
            res.json({updated: result.nModified});
        });
    });

    app.use((req, res) => {
        res.type('text/plain');
        res.status(404);
        res.send('404 - Not found');
    });

    app.listen(app.get('port'), () => {
        console.log('Express started');
    });