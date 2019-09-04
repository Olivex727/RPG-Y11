var path = require('path');
const express = require('express');
const fs = require("fs");
const SimplexNoise = require('simplex-noise');
const app = express();
const dir = path.join(__dirname, 'public');
let cashedmap = []
let save = 1;

app.use(express.static(dir));

app.get('/map', function(req, res) {
    const map = fs.readFileSync("saves/maptest" + save + ".txt", 'utf8');
    res.send(map);
});

app.get('/save', function (req, res) {
    const saves = fs.readFileSync("saves/save" + save + ".txt", 'utf8');
    res.send(saves);
});

app.get('/', function(req, res) {
    //console.log(req.query.num);
    save = req.query.num;
    res.sendfile("index.html");
    //res.send(save);
    
});

app.get('/js', function(req, res) {
    const page = fs.readFileSync("game.js", 'utf8');
    res.send(page);
});

app.get('/inventjs', function(req, res) {
    const page = fs.readFileSync("invent.js", 'utf8');
    res.send(page);
});

app.get('/noise', function(req, res) {
    res.sendfile("noise.html");
});
app.get('/noisejs', function(req, res) {
    const page = fs.readFileSync("noise.js", 'utf8');
    res.send(page);
});
app.get('/mapmaker', function(req, res) {
    res.sendfile("mapmaker/mapmaker.html");
});
app.get('/mapmakerjs', function(req, res) {
    const page = fs.readFileSync("mapmaker/mapmaker.js", 'utf8');
    res.send(page);
});

//mapconstructor
app.get('/snoise', function(req, res) {
    if(cashedmap.length == 0){
        const size = req.query.size;
        const sizeOfChuncks = 25
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
                let row = (parseInt(i/(size/sizeOfChuncks))*(sizeOfChuncks))+lis;
                for(value = 0; value<img2[lis].length; ++value){
                    img3[row].push(img2[lis][value])
                }
            }
        }

        img3 = deviate(img3, 20)
        img3 = averageOut(img3, 1, size, 2)

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
        function averageOut(img, times, size, radii){
            for(i = 0;i<times; ++i){
                for(y = 0;y<img.length; ++y){
                    for(x = 0;x<img[y].length; ++x){
                        let total = 0;
                        let values = 0;
                        for(y1 = -1*radii;y1<radii+1; ++y1){
                            for(x1 = -1*radii;x1<radii+1; ++x1){
                                if (x+x1 >= 0 && x+x1 < size && y+y1 >= 0 && y+y1 < size){
                                    total += img[x+x1][y+y1]
                                    values +=1
                                }
                            }
                        }
                        img[y][x] = total/values
                    }
                }
            }

            return img;
        }
        function deviate(img, times){
            for(i = 0;i<times; ++i){
                for(y = 0;y<img.length; ++y){
                    for(x = 0;x<img[y].length; ++x){
                        img[y][x] = img[y][x] + ((Math.random()-0.5)/20)*1.5
                    }
                }
            }

            return img;
        }
        cashedmap = img3
        res.json(img3);
    }
    else{
        res.json(cashedmap);
    }
});

app.listen(3000, function() {
    console.log('listening on port 3000');
});
