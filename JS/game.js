// config variables
let globalpos = [0,0]
const map = {};
const canvas = document.getElementById("screen");
let size = canvas.width
let genmap;
const sps = 15
let sizeOfSquares = size/sps
const playerpos = [(sps-1)/2, (sps-1)/2]
map[(sps-1)/2+","+(sps-1)/2] = {"type":"grass", "stand":"True", "special": "none", "enemy": "none"}
const maptext = $.ajax({
    type: "GET",
    url: "/map",
    async: false
}).responseText.split("\n");
for (i = 0; i < maptext.length; ++i){
    let tile = maptext[i].split("|")
    map[tile[0]+","+tile[1]] = {"type":tile[2], "stand":tile[3], "special": tile[4], "enemy": tile[5]}
};
let keysdown = []
const ctx = canvas.getContext("2d");
ctx.font = "20px Verdana";

window.onload = function() {
    window.addEventListener("keydown", update);
    window.addEventListener("keyup", update);
    window.addEventListener("resize", () =>{size = canvas.width});
    genmap = $.ajax({
        type: "GET",
        url: "/snoise?size=1000",
        async: false
    }).responseJSON
    $(".output").html("press s to start");
    drawscreen(0,0)
};

let combatActive = false;

//drawing the screen
const drawscreen =  (movex,movey) => {
    tileImage = (image) => {
        let img = new Image();
        img.src = "/Images/"+image+".png"
        return img
    }
    const terrain = {
        "sand": {"colour":"#ffff4d", "stand":"True", "image":tileImage("sand")},
        "grass": {"colour":"#33cc33", "stand":"True", "image":tileImage("grass")},
        "water": {"colour":"#0033cc", "stand":"False", "image":tileImage("water")},
        "mountain": {"colour":"#666633", "stand":"True", "image":tileImage("mountain")},
        "lava": {"colour":"#cc6600", "stand":"False", "image":tileImage("lava")},
        "forest": {"colour":"#336600", "stand":"True", "image":tileImage("forest")},
        "snow": {"colour":"#b3ffff", "stand":"True", "image":tileImage("snow")},
        "houseWall": {"colour":"#00000", "stand":"False", "image":tileImage("houseWall")},
        "bridge": {"colour":"#000000", "stand":"True", "image":tileImage("bridge")},
        "roof1": {"colour":"#000000", "stand":"False", "image":tileImage("roof1")},
        "roof2": {"colour":"#000000", "stand":"False", "image":tileImage("roof2")},
        "roof3": {"colour":"#000000", "stand":"False", "image":tileImage("roof3")},
        "roof4": {"colour":"#000000", "stand":"False", "image":tileImage("roof4")},
        "roof5": {"colour":"#000000", "stand":"False", "image":tileImage("roof5")},
        "roof6": {"colour":"#000000", "stand":"False", "image":tileImage("roof6")},
        "roof7": {"colour":"#000000", "stand":"False", "image":tileImage("roof7")},
        "chimney": {"colour":"#000000", "stand":"False", "image":tileImage("chimney")},
        "door": {"colour":"#000000", "stand":"False", "image":tileImage("door")}

    };
    const entities = {
        "player": {"colour":"#0d0d0d", "image":tileImage("player")},
        "enemy": {"colour":"#ff0000", "image":tileImage("enemy")}
    }
    const interest = ["fountain", "dungeon", "monster", "teleport"]
    const draw = (x,y) => {
        // check to see if the tile changes (although redraws if different interest currently)
        if (map[(x+globalpos[0]).toString()+","+(y+globalpos[1]).toString()] != map[(x+globalpos[0]-movex).toString()+","+(y+globalpos[1]-movey).toString()] || movex+movey == 0){
            if(terrain[map[(x+globalpos[0]).toString()+","+(y+globalpos[1]).toString()]['type']]["image"]=="False") {
                ctx.fillStyle = terrain[map[(x+globalpos[0]).toString()+","+(y+globalpos[1]).toString()]['type']]["colour"];
                ctx.fillRect((x)*(sizeOfSquares), (y)*(sizeOfSquares), (sizeOfSquares), (sizeOfSquares))
            } else {
                ctx.drawImage(terrain[map[(x+globalpos[0]).toString()+","+(y+globalpos[1]).toString()]['type']]["image"], (x)*(sizeOfSquares), (y)*(sizeOfSquares), (sizeOfSquares), (sizeOfSquares));
            }

        }
        if (map[(x+globalpos[0]).toString()+","+(y+globalpos[1]).toString()]['enemy'] != "none") {
            if(x == playerpos[0] || y == playerpos[1]){
                console.log("battle start")
                combatActive = true;
                drawcombat("start", entities);
            }
            ctx.drawImage(entities["enemy"]["image"], x*(sizeOfSquares)+((sizeOfSquares)/8), y*(sizeOfSquares)+((sizeOfSquares)/8), (sizeOfSquares)/1.3, (sizeOfSquares)/1.3);
        }
    };

    for (y = 0; y < sps; ++y){
        for (x = 0; x < sps; ++x){ // draw map
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
        ctx.fillRect(playerpos[0]*(sizeOfSquares)+((sizeOfSquares)/4), playerpos[1]*(sizeOfSquares)+((sizeOfSquares)/4), ((sizeOfSquares)/2), ((sizeOfSquares)/2));
    } else {
        ctx.drawImage(entities["player"]["image"], playerpos[0]*(sizeOfSquares)+((sizeOfSquares)/8), playerpos[1]*(sizeOfSquares)+((sizeOfSquares)/8), ((sizeOfSquares)/1.3), ((sizeOfSquares)/1.3));
    }

}

drawcombat = async (phase, entities) => {
    if(phase == "start"){
        clear = (per, colour, callback) => {
            ctx.fillStyle = colour;
            for(let y = 0; y<sps*per; ++y){
                for(let x = 0; x<size/2; ++x){
                    setTimeout( () =>{
                        ctx.fillRect(x*2, (y)*(sizeOfSquares)+(size*(1-per)), 2, (sizeOfSquares+1))
                    }, 1)
                }
            }
            setTimeout( () =>{callback();}, 1)
        }

        clear(1, "#000000", ()=> {
            clear(0.3, "#f2f2f2",()=> {
                ctx.fillStyle = "#0033cc";
                ctx.fillText("Spell[s]", size*0.35, size*0.7+(size*0.3)*0.3)
                ctx.fillText("Mana:", size*0.35, size*0.7+(size*0.3)*0.6)
                ctx.fillText("100/100", size*0.35, size*0.7+(size*0.3)*0.8)
                ctx.fillStyle = "#2aa22a";
                ctx.fillText("Disengage[d]", size*0.65, size*0.7+(size*0.3)*0.3)
                ctx.fillText("EXP:", size*0.65, size*0.7+(size*0.3)*0.6)
                ctx.fillText("0/100", size*0.65, size*0.7+(size*0.3)*0.8)
                ctx.fillStyle = "#cc0000";
                ctx.fillText("Attack[a]", size*0.05, size*0.7+(size*0.3)*0.3)
                ctx.fillText("HP:", size*0.05, size*0.7+(size*0.3)*0.6)
                ctx.fillText("100/100", size*0.05, size*0.7+(size*0.3)*0.8)
                ctx.drawImage(entities["enemy"]["image"], size*0.25, (size*0.7)/(4*1.7), size/2, size/2);
        })

    })
}
}

function update(key) { //keys

    function arrayRemove(arr, value) {

       return arr.filter(function(ele){
           return ele != value;
       });

    }
    if($(".output").html() == "press s to start"){
        $(".output").html("")
    }
    if (combatActive == true) {
        drawcombat("move", "none");
    }
    else {
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
                    console.log(globalpos[0]+playerpos[0], (globalpos[1]+playerpos[1]));
                    drawscreen(movex,movey);
                }
            }
        }
        else{
            if(keysdown.indexOf(key["key"]) != -1){
                keysdown = arrayRemove(keysdown, key["key"]);
            }
        }
    }
};
