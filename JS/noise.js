const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");

    let genmap = $.ajax({
        type: "GET",
        url: "/snoise?size=1000",
        async: false
    }).responseJSON
    const terrain = {
        "sand": {"colour":"##ffff4d", "stand":"True", "image":"False"},
        "grass": {"colour":"#33cc33", "stand":"True", "image":"False"},
        "water": {"colour":"#0033cc", "stand":"False", "image":"False"},
        "mountain": {"colour":"#666633", "stand":"True", "image":"False"},
        "lava": {"colour":"#cc6600", "stand":"False", "image":"False"},
        "forest": {"colour":"#336600", "stand":"True", "image":"False"},
        "snow": {"colour":"#b3ffff", "stand":"True", "image":"False"}
    };
    for(y = 0; y < genmap.length; ++y){
        for(x = 0; x < genmap[y].length; ++x){
            pos = genmap[x][y]
            if((pos <= 0.4 && pos >= 0.28)||(pos <= 0.68 && pos >= 0.54)){ // terrain
                type = "grass"
            }
            else if (pos < 0.54 && pos > 0.4) {
                type = "forest"
            }
            else if (pos < 0.28 && pos >= 0.14) {
                type = "sand"
            }
            else if (pos >= 0.91) {
                type = "snow"
            }
            else if (pos >= 0.76 && pos < 0.91) {
                type = "mountain"
            }
            else if (pos <= 0.14) {
                type = "water"
            }
            else if (pos < 0.68 && pos > 0.76) {
                type = "lava"
            }
            colour = terrain[type]["colour"]
            ctx.fillStyle = colour;
            ctx.fillRect( x, y, 1, 1 );
        }
    }
