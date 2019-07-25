var playerpos = [0,0]
var map = {};
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

window.onload = function() {
    window.addEventListener("keypress", update);
    for (y = 0; y < 10; y++){
        for (x = 0; x < 10; x++){ // draw map
            ctx.fillStyle = colours[map[x+","+y]['type']];
            ctx.fillRect(x*64, y*64, 64, 64);
        };
    };
    ctx.fillStyle = colours["player"]
    ctx.fillRect(playerpos[0]*64+16, playerpos[1]*64+16, 32, 32);
};

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
    if (movex+movey != 0 && playerpos[0] + movex >=0 && playerpos[0] + movex <10 && playerpos[1] + movey >=0 && playerpos[1] + movey <10){

        if (map[(playerpos[0]+movex)+","+(playerpos[1]+movey)]['stand'] == "True"){
            ctx.fillStyle = colours[map[playerpos[0]+","+playerpos[1]]['type']];
            ctx.fillRect(playerpos[0]*64+16, playerpos[1]*64+16, 32, 32);
            playerpos[0] += movex;
            playerpos[1] += movey;
            ctx.fillStyle = colours["player"]
            ctx.fillRect(playerpos[0]*64+16, playerpos[1]*64+16, 32, 32);
        }

    }


};
