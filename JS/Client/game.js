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

var lastmove = 'w';
var facing;
var distance = 0;

window.onload = function() {
    window.addEventListener("keypress", update);
    updateInvent(null);
    drawscreen(0,0)
    facing = map["0,0"];
    //alert(map["0,0"]);
};

//Update the selections on the inventory
function updateInvent(scroll, change = null) {
    console.log("updateInvent: "+inventstage+" -> " + change);
    //Change what tab the inventory is on
    if (change != null) {
        inventstage = change;
        scrollnum = 0;
    }
    
    
    var slot1 = document.getElementById("item1"); var slot2 = document.getElementById("item2"); var slot3 = document.getElementById("item3"); var title = document.getElementById("inv");
    title.textContent = inventstage.toUpperCase();
    var b1 = document.getElementById("command_1"); var b2 = document.getElementById("command_2"); var b3 = document.getElementById("command_3");

    b2.textContent = ButtonPresets[inventstage.split("_")[0]][1].text; b3.textContent = ButtonPresets[inventstage.split("_")[0]][2].text; b1.textContent = ButtonPresets[inventstage.split("_")[0]][0].text;

    //INVENTORY
    //Update and output information of items and such (Crafting involved)
    if (inventstage.split("_")[0] === "inventory") {
        if (scroll != null && (scrollnum < inventory.length - 3 && scroll > 0) || (scrollnum > 0 && scroll < 0)) {
            scrollnum += scroll;
        }
        slot1.textContent = inventory[scrollnum].name + ": " + inventory[scrollnum].amount + " units, $" + inventory[scrollnum].cost;
        slot2.textContent = inventory[scrollnum + 1].name + ": " + inventory[scrollnum + 1].amount + " units, $" + inventory[scrollnum + 1].cost;
        slot3.textContent = inventory[scrollnum + 2].name + ": " + inventory[scrollnum + 2].amount + " units, $" + inventory[scrollnum + 2].cost;
    }

    //TOOLBELT
    //Section that contains the apparel, weapons and tools 
    if (inventstage.split("_")[0] === "toolbelt") {

        //TOOLBELT_WEAPONS
        if (inventstage.split("_")[1] === "weapons") {
            if (scroll != null && (scrollnum < toolbelt.weapons.length - 3 && scroll > 0) || (scrollnum > 0 && scroll < 0)) {
                scrollnum += scroll;
            }
            slot1.textContent = toolbelt.weapons[scrollnum].name + ": Dmg: " + toolbelt.weapons[scrollnum].damage[0] + ", Spd: " + toolbelt.weapons[scrollnum].speed[0] + ", LEVEL: " + toolbelt.weapons[scrollnum].level;
            slot2.textContent = toolbelt.weapons[scrollnum+1].name + ": Dmg: " + toolbelt.weapons[scrollnum+1].damage[0] + ", Spd: " + toolbelt.weapons[scrollnum+1].speed[0] + ", LEVEL: " + toolbelt.weapons[scrollnum+1].level;
            slot3.textContent = "";//toolbelt.weapons[scrollnum+2].name + ": Dmg: " + toolbelt.weapons[scrollnum+2].damage[0] + ", Spd: " + toolbelt.weapons[scrollnum+2].speed[0] + ", LEVEL: " + toolbelt.weapons[scrollnum+2].level;
        }

        //TOOLBELT_TOOLS
        if (inventstage.split("_")[1] === "tools") {
            if (scroll != null && (scrollnum < toolbelt.tools.length - 3 && scroll > 0) || (scrollnum > 0 && scroll < 0)) {
                scrollnum += scroll;
            }
            slot1.textContent = toolbelt.tools[scrollnum].name + ": Spd: " + toolbelt.tools[scrollnum].efficiency[0] + ", Use: " + toolbelt.tools[scrollnum].tilebase + ", LEVEL: " + toolbelt.tools[scrollnum].level;
            slot2.textContent = toolbelt.tools[scrollnum + 1].name + ": Spd: " + toolbelt.tools[scrollnum + 1].efficiency[0] + ", Use: " + toolbelt.tools[scrollnum + 1].tilebase + ", LEVEL: " + toolbelt.tools[scrollnum + 1].level;
            slot3.textContent = "";//toolbelt.tools[scrollnum+2].name + ": Spd:" + toolbelt.tools[scrollnum+2].efficiency[0] + ", Use: " + toolbelt.tools[scrollnum+2].tilebase + ", LEVEL: " + toolbelt.tools[scrollnum+2].level;
        }

        //TOOLBELT_APPAREL
        if (inventstage.split("_")[1] === "apparel") {
            if (scroll != null && (scrollnum < toolbelt.apparel.length - 3 && scroll > 0) || (scrollnum > 0 && scroll < 0)) {
                scrollnum += scroll;
            }
            slot1.textContent = toolbelt.apparel[scrollnum].name + ": Str: " + toolbelt.apparel[scrollnum].strength[0] + ", LEVEL: " + toolbelt.apparel[scrollnum].level;
            slot2.textContent = toolbelt.apparel[scrollnum + 1].name + ": Str: " + toolbelt.apparel[scrollnum + 1].strength[0] + ", LEVEL: " + toolbelt.apparel[scrollnum + 1].level;
            slot3.textContent = "";//toolbelt.apparel[scrollnum+2].name + ": Str:" + toolbelt.apparel[scrollnum+2].strength[0] + ", LEVEL: " + toolbelt.apparel[scrollnum+2].level;
        }
    }

    //QUESTS
    if (inventstage.split("_")[0] === "quests") {
        //alert("quest: " + quests[0].name);
        if (scroll != null && (scrollnum < quests.length - 3 && scroll > 0) || (scrollnum > 0 && scroll < 0)) {
            scrollnum += scroll;
        }
        if (quests[scrollnum] != null) {
            slot1.textContent = quests[scrollnum].name + ":\n " + quests[scrollnum].desc + ". req: " + quests[scrollnum].req[0] +" "+ quests[scrollnum].req[1] + ", reward: " + quests[scrollnum].reward + ", DONE: " + quests[scrollnum].completed;
        } else {slot1.textContent = "";}
        if (quests[scrollnum + 1] != null) {
            slot2.textContent = quests[scrollnum+1].name;
        } else {slot2.textContent = "";}
        if (quests[scrollnum+2] != null){
            slot3.textContent = quests[scrollnum+2].name;
        } else {slot3.textContent = "";}
    }

    //MARKET
    if (inventstage.split("_")[0] === "market") {
        if (scroll != null && (scrollnum < inventory.length - 3 && scroll > 0) || (scrollnum > 0 && scroll < 0)) {
            scrollnum += scroll;
        }
        slot1.textContent = inventory[scrollnum].name + ": " + inventory[scrollnum].stock + " units, $" + inventory[scrollnum].cost;
        slot2.textContent = inventory[scrollnum + 1].name + ": " + inventory[scrollnum + 1].stock + " units, $" + inventory[scrollnum + 1].cost;
        slot3.textContent = inventory[scrollnum + 2].name + ": " + inventory[scrollnum + 2].stock + " units, $" + inventory[scrollnum + 2].cost;
    }

}

function ComPress(scroll, button, change=null){

    if (inventstage.split("_")[0] === "inventory"){
        
    }
    if (inventstage.split("_")[0] === "quests") {
        
    }
    if (inventstage.split("_")[0] === "toolbelt") {
        if (button == 1) { updateInvent(0, 'toolbelt_weapons'); }
        if (button == 2) { updateInvent(0, 'toolbelt_tools'); }
        if (button == 3) { updateInvent(0, 'toolbelt_apparel'); }
    }
    if (inventstage.split("_")[0] === "inventory") {

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
        lastmove = "w";

    }
    else if (key["code"] == "KeyA"){
        movex = -1;
        lastmove = "a";
    }
    else if (key["code"] == "KeyS"){
        movey = 1;
        lastmove = "s";
    }
    else if (key["code"] == "KeyD"){
        movex = 1;
        lastmove = "d";
    }
    else if (key["code"] == "KeyE")
    {
        interact();
    }
    
    if (movex+movey != 0){
        infotxt = document.getElementById("info");
        facing = map[(playerpos[0] + globalpos[0] + movex) + "," + (playerpos[1] + globalpos[1] + movey)];
        //console.log(map["0,0"])
        //map[globalpos[0], globalpos[1]]['type'].toString();
        if (map[(playerpos[0]+globalpos[0]+movex)+","+(playerpos[1]+globalpos[1]+movey)]['stand'] == "True"){
            
            globalpos = [globalpos[0]+movex, globalpos[1]+movey]
            //console.log(globalpos);

            drawscreen(movex,movey);
            distance++;
            info3txt = document.getElementById("info2");
            info3txt.textContent = "Distance: " + distance.toString();
            
            //alert(map["0,-1"]);
            infotxt.textContent = "Globalpos: [" + globalpos.toString() + "], Tile On: " + map[(playerpos[0] + globalpos[0]) + "," + (playerpos[1] + globalpos[1])]['type'].toString();
            
        }
        info2txt = document.getElementById("info1");
        info2txt.textContent = "Lastmove: " + lastmove + ", Facing: " + (facing['type'] + ", " + facing['enemy']).toString();
    }


};

function interact() {
    //facing['type']
}