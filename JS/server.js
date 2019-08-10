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
    const size = req.query.size;
    const sizeOfChuncks = 20
    const squares = (size*size)/(sizeOfChuncks*sizeOfChuncks)
    let img3 = []
    for(num=0; num < size; ++num){
        img3.push([])
    }
    for(i = 0; i < squares; ++i){
        //console.log(i);
        gen = new SimplexNoise()
        const img = genee(sizeOfChuncks, sizeOfChuncks)
        const img2 = map(img,(cur, px,py,ix,iy)=>{
                let v = octave_noise(ix,iy,8)
                return v
        })
        for(lis = 0; lis < img2.length; ++lis){
            y = parseInt(size/(lis*i))
            let row = (parseInt(i/(size/sizeOfChuncks))*(sizeOfChuncks-1))+lis;
            for(value = 0; value<img2[lis].length; ++value){
                img3[row].push(img2[lis][value])
            }
        }
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
