import express from 'express';
import * as http from 'http';
import * as querystring from 'querystring';
import * as data from './data.js';

const app = express();
app.set('port', process.env.PORT || 3000);
app.use(express.static('./public'));
// set the view engine to ejs
app.set('view engine', 'ejs');

//defined routes
app.get('/', (req,res) => {
  res.render('home', { albums: data.getAll()});
});

app.get('/album/:name', (req, res) => {
    const name = req.params.name;
    res.render('detail', { album: data.getItem(name)});
})

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