// config variables
let globalpos = [0,0]
const map = {};
const size = 512
let genmap;
const sps = 11
const playerpos = [(sps-1)/2, (sps-1)/2]
map[(sps-1)/2+","+(sps-1)/2] = {"type":"grass", "stand":"True", "special": "none", "enemy": "none"}
const maptext = $.ajax({
    type: "GET",
    url: "/map",
    async: false
}).responseText.split("\n");
for (i = 0; i < maptext.length; i++){
    let tile = maptext[i].split("|")
    map[tile[0]+","+tile[1]] = {"type":tile[2], "stand":tile[3], "special": tile[4], "enemy": tile[5]}
};
let keysdown = []
const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");

window.onload = function() {
    window.addEventListener("keydown", update);
    window.addEventListener("keyup", update);
    genmap = $.ajax({
        type: "GET",
        url: "/snoise?size=1000",
        async: false
    }).responseJSON
    drawscreen(0,0)
};

//drawing the screen
const drawscreen = (movex,movey) => {
    tileImage = (image) => {
        var img = new Image();
        img.src = "/Images/"+image+".png"
        return img
    }
    const terrain = {
        "sand": {"colour":"#ffff4d", "stand":"True", "image":tileImage("sand")},
        "grass": {"colour":"#33cc33", "stand":"True", "image":tileImage("grass")},
        "water": {"colour":"#0033cc", "stand":"False", "image":"False"},
        "mountain": {"colour":"#666633", "stand":"True", "image":tileImage("mountain")},
        "lava": {"colour":"#cc6600", "stand":"False", "image":"False"},
        "forest": {"colour":"#336600", "stand":"True", "image":tileImage("forest")},
        "snow": {"colour":"#b3ffff", "stand":"True", "image":tileImage("snow")}
    };
    const entities = {
        "player": {"colour":"#0d0d0d", "image":tileImage("player")},
        "goblin": {"colour":"#ff0000"}
    }
    const interest = ["fountain", "dungeon", "monster", "teleport"]
    const draw = (x,y) => {
        // check to see if the tile changes (although redraws if different interest currently)
        if (map[(x+globalpos[0]).toString()+","+(y+globalpos[1]).toString()] != map[(x+globalpos[0]-movex).toString()+","+(y+globalpos[1]-movey).toString()] || movex+movey == 0){
            if(terrain[map[(x+globalpos[0]).toString()+","+(y+globalpos[1]).toString()]['type']]["image"]=="False") {
                ctx.fillStyle = terrain[map[(x+globalpos[0]).toString()+","+(y+globalpos[1]).toString()]['type']]["colour"];
                ctx.fillRect((x)*(size/sps), (y)*(size/sps), (size/sps), (size/sps))
            } else {
                ctx.drawImage(terrain[map[(x+globalpos[0]).toString()+","+(y+globalpos[1]).toString()]['type']]["image"], (x)*(size/sps), (y)*(size/sps), (size/sps), (size/sps));
            }

        }
        if (map[(x+globalpos[0]).toString()+","+(y+globalpos[1]).toString()]['enemy'] != "none") {
            ctx.fillStyle = entities[map[(x+globalpos[0]).toString()+","+(y+globalpos[1]).toString()]['enemy']]["colour"];
            ctx.fillRect((x)*(size/sps)+(size/sps)/4, (y)*(size/sps)+(size/sps)/4, (size/sps)/2, (size/sps)/2)
        }
    };

    for (y = 0; y < sps; y++){
        for (x = 0; x < sps; x++){ // draw map
            try {
                draw(x,y)
            } catch (e) { // if the tile dosent exist yet
                if (e instanceof TypeError ){
                    // console.log(genmap);
                    // console.log(x+globalpos[0]+500, y+globalpos[1]+500)
                    // console.log(genmap[x+globalpos[0]+500][y+globalpos[1]+500]);
                    // chances of different tiles
                    pos = genmap[(x+globalpos[0]+500)][(y+globalpos[1]+500)]
                    let stand = "True";
                    let enemy = "none";
                    if((pos <= 0.375 && pos >= 0.28)||(pos <= 0.56 && pos >= 0.49)){ // terrain
                        type = "grass"
                        if(Math.random() <= 0.01){ // enemies
                            enemy = "goblin"
                            stand = "False"
                    }
                }
                    else if (pos < 0.49 && pos > 0.375) {
                        type = "forest"
                    }
                    else if (pos < 0.28 && pos >= 0.175) {
                        type = "sand"
                    }
                    else if (pos >= 0.725 && pos < 0.85) {
                        type = "snow"
                    }
                    else if (pos > 0.56 && pos < 0.725) {
                        type = "mountain"
                    }
                    else if (pos <= 0.175) {
                        type = "water"
                        stand = "False"
                    }
                    else if (pos >= 0.85) {
                        type = "lava"
                        stand = "False"
                    }
                    else{
                        type = Object.keys(terrain)[Object.keys(terrain).length * Math.random() << 0]
                        stand = terrain[type]["stand"]
                    }
                    if(Math.random() <= 0.1){ // terrain
                        z = Math.floor(Math.random() * Object.keys(terrain).length) + 1
                        special = interest[z]
                    } else {
                        special = "none"
                    }


                    map[(x+globalpos[0]).toString()+","+(y+globalpos[1]).toString()] = {"type":type, "stand":stand, "special": special, "enemy": enemy}
                    draw(x,y)
                }else{
                    console.log(e)
                }
            }
        };
    };
    if(entities["player"]["colour"] == "False"){
        ctx.fillStyle = entities["player"]["colour"]
        ctx.fillRect(playerpos[0]*(size/sps)+((size/sps)/4), playerpos[1]*(size/sps)+((size/sps)/4), ((size/sps)/2), ((size/sps)/2));
    } else {
        ctx.drawImage(entities["player"]["image"], playerpos[0]*(size/sps)+((size/sps)/4), playerpos[1]*(size/sps)+((size/sps)/4), ((size/sps)/2), ((size/sps)/2));
    }

}

function update(key) { //keys
    function arrayRemove(arr, value) {

       return arr.filter(function(ele){
           return ele != value;
       });

    }
    let movex = 0;
    let movey = 0;
    if (key["type"] == "keydown"){
        if(keysdown.indexOf(key["key"]) == -1){
            keysdown.push(key["key"])
        }
        if(keysdown.indexOf("w") >= 0){
            movey = -1;
        }
        else if (keysdown.indexOf("s") >= 0){
            movey = 1;
        }
        if (keysdown.indexOf("a") >= 0){
            movex = -1;
        }
        else if (keysdown.indexOf("d")>= 0){
            movex = 1;
        }
        if (movex != 0 || movey != 0){
            if (map[(playerpos[0]+globalpos[0]+movex)+","+(playerpos[1]+globalpos[1]+movey)]['stand'] == "True"){
                globalpos = [globalpos[0]+movex, globalpos[1]+movey]
                drawscreen(movex,movey);
            }
        }
    }
    else{
        if(keysdown.indexOf(key["key"]) != -1){
            keysdown = arrayRemove(keysdown, key["key"]);
        }
    }
};
