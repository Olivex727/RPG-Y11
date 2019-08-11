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
const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");

window.onload = function() {
    window.addEventListener("keydown", update);
    genmap = $.ajax({
        type: "GET",
        url: "/snoise?size=1000",
        async: false
    }).responseJSON
    console.log(genmap);
    drawscreen(0,0)
};

//drawing the screen
const drawscreen = (movex,movey) => {
    const terrain = {
        "sand": {"colour":"##ffff4d", "stand":"True", "image":"False"},
        "grass": {"colour":"#33cc33", "stand":"True", "image":"False"},
        "water": {"colour":"#0033cc", "stand":"False", "image":"False"},
        "mountain": {"colour":"#666633", "stand":"True", "image":"False"},
        "lava": {"colour":"#cc6600", "stand":"False", "image":"False"},
        "forest": {"colour":"#336600", "stand":"True", "image":"False"},
        "snow": {"colour":"#b3ffff", "stand":"True", "image":"False"}
    };
    const entities = {
        "player": {"colour":"#0d0d0d"},
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
                let img = document.getElementById(map[(x+globalpos[0]).toString()+","+(y+globalpos[1]).toString()]['type']);
                ctx.drawImage(img, (x)*(size/sps), (y)*(size/sps));
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
                    if((pos <= 0.4 && pos >= 0.28)||(pos <= 0.68 && pos >= 0.54)){ // terrain
                        type = "grass"
                        stand = "True"
                        if(Math.random() <= 0.01){ // enemies
                            enemy = "goblin"
                            stand = "False"
                        } else {
                            enemy = "none"
                        }
                    }
                    else if (pos < 0.54 && pos > 0.4) {
                        type = "forest"
                        stand = "True"
                        enemy = "none"
                    }
                    else if (pos < 0.28 && pos >= 0.14) {
                        type = "sand"
                        stand = "True"
                        enemy = "none"
                    }
                    else if (pos >= 0.91) {
                        type = "snow"
                        stand = "True"
                        enemy = "none"
                    }
                    else if (pos >= 0.76 && pos < 0.91) {
                        type = "mountain"
                        stand = "True"
                        enemy = "none"
                    }
                    else if (pos <= 0.14) {
                        type = "water"
                        stand = "False"
                        enemy = "none"
                    }
                    else if (pos < 0.68 && pos > 0.76) {
                        type = "lava"
                        stand = "False"
                        enemy = "none"
                    }
                    else{
                        type = Object.keys(terrain)[Object.keys(terrain).length * Math.random() << 0]
                        stand = terrain[type]["stand"]
                        enemy = "none"
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
    ctx.fillStyle = entities["player"]["colour"]
    ctx.fillRect(playerpos[0]*(size/sps)+((size/sps)/4), playerpos[1]*(size/sps)+((size/sps)/4), ((size/sps)/2), ((size/sps)/2));
}

function update(key) { //keys
    let movex = 0;
    let movey = 0;
    if(key["code"] == "KeyW"){
        movey = -1;
    }
    if (key["code"] == "KeyA"){
        movex = -1;
    }
    if (key["code"] == "KeyS"){
        movey = 1;
    }
    if (key["code"] == "KeyD"){
        movex = 1;
    }
    if (movex+movey != 0){
        if (map[(playerpos[0]+globalpos[0]+movex)+","+(playerpos[1]+globalpos[1]+movey)]['stand'] == "True"){
            globalpos = [globalpos[0]+movex, globalpos[1]+movey]
            drawscreen(movex,movey);
        }
    }


};
