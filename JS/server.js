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
app.listen(process.env.port || 3000);*/
var http=require('http');
var url = require('url');
var fs = require("fs");
var path = require('path');
var baseDirectory = __dirname+"/Client";
console.log(baseDirectory);

var port = 7000;
//var map = fs.readFileSync('maptest.txt', 'utf8')

http.createServer(function (request, response) {
    try {
        var requestUrl = url.parse(request.url);

        // need to use path.normalize so people can't access directories underneath baseDirectory
        var fsPath = baseDirectory+path.normalize(requestUrl.pathname);

        var fileStream = fs.createReadStream(fsPath);
        fileStream.pipe(response);
        fileStream.on('open', function() {
             response.writeHead(200);
        });
        fileStream.on('error',function(e) {
             response.writeHead(404);
             response.destroy();
        });
   } catch(e) {
        response.writeHead(500);
        response.destroy();
        console.log(e.stack);
   };
}).listen(port);

console.log("listening on port "+port);
