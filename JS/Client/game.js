// config variables
var globalpos = [0,0]
var map = {};
var size = 700
var sps = 9
var playerpos = [(sps-1)/2, (sps-1)/2]
var maptext = $.ajax({
    type: "GET",
    url: "/maptest.txt",
    async: false
}).responseText.split("\n");
for (i = 0; i < maptext.length; i++){
    var tile = maptext[i].split("|")
    map[tile[0]+","+tile[1]] = {"type":tile[2], "stand":tile[3], "special": tile[4]}
};
var canvas = document.getElementById("screen");
var ctx = canvas.getContext("2d");
var colours = {
    "grass": "#33cc33",
    "water": "#0033cc",
    "mountain": "#999966",
    "lava": "#cc6600",
    "forest": "#666633",
    "player": "#0d0d0d"
};
var terrain = [
    ["grass", True],
    ["mountain", True],
    ["water", False],
    ["lava", False],
    ["forest", True]
    ]

window.onload = function() {
    window.addEventListener("keypress", update);
    drawscreen()
};

//drawing the screen
var drawscreen = () => {
    var draw = (x,y) => {
        ctx.fillStyle = colours[map[(x+globalpos[0]).toString()+","+(y+globalpos[1]).toString()]['type']];
        ctx.fillRect((x)*(size/sps), (y)*(size/sps), (size/sps)+1, (size/sps)+1)
    };

    for (y = 0; y < sps; y++){
        for (x = 0; x < sps; x++){ // draw map
            try {
                draw(x,y)
            } catch (e) { // if the tile dosent exist yet
                if (e instanceof TypeError ){

                    if(Math.random() <= 0.6){ // terrain
                        type = "grass"
                        stand = True
                    }else{
                        z = Math.floor(Math.random() * terrain.length) + 1
                        type = terrain[z][0]
                        stand = terrain[z][1]
                    }
                    if(Math.random() <= 0.1){ // terrain
                        type = "grass"
                        stand = True
                    }else{
                        z = Math.floor(Math.random() * terrain.length) + 1
                        type = terrain[z][0]
                        stand = terrain[z][1]
                    }


                    map[(x+globalpos[0]).toString()+","+(y+globalpos[1]).toString()] = {"type":"grass", "stand":"True", "special": "none"}
                    draw(x,y)
                }else{
                    console.log(e)
                }
            }
        };
    };
    ctx.fillStyle = colours["player"]
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
    if (movex+movey != 0 && playerpos[0] + movex >=0){// && playerpos[0] + movex <sps && playerpos[1] + movey >=0 && playerpos[1] + movey <sps){
    //
    //     if (map[(playerpos[0]+movex)+","+(playerpos[1]+movey)]['stand'] == "True"){
    //         ctx.fillStyle = colours[map[playerpos[0]+","+playerpos[1]]['type']];
    //         ctx.fillRect(playerpos[0]*(size/sps)+16, playerpos[1]*(size/sps)+16, 32, 32);
    //         playerpos[0] += movex;
    //         playerpos[1] += movey;
    //         ctx.fillStyle = colours["player"]
    //         ctx.fillRect(playerpos[0]*(size/sps)+16, playerpos[1]*(size/sps)+16, 32, 32);
    //     }
        globalpos = [globalpos[0]+movex, globalpos[1]+movey]
        drawscreen();
    }


};
