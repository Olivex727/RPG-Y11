const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");


function gen(width, height) {
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

let gene = new SimplexNoise();
function snoise(nx, ny) {
    return gene.noise2D(nx, ny) / 2 + 0.5;

function octave_noise(nx,ny,octaves) {
    let val = 0;
    let freq = 1;
    let max = 0;
    let amp = 1;
    for(let i=0; i<octaves; i++) {
        val += snoise(nx*freq,ny*freq)*amp;
        max += amp;
        amp /= 2;
        freq  *= 2;
    }
    return val/max;
}

const img = gen(100, 100)
const img2 = map(img,(cur, px,py,ix,iy)=>{
        const v = octave_noise(ix,iy,8)
        console.log(v);
        return { "r":v, "g":v, "b":v}
    })

for(y = 0; y < img2.length; ++y){
    for(x = 0; x < img2[y].length; ++x){
        colour = "rgb("+(img2[y][x]["r"]*255).toString()+","+(img2[y][x]["g"]*255).toString()+","+(img2[y][x]["b"]*255).toString()+")";
        ctx.fillStyle = colour;
        ctx.fillRect( x, y, 1, 1 );
    }
}
