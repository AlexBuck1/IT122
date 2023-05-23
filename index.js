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
        Album.findOne({title:req.query.title}).lean()
        .then((book) => {
            res.render('detail', {result: book, title: req.query.title});
        })
        .catch(err => next(err));
    });

    app.get('/about', (req,res) => {
        res.type('text/html');
        res.render('about');
    });

    //api's
    app.get('/api/album/:title', (req, res, next) => {
        let title = req.params.title;
        console.log(title);
        Album.findOne({title: title}).then((album) => {
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

    app.get('/api/delete/:title', (req, res, next) => {
        Album.deleteOne({"title":req.params.title}).then((err, result) => {
            if (err) {
                return next(err);
            }
            else {
                console.log(result)
                res.json({"deleted": result});
            }
        });
    });

    app.post('/api/add/', (req,res, next) => {
    // find & update existing item, or add new 
    if (!req.body._id) { // insert new document
        let album = new Album(req.body);
        album.save((err,newAlbum) => {
            if (err) return next(err);
            res.json({updated: 0, _id: newAlbum._id});
        });
    } else { // update existing document
        Album.updateOne({ _id: req.body._id}, {title:req.body.title, author: req.body.author, pubdate: req.body.pubdate }, (err, result) => {
            if (err) return next(err);
            res.json({updated: result.nModified, _id: req.body._id});
        });
    }
});

    app.get('/api/add/:title/:artist/:label/:releasDate', (req, res, next) => {
        let title = req.params.title;
        Album.updateMany({title: title}, {title: title, artist: req.params.artist, label: req.params.label, releaseDate: req.params.releaseDate}, {upsert: true}, (err, result) => {
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