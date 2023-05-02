import express from 'express';
import * as http from 'http';
import * as querystring from 'querystring';
import * as data from './data.js';
import { Album } from "./models/Album.js";

import cors from 'cors';
app.use('/api', cors());

const app = express();
app.set('port', process.env.PORT || 3000);
app.use(express.static('./public'));
// set the view engine to ejs
app.set('view engine', 'ejs');

//defined routes with mongodb
app.get('/', (req, res, next) => {
    Album.find({}).lean()
      .then((albums) => {
        // respond to browser only after db query completes
        res.render('home', { albums });
      })
      .catch(err => next(err))
});

app.get('/albums/:name', (req, res, next) => {
    Album.findOne({ "name": req.params.name }).lean()
        .then((albums) => {
            res.render('detail', {albums: albums} );
            })
        .catch(err => next(err));
});

app.get('/api/v1/album/:title', (req, res, next) => {
    let title = req.params.title;
    console.log(title);
    Album.findOne({title: title}, (err, result) => {
        if (err || !result) {
            res.status(404).json({"message":"not found"});
        } else {
            res.json( result );
         }
    });
});

app.get('/api/v1/albums', (req,res, next) => {
    Album.find((err,results) => {
        if (err || !results) return next(err);
        res.json(results);
    });
});

app.get('/api/v1/delete/:id', (req,res, next) => {
    Album.deleteOne({"_id":req.params.id }, (err, result) => {
        if (err) return next(err);
        // return # of items deleted
        console.log(result)
        res.json({"deleted": result});
    });
});

app.post('/api/v1/add/', (req,res, next) => {
    // find & update existing item, or add new
    console.log(req.body)
    if (!req.body._id) { // insert new document

        let album = new Album({title:req.body.title,author:req.body.author,pubdate:req.body.pubdate});
        album.save((err,newAlbum) => {
            if (err) return next(err);
            console.log(newAlbum)
            res.json({updated: 0, _id: newAlbum._id});
        });
    } else { // update existing document
        Album.updateOne({ _id: req.body._id}, {title:req.body.title, author: req.body.author, pubdate: req.body.pubdate }, (err, result) => {
            if (err) return next(err);
            res.json({updated: result.nModified, _id: req.body._id});
        });
    }
});

app.get('/api/v1/add/:title/:author/:pubdate', (req,res, next) => {
    // find & update existing item, or add new 
    let title = req.params.title;
    Album.update({ title: title}, {title:title, author: req.params.author, pubdate: req.params.pubdate }, {upsert: true }, (err, result) => {
        if (err) return next(err);
        // nModified = 0 for new item, = 1+ for updated item 
        res.json({updated: result.nModified});
    });
});

//defined routes
//app.get('/', (req,res) => {
//  res.render('home', { albums: data.getAll()});
//});

//app.get('/albums/:name', (req, res) => {
//    const name = req.params.name;
//   res.render('detail', { album: data.getItem(name)});
//})
// define 404 handler
app.use((req,res) => {
 res.type('text/plain'); 
 res.status(404);
 res.send('404 - Not found');
});

//started app
app.listen(app.get('port'), () => {
  console.log('Express started'); 
});


// const http = require("http"); 
// http.createServer((req,res) => {
//     var path = req.url.toLowerCase();    
//     switch(path) {
//         case '/':
//             res.writeHead(200, {'Content-Type': 'text/plain'});
//             res.end('Home page');
//             break;
//         case '/about':
//             res.writeHead(200, {'Content-Type': 'text/plain'});
//             res.end('About page');
//             break;
//         default:
//             res.writeHead(404, {'Content-Type': 'text/plain'});
//             res.end('Not found');
//             break;
//     }    
// }).listen(process.env.PORT || 3000);