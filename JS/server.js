const express = require('express');
const fs = require("fs");
const SimplexNoise = require('simplex-noise');
const app = express();

app.get('/map', function(req, res) {
    const map = fs.readFileSync("maptest.txt", 'utf8');
    res.send(map);
});

app.get('/', function(req, res) {
    const page = fs.readFileSync("index.html", 'utf8');
    res.sendfile("index.html");
});
app.get('/js', function(req, res) {
    const page = fs.readFileSync("game.js", 'utf8');
    res.send(page);
});

app.get('/noise', function(req, res) {
    res.sendfile("noise.html");
});
app.get('/noisejs', function(req, res) {
    const page = fs.readFileSync("noise.js", 'utf8');
    res.send(page);
});

app.get('/snoise', function(req, res) {
    res.send(new SimplexNoise(););
});

app.listen(3000, function() {
    console.log('listening on port 3000');
});
