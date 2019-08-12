const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");

    let genmap = $.ajax({
        type: "GET",
        url: "/snoise?size=1000",
        async: false
    }).responseJSON
    let terrain = {
        "sand": {"colour":"#ffff4d", "count":0},
        "grass": {"colour":"#33cc33", "count":0},
        "water": {"colour":"#0033cc", "count":0},
        "mountain": {"colour":"#666633", "count":0},
        "lava": {"colour":"#cc6600", "count":0},
        "forest": {"colour":"#336600", "count":0},
        "snow": {"colour":"#b3ffff", "count":0}
    };
    for(y = 0; y < genmap.length; ++y){
        for(x = 0; x < genmap[y].length; ++x){
            pos = genmap[x][y]
            if((pos <= 0.375 && pos >= 0.28)||(pos <= 0.56 && pos >= 0.49)){ // terrain
                type = "grass"
            }
            else if (pos < 0.49 && pos > 0.375) {
                type = "forest"
            }
            else if (pos < 0.28 && pos >= 0.175) {
                type = "sand"
            }
            else if (pos >= 0.85) {
                type = "lava"
            }
            else if (pos >= 0.725 && pos < 0.85) {
                type = "snow"
            }
            else if (pos <= 0.175) {
                type = "water"
            }
            else if (pos > 0.56 && pos < 0.725) {
                type = "mountain"
            }
            terrain[type]["count"] += 1;
            colour = terrain[type]["colour"];
            ctx.fillStyle = colour;
            ctx.fillRect( x, y, 1, 1 );
        }
    }
    for(key in terrain){
        $( ".counts" ).append( "<li>"+key+": "+terrain[key]["count"]+" total, "+terrain[key]["count"]/(1000*10)+"%</li>" );
    }
