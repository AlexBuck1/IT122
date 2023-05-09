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
    app.get('/api/v1/album/:name', (req, res, next) => {
        let name = req.params.name;
        Album.findOne({name: name}, (err, result) => {
            if (err || !result) return next(err);
            res.json(result);
        });
    });

    app.get('/api/v1/albums', (req, res, next) => {
        Album.find((err,results) => {
            if (err || !results) return next(err);
            res.json(results);
        });
    });

    app.get('/api/v1/delete/name', (req, res, next) => {
        Album.deleteOne({"name":req.params.id}, (err, result) => {
            if (err) return next(err);
            res.json({"deleted": result});
        });
    });

    app.post('/api/v1/add/', (req, res, next) => {
        if (!req.body._id) {
            let album = new Album(req.body);
            album.save((err,newAlbum) => {
                if (err) return next(err);
                res.json({updated: 0, _id: newAlbum._id});
            });
        }
    });

    app.get('/api/v1/add/:name/:artist/:label/:releasDate', (req, res, next) => {
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