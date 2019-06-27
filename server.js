/*
var http = require('http');
var fs = require('fs');
var index = fs.readFileSync('index.html');

http.createServer(function (req, res) {

    //res.writeHead(200, {
    //    'Content-Type': 'text/plain'
    //);
    //res.end(index);
    res.writec
    res.end();
}).listen(8080);

fs.readFile('locs.json', (err, data) => {
    if (err) throw err;

    console.log(data.toString());
})
*/
const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

router.get('/', function (req, res) {
    res.sendFile(path.join('index.html'));
    //__dirname : It will resolve to your project folder.
});

router.get('/sitemap', function (req, res) {
    res.sendFile(path.join('game.js'));
});

//add the router
app.use('/', router);
app.listen(process.env.port || 3000);