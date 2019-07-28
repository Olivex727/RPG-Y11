// config variables
var globalpos = [0,0]
var map = {};
var size = 704
var sps = 11
var playerpos = [(sps-1)/2, (sps-1)/2]
map[(sps-1)/2+","+(sps-1)/2] = {"type":"grass", "stand":"True", "special": "none", "enemy": "none"}
var maptext = $.ajax({
    type: "GET",
    url: "/maptest.txt",
    async: false
}).responseText.split("\n");
for (i = 0; i < maptext.length; i++){
    var tile = maptext[i].split("|")
    map[tile[0]+","+tile[1]] = {"type":tile[2], "stand":tile[3], "special": tile[4], "enemy": "none"}
};
var canvas = document.getElementById("screen");
var ctx = canvas.getContext("2d");



window.onload = function() {
    window.addEventListener("keypress", update);
    drawscreen()
};

//drawing the screen
var drawscreen = () => {
    var terrain = {
        "grass": {"colour":"#33cc33", "stand":"True"},
        "water": {"colour":"#0033cc", "stand":"False"},
        "mountain": {"colour":"#999966", "stand":"True"},
        "lava": {"colour":"#cc6600", "stand":"False"},
        "forest": {"colour":"#666633", "stand":"True"},
    };
    var entities = {
        "player": {"colour":"#0d0d0d"},
        "goblin": {"colour":"#ff0000"}
    }
    var interest = ["fountain", "dungeon", "monster", "teleport"]
    var draw = (x,y) => {
        ctx.fillStyle = terrain[map[(x+globalpos[0]).toString()+","+(y+globalpos[1]).toString()]['type']]["colour"];
        ctx.fillRect((x)*(size/sps), (y)*(size/sps), (size/sps)+1, (size/sps)+1)
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

                    if(Math.random() <= 0.6){ // terrain
                        type = "grass"
                        stand = "True"
                        if(Math.random() <= 0.01){ // enemies
                            enemy = "goblin"
                        } else {
                            enemy = "none"
                        }
                    }else{
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
    var movex = 0;
    var movey = 0;
    if(key["code"] == "KeyW"){
        movey = -1;
    }
    else if (key["code"] == "KeyA"){
        movex = -1;
    }
    else if (key["code"] == "KeyS"){
        movey = 1;
    }
    else if (key["code"] == "KeyD"){
        movex = 1;
    }
    if (movex+movey != 0){// && playerpos[0] + movex >=0 && playerpos[0] + movex <sps && playerpos[1] + movey >=0 && playerpos[1] + movey <sps){
    //
    //     if (map[(playerpos[0]+movex)+","+(playerpos[1]+movey)]['stand'] == "True"){
    //         ctx.fillStyle = terrain[map[playerpos[0]+","+playerpos[1]]['type']];
    //         ctx.fillRect(playerpos[0]*(size/sps)+16, playerpos[1]*(size/sps)+16, 32, 32);
    //         playerpos[0] += movex;
    //         playerpos[1] += movey;
    //         ctx.fillStyle = terrain["player"]
    //         ctx.fillRect(playerpos[0]*(size/sps)+16, playerpos[1]*(size/sps)+16, 32, 32);
    //     }
        if (map[(playerpos[0]+globalpos[0]+movex)+","+(playerpos[1]+globalpos[1]+movey)]['stand'] == "True"){
            globalpos = [globalpos[0]+movex, globalpos[1]+movey]
            drawscreen();
        }
    }


};
