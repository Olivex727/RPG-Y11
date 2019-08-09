const express = require('express');
const fs = require("fs");
const SimplexNoise = require('simplex-noise');
const app = express();

app.get('/map', function(req, res) {
    const map = fs.readFileSync("maptest.txt", 'utf8');
    res.send(map);
});

app.get('/', function(req, res) {
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
    let size = req.query.size;
    let img3 = []
    for(i = 0; i < size/50; ++i){
        gen = new SimplexNoise()
        const img = genee(size/50, size/50)
        const img2 = map(img,(cur, px,py,ix,iy)=>{
                let v = octave_noise(ix,iy,8)
                return v
        })
        for(lis = 0; lis < img2.length; ++lis){
            img3.push(img2[lis])
        }
        console.log(img3);
    }

    function genee(width, height) {
            const rows = [];
            for (let y = 0; y < height; y++) {
                const row = [];
                for(let x=0; x<width; x++) {
                    row[x] = 0;
                }
                rows[y] = row;
            }
            return rows;
    }

    function octave_noise(nx,ny,octaves) {
        let val = 0;
        let freq = 1;
        let max = 0;
        let amp = 1;
        for(let i=0; i<octaves; i++) {
            gene = gen.noise2D(nx, ny) * 0.5 + 0.5;
            val += parseFloat(gene)*amp;
            max += amp;
            amp /= 2;
            freq  *= 2;
        }
        return val/max;
    }

    function map(data,cb) {
        const width = data[0].length;
        const height = data.length;
        return data.map((row,py)=>{
            return row.map((val,px) => {
                const nx = px/width, ny = py/height;
                return cb(val,px,py,nx,ny);
            })
        });
    }
    res.json(img3);
});

app.listen(3000, function() {
    console.log('listening on port 3000');
});
