// config variables
var globalpos = [0,0]
var map = {};
var size = 512
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
    map[tile[0]+","+tile[1]] = {"type":tile[2], "stand":tile[3], "special": tile[4], "enemy": tile[5]}
};
var canvas = document.getElementById("screen");
var ctx = canvas.getContext("2d");

var scrollnum = 0;
var inventstage = "inventory"

//NOTE: All zero level values mean that the object has not been picked up/crafted

var toolbelt = {
    weapons:[
        {
            "name": "Sword",
            "color": "#000000",
            "damage": [10, 1.2],
            "speed": [2, 0.1],
            "level": 1,
            "image": "False"
        },
        {
            "name": "Bow",
            "color": "#000000",
            "damage": [6, 0.8],
            "speed": [8, 0.2],
            "level": 0,
            "image": "False"
        }
    ],
    tools:[
        {
            "name": "Sickle",
            "color": "#000000",
            "tilebase": "earth",
            "efficiency": [4, 0.4],
            "level": 1,
            "image": "False"
        },
        {
            "name": "Pickaxe",
            "color": "#000000",
            "tilebase": "earth",
            "efficiency": [3, 0.7],
            "level": 0,
            "image": "False"
        }

    ],
    apparel:[
        {
            "name":"Chainmail",
            "color": "#000000",
            "strength": [9, 0.8],
            "level": 0,
            "image": "False"
        },
        {
            "name": "Clothes",
            "color": "#000000",
            "strength": [1, 0.1],
            "level": 1,
            "image": "False"
        }
    ]
};

//Item management
var inventory = [
    {
        "name":"Rock",
        "color": "#666633",
        "amount": 0,
        "image": "False",
        "cost": 100
    },
    {
        "name": "Water",
        "color": "#0033cc",
        "amount": 10,
        "image": "False",
        "cost": 120
    },
    {
        "name": "Wood",
        "color": "#550011",
        "amount": 0,
        "image": "False",
        "cost": 1000
    },
    {
        "name": "Lava",
        "color": "#cc6600",
        "amount": 0,
        "image": "False",
        "cost": 3200
    }
];

var ButtonPresets = {
    "toolbelt":[
        {
            onclick: "updateInvent(0, 'toolbelt_weapons');",
            text: "Weapons"
        },
        {
            onclick: "updateInvent(0, 'toolbelt_tools');",
            text: "Tools"
        },
        {
            onclick: "updateInvent(0, 'toolbelt_apparel');",
            text: "Apparel"
        }
    ],
    "inventory": [
        {
            onclick: "",
            text: "Put in Table"
        },
        {
            onclick: "",
            text: "Craft"
        },
        {
            onclick: "",
            text: "Sell"
        }
    ]
};



window.onload = function() {
    window.addEventListener("keypress", update);
    updateInvent(null);
    drawscreen(0,0)
};

//Update the selections on the inventory
function updateInvent(scroll, change=null)
{

    //Change what tab the inventory is on
    if(change != null){
        inventstage = change;
        scrollnum = 0;
    }

    if (scroll != null) {
        //alert((inventory.length - 3).toString() + " " + scrollnum);
        if ((scrollnum < inventory.length - 3 && scroll > 0) || (scrollnum > 0 && scroll < 0)) {
            scrollnum += scroll;
        }
    }
    var slot1 = document.getElementById("item1"); var slot2 = document.getElementById("item2"); var slot3 = document.getElementById("item3"); var title = document.getElementById("inv");
    var b1 = document.getElementById("command_1"); var b2 = document.getElementById("command_2"); var b3 = document.getElementById("command_3");

    title.textContent = inventstage.toUpperCase();

    b1.textContent = ButtonPresets[inventstage.split("_")[0]][1].onclick

    //Update and output information of items and such (Crafting involved)
    if(inventstage === "inventory") {
        slot1.textContent = inventory[scrollnum].name + ": " + inventory[scrollnum].amount + " units, $" + inventory[scrollnum].cost;
        slot2.textContent = inventory[scrollnum + 1].name + ": " + inventory[scrollnum + 1].amount + " units, $" + inventory[scrollnum +1].cost;
        slot3.textContent = inventory[scrollnum + 2].name + ": " + inventory[scrollnum + 2].amount + " units, $" + inventory[scrollnum +2].cost;
    }
    //Section that contains the apparel, weapons and tools 
    if (inventstage.split("_")[0] === "toolbelt") {
        if(inventstage.split("_")[1] === "weapons")
        {

        }
        if (inventstage.split("_")[1] === "tools") {

        }
        if (inventstage.split("_")[1] === "apparel") {

        }
        slot1.textContent = "";
        slot2.textContent = "";
        slot3.textContent = "";
    }
    if (inventstage === "quests") {
        slot1.textContent = "";
        slot2.textContent = "";
        slot3.textContent = "";
    }
    if (inventstage === "market") {
        slot1.textContent = "";
        slot2.textContent = "";
        slot3.textContent = "";
    }

}

//drawing the screen
var drawscreen = (movex,movey) => {
    var terrain = {
        "grass": {"colour":"#33cc33", "stand":"True", "image":"False", "height":"1"},
        "water": {"colour":"#0033cc", "stand":"False", "image":"False", "height":"3"},
        "mountain": {"colour":"#666633", "stand":"True", "image":"False", "height":"4"},
        "lava": {"colour":"#cc6600", "stand":"False", "image":"False", "height":"5"},
        "forest": {"colour":"#336600", "stand":"True", "image":"False", "height":"2"},
    };
    var entities = {
        "player": {"colour":"#0d0d0d"},
        "goblin": {"colour":"#ff0000"}
    }
    var interest = ["fountain", "dungeon", "monster", "teleport"]
    var draw = (x,y) => {
        // check to see if the tile changes (although redraws if different interest currently)
        if (map[(x+globalpos[0]).toString()+","+(y+globalpos[1]).toString()] != map[(x+globalpos[0]-movex).toString()+","+(y+globalpos[1]-movey).toString()] || movex+movey == 0){
            if(terrain[map[(x+globalpos[0]).toString()+","+(y+globalpos[1]).toString()]['type']]["image"]=="False") {
                ctx.fillStyle = terrain[map[(x+globalpos[0]).toString()+","+(y+globalpos[1]).toString()]['type']]["colour"];
                ctx.fillRect((x)*(size/sps), (y)*(size/sps), (size/sps), (size/sps))
            } else {
                var img = document.getElementById(map[(x+globalpos[0]).toString()+","+(y+globalpos[1]).toString()]['type']);
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

                    if(Math.random() <= 0.6){ // terrain
                        type = "grass"
                        stand = "True"
                        if(Math.random() <= 0.01){ // enemies
                            enemy = "goblin"
                            stand = "False"
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
            console.log(globalpos);
            drawscreen(movex,movey);
        }
    }


};
