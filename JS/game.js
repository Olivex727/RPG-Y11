//
//REMOVE SECTION WHEN MERGING TO OPENWORLD - TEMPORARILY HERE TO ALLOW USE OF TOOLS IN COMBAT
//
var money = 1000;
var toolbelt = {
    weapons: [{
        "name": "Sword",
        "color": "#000000",
        "damage": [100, 12],
        "speed": [20, 1],
        "level": 1,
        "image": "False",
        "cost": [200, 5]
    },
    {
        "name": "Bow",
        "color": "#000000",
        "damage": [60, 8],
        "speed": [80, 2],
        "level": 0,
        "image": "False",
        "cost": [230, 4]
    }
    ],
    tools: [{
        "name": "Sickle",
        "color": "#000000",
        "tilebase": "grass",
        "efficiency": [40, 4],
        "level": 1,
        "image": "False",
        "cost": [110, 8]
    },
    {
        "name": "Axe",
        "color": "#000000",
        "tilebase": "forest",
        "efficiency": [12, 2],
        "level": 1,
        "image": "False",
        "cost": [80, 10]
    },
    {
        "name": "Pickaxe",
        "color": "#000000",
        "tilebase": "mountain",
        "efficiency": [30, 7],
        "level": 0,
        "image": "False",
        "cost": [290, 2]
    }

    ],
    apparel: [{
        "name": "Chainmail",
        "color": "#000000",
        "strength": [90, 8],
        "level": 0,
        "image": "False",
        "cost": [340, 2]
    },
    {
        "name": "Clothes",
        "color": "#000000",
        "strength": [10, 1],
        "level": 1,
        "image": "False",
        "cost": [20, 1]
    }
    ]
};
var equipped = [{
    "name": "Sword",
    "color": "#000000",
    "damage": [100, 12],
    "speed": [20, 1],
    "level": 1,
    "image": "False",
    "cost": [200, 5]
    },
    {
        "name": "Clothes",
        "color": "#000000",
        "strength": [10, 1],
        "level": 1,
        "image": "False",
        "cost": [20, 1]
    }
];
var distance = 100
//
//
//

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

let combatentity = null;
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
                opponent = map[(x + globalpos[0]).toString() + "," + (y + globalpos[1]).toString()]['enemy'];
                combatActive = true;
                combatentity = entities;
                Stats = {
                    "hp": [100, 100],
                    "dmg": [equipped[0].damage, 1 + Math.round(distance * (0.5 + Math.random()))],
                    "spd": [equipped[0].speed, 1 + Math.round(distance * (0.5 + Math.random()))],
                    "def": [equipped[1].strength, 1 + Math.round(distance * (0.5 + Math.random()))],
                    "heal": [equipped[1].level, 1 + Math.round(distance / (1 + Math.random()))]
                };
                drawcombat("start", "A "+opponent+" has appeared!");
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

drawcombat = async (phase, textque = "") => {
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
                ctx.fillText("Heal[s]", size*0.35, size*0.65+(size*0.3)*0.3)
                ctx.fillText("HP:", size*0.35, size*0.65+(size*0.3)*0.6)
                ctx.fillText(Stats.hp[0]+"/100", size*0.35, size*0.65+(size*0.3)*0.8)
                ctx.fillStyle = "#2aa22a";
                ctx.fillText("Defend[d]", size*0.65, size*0.65+(size*0.3)*0.3)
                ctx.fillText("Difficulty:", size*0.65, size*0.65+(size*0.3)*0.6)
                ctx.fillText(distance, size*0.65, size*0.65+(size*0.3)*0.8) //Distance is the magnitude of dist. from origin (xpos^2+ypos^2)^1/2
                ctx.fillStyle = "#cc0000";
                ctx.fillText("Attack[a]", size*0.02, size*0.65+(size*0.3)*0.3)
                ctx.fillText("Equipped:", size*0.02, size*0.65+(size*0.3)*0.6)
                ctx.fillText(equipped[0].name + "/"+equipped[1].name, size*0.02, size*0.65+(size*0.3)*0.8)
                ctx.drawImage(combatentity["enemy"]["image"], size*0.25, (size*0.7)/(4*1.7), size/2, size/2);
                ctx.fillStyle = "#aaaa00";
                ctx.fillText(textque, size * 0.01, (size * 0.9 + (size * 0.3) * 0.3))
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
        //drawcombat("start", "none");
        //combat
        if (key["type"] == "keydown") {
            if (keysdown.indexOf(key["key"]) == -1) {
                keysdown.push(key["key"])
            }
            if (keysdown.indexOf("a") >= 0) {
                CombatScene("a");
            }
            else if (keysdown.indexOf("s") >= 0) {
                CombatScene("s");
            }
            else if (keysdown.indexOf("d") >= 0) {
                CombatScene("d");
            }
        }

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

let Stats = null;
let opponent = null;

//Negative HP values are ok, if HP < 0 then straight after round, combat ends
function CombatScene(key){
    //Equipping tools in inventory (when merge w openworld) will change these values
    Stats.dmg = [equipped[0].damage, 1 + Math.round(distance * (0.5 + Math.random()))];
    Stats.spd = [equipped[0].speed, 1 + Math.round(distance * (0.5 + Math.random()))];
    Stats.def = [equipped[1].strength, 1 + Math.round(distance * (0.5 + Math.random()))];
    Stats.heal = [equipped[1].level, 1 + Math.round(distance / (1 + Math.random()))];
    let enemymove = Math.random();
    let def = 0;
    
    if (key === "d" && enemymove <= 0.3)
    {
        //drawCombat("none", "You both chose to defend the next attack");
    }
    //The speed of the weapon or if it's defense will determine who goes first
    else if (Stats.spd[0] > Stats.spd[1] || key === "d")
    {
        Playerturn();
        setTimeout(AIturn(), 5000);
        
    }
    else if (Stats.spd[0] < Stats.spd[1] || enemymove <= 0.3)
    {
        AIturn();
        setTimeout(Playerturn(), 5000);
    }
    if (Stats.hp[1] <= 0 && Stats.hp[0] <= 0) { Reset(1); } //If Both die on the same round
    else if (Stats.hp[1] <= 0) { Reset(2); } //If Enemy dies
    else if (Stats.hp[0] <= 0) { Reset(0); } //If Player dies
    
    function Reset(win)
    {
        if(win == 2)
        {
            let rew = 1 + Math.round(distance * (0.5 + Math.random()));
            money += rew;
            //drawCombat("move", "The "+opponent+" lost. You won $"+rew);
        }
        if(win == 1)
        {
            //drawCombat("move", "You Drew");
        }
        if (win == 0) {
            let rew = 1 + Math.round(distance * (0.5 + Math.random()));
            if (money - rew <= 0){ money = 0; }else{ money -= rew; }
            //drawCombat("move", "The "+opponent+" lost. You lost $"+rew);
        }
        opponent = null;
        combatActive = false;
        combatentity = null;
        Stats = null;
        setTimeout(drawscreen(0, 0), 5000)
    }

    function AIturn() //When it is the enemy's turn to play
    {
        if (enemymove <= 0.3)
        {
            def = Math.round(Stats.def[0] * (0.5 + Math.random()));
            //drawCombat("move", "The "+opponent+" chose to defend the your attack");
        }
        else if (enemymove <= 0.7)
        {
            let atk = Math.round(Stats.dmg[0] * (0.5 + Math.random()));
            Stats.hp[0] -= Math.round(atk - atk / def);
            //drawCombat("move", "The "+opponent+" dealt "+atk+" damage");
        }
        else
        {
            let heal = Math.round(Stats.heal[0] * (0.5 + Math.random()));
            if (Stats.hp[1] + heal >= 100) {
                Stats.hp[1] = 100;
            }
            else {
                Stats.hp[1] += heal;
            }
            //drawCombat("move", "The "+opponent+" healed "+heal+" HP");
        }
    }
    function Playerturn() {
        if (key === "d") //Defence is based of strength of apparel
        {
            def = Math.round(Stats.def[0] * (0.5 + Math.random()));
            //drawCombat("move", "You chose to defend the next attack");
        }
        else if (key === "a") //Attacking is based of damage of weapons
        { 
            let atk = Math.round(Stats.dmg[0] * (0.5 + Math.random()));
            Stats.hp[1] -= Math.round(atk - atk/def);
            //drawCombat("move", "You dealt "+atk+" damage");
        }
        else if (key === "s") //Healing is based of level of apparel
        {
            let heal = Math.round(Stats.heal[0] * (0.5 + Math.random()));
            if (Stats.hp[0] + heal >= 100)
            {
                Stats.hp[0] = 100;
            }
            else
            {
                Stats.hp[0] += heal;
            }
            //drawCombat("move", "You healed "+heal+" HP");
        }
    }
}