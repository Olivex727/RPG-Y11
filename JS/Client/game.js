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
    map[tile[0]+","+tile[1]] = {"type":tile[2], "stand":tile[3], "special": tile[4], "enemy": tile[5], "har": 0}
};
var canvas = document.getElementById("screen");
var ctx = canvas.getContext("2d");

var scrollnum = 0;
var inventstage = "inventory"

var lastmove = 'w';
var facing;
var distance = 0;
var traveled = 0;

var selected = null;
var crafting = ["", ""];

window.onload = function() {
    window.addEventListener("keypress", update);
    updateInvent(null);
    drawscreen(0,0)
    facing = map["0,0"];
    //alert(map["0,0"]);
};

var slot1 = document.getElementById("item1");
var slot2 = document.getElementById("item2");
var slot3 = document.getElementById("item3");
var title = document.getElementById("inv");

//function test(){return "4";}

//Update the selections on the inventory
function updateInvent(scroll, change = null) {
    console.log("updateInvent: "+inventstage+" -> " + change);
    //Change what tab the inventory is on
    if (change != null) {
        inventstage = change;
        scrollnum = 0;
    }
    
    document.getElementById("money").textContent = "Money: " + money;
    var res = craft(false);
    //var res = test();
    document.getElementById("crafting").textContent = "Crafting Table: [" +crafting[0]+", "+crafting[1]+" ] Result: ["+res+"]";
    var slot1 = document.getElementById("item1"); var slot2 = document.getElementById("item2"); var slot3 = document.getElementById("item3"); var title = document.getElementById("inv");
    title.textContent = inventstage.toUpperCase();
    var b1 = document.getElementById("command_1"); var b2 = document.getElementById("command_2"); var b3 = document.getElementById("command_3");

    b2.textContent = ButtonPresets[inventstage.split("_")[0]][1].text; b3.textContent = ButtonPresets[inventstage.split("_")[0]][2].text; b1.textContent = ButtonPresets[inventstage.split("_")[0]][0].text;

    function upButtons(text){
        for (i = 0; i < 3; i++){
            document.getElementById("sel_"+i).textContent = text;
        }     
    }

    //INVENTORY
    //Update and output information of items and such (Crafting involved)
    if (inventstage.split("_")[0] === "inventory") {
        upButtons("Select");
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
        upButtons("Upgrade");
        //TOOLBELT_WEAPONS
        if (inventstage.split("_")[1] === "weapons") {
            if (scroll != null && (scrollnum < toolbelt.weapons.length - 3 && scroll > 0) || (scrollnum > 0 && scroll < 0)) {
                scrollnum += scroll;
            }
            slot1.textContent = toolbelt.weapons[scrollnum].name + ": Dmg: " + toolbelt.weapons[scrollnum].damage[0] + ", Spd: " + toolbelt.weapons[scrollnum].speed[0] + ", LEVEL: " + toolbelt.weapons[scrollnum].level + ", Cost: " + toolbelt.weapons[scrollnum].cost[0];
            slot2.textContent = toolbelt.weapons[scrollnum + 1].name + ": Dmg: " + toolbelt.weapons[scrollnum + 1].damage[0] + ", Spd: " + toolbelt.weapons[scrollnum + 1].speed[0] + ", LEVEL: " + toolbelt.weapons[scrollnum + 1].level + ", Cost: " + toolbelt.weapons[scrollnum+1].cost[0];
            slot3.textContent = "";//toolbelt.weapons[scrollnum+2].name + ": Dmg: " + toolbelt.weapons[scrollnum+2].damage[0] + ", Spd: " + toolbelt.weapons[scrollnum+2].speed[0] + ", LEVEL: " + toolbelt.weapons[scrollnum+2].level;
        }

        //TOOLBELT_TOOLS
        if (inventstage.split("_")[1] === "tools") {
            if (scroll != null && (scrollnum < toolbelt.tools.length - 3 && scroll > 0) || (scrollnum > 0 && scroll < 0)) {
                scrollnum += scroll;
            }
            slot1.textContent = toolbelt.tools[scrollnum].name + ": Spd: " + toolbelt.tools[scrollnum].efficiency[0] + ", Use: " + toolbelt.tools[scrollnum].tilebase + ", LEVEL: " + toolbelt.tools[scrollnum].level + ", Cost: " + toolbelt.tools[scrollnum].cost[0];
            slot2.textContent = toolbelt.tools[scrollnum + 1].name + ": Spd: " + toolbelt.tools[scrollnum + 1].efficiency[0] + ", Use: " + toolbelt.tools[scrollnum + 1].tilebase + ", LEVEL: " + toolbelt.tools[scrollnum + 1].level + ", Cost: " + toolbelt.tools[scrollnum+1].cost[0];
            slot3.textContent = "";//toolbelt.tools[scrollnum+2].name + ": Spd:" + toolbelt.tools[scrollnum+2].efficiency[0] + ", Use: " + toolbelt.tools[scrollnum+2].tilebase + ", LEVEL: " + toolbelt.tools[scrollnum+2].level;
        }

        //TOOLBELT_APPAREL
        if (inventstage.split("_")[1] === "apparel") {
            if (scroll != null && (scrollnum < toolbelt.apparel.length - 3 && scroll > 0) || (scrollnum > 0 && scroll < 0)) {
                scrollnum += scroll;
            }
            slot1.textContent = toolbelt.apparel[scrollnum].name + ": Str: " + toolbelt.apparel[scrollnum].strength[0] + ", LEVEL: " + toolbelt.apparel[scrollnum].level + ", Cost: " + toolbelt.apparel[scrollnum].cost[0];
            slot2.textContent = toolbelt.apparel[scrollnum + 1].name + ": Str: " + toolbelt.apparel[scrollnum + 1].strength[0] + ", LEVEL: " + toolbelt.apparel[scrollnum + 1].level + ", Cost: " + toolbelt.apparel[scrollnum+1].cost[0];
            slot3.textContent = "";//toolbelt.apparel[scrollnum+2].name + ": Str:" + toolbelt.apparel[scrollnum+2].strength[0] + ", LEVEL: " + toolbelt.apparel[scrollnum+2].level;
        }
    }

    //QUESTS
    if (inventstage.split("_")[0] === "quests") {
        //alert("quest: " + quests[0].name);
        upButtons("Select");
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
        upButtons("Select");
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
        "goblin": {"colour":"#11aa00"},
        "villager": {"colour":"#995500"},
        "salesman": {"colour":"#dddd55"}
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
                        }
                        else if (Math.random() <= 0.011) {
                            enemy = "villager"
                            stand = "False"
                        }
                        else if (Math.random() <= 0.012) {
                            enemy = "salesman"
                            stand = "False"
                        }
                        else {
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


                    map[(x+globalpos[0]).toString()+","+(y+globalpos[1]).toString()] = {"type":type, "stand":stand, "special": special, "enemy": enemy, "har":0, "load":true}
                    draw(x,y)
                }else{
                    console.log(e)
                }
            }
            map[(x + globalpos[0]).toString() + "," + (y + globalpos[1]).toString()]['har'] += -1;
        };
    };
    ctx.fillStyle = entities["player"]["colour"]
    ctx.fillRect(playerpos[0]*(size/sps)+((size/sps)/4), playerpos[1]*(size/sps)+((size/sps)/4), ((size/sps)/2), ((size/sps)/2));
}

var facod = "";

function update(key) { //keys
    var movex = 0;
    var movey = 0;
    var inter = false;

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
    else if (key["code"] == "KeyE" && facod !== "")
    {
        interact();
    }
    //alert(inter);
    
    if (movex+movey != 0){
        infotxt = document.getElementById("info");
        //console.log(map["0,0"])
        //map[globalpos[0], globalpos[1]]['type'].toString();
        if (map[(playerpos[0]+globalpos[0]+movex)+","+(playerpos[1]+globalpos[1]+movey)]['stand'] == "True"){
            
            globalpos = [globalpos[0]+movex, globalpos[1]+movey]
            //console.log(globalpos);

            drawscreen(movex,movey);
            traveled++;
            distance = Math.round(Math.pow( Math.pow(globalpos[0], 2) + Math.pow(globalpos[1], 2), 1/2));
            info3txt = document.getElementById("info2");
            info3txt.textContent = "Distance: " + distance.toString() + ", Travelled: " + traveled.toString();
            
            //alert(map["0,-1"]);
            infotxt.textContent = "Globalpos: [" + (globalpos[0]) + "," + (globalpos[1]).toString() + "], Tile On: " + map[(playerpos[0] + globalpos[0]) + "," + (playerpos[1] + globalpos[1])]['type'].toString();
            
        }
        facing = map[(playerpos[0] + globalpos[0] + movex) + "," + (playerpos[1] + globalpos[1] + movey)];
        facod = (playerpos[0] + globalpos[0] + movex).toString() + "," + (playerpos[1] + globalpos[1] + movey).toString();
        console.log((playerpos[0] + globalpos[0] + movex) , (playerpos[1] + globalpos[1] + movey));
        info2txt = document.getElementById("info1");
        info2txt.textContent = "Lastmove: " + lastmove + ", Facing: " + (facing['type'] + ", " + facing['enemy']).toString();
    }


};

var desc = document.getElementById("desc");

function selectItem(num){
    if (inventstage.split("_")[0] !== "toolbelt") {
        if (num == 0) { selected = slot1.textContent.split(":")[0] }
        if (num == 1) { selected = slot2.textContent.split(":")[0] }
        if (num == 2) { selected = slot3.textContent.split(":")[0] }
        console.log("Selected: " + selected);
    }
    else
    {
        if (num == 0) {selected = slot1.textContent.split(":")[0]}
        if (num == 1) {selected = slot2.textContent.split(":")[0]}
        if (num == 2) {selected = slot3.textContent.split(":")[0]}
        for(itemlist in toolbelt){
            //console.log(itemlist);
            for(i = 0; i < toolbelt[itemlist].length; i++)
            {
                //console.log(item);
                if (selected === toolbelt[itemlist][i].name) {
                    if (money >= toolbelt[itemlist][i].cost[0] && toolbelt[itemlist][i].level > 0) {
                        money -= toolbelt[itemlist][i].cost[0];
                        toolbelt[itemlist][i].cost[0] += toolbelt[itemlist][i].cost[1];
                        if (inventstage.split("_")[1] === "weapons") {
                            console.log(toolbelt[itemlist][i].speed[0]);
                            console.log(toolbelt[itemlist][i].speed[1]);
                            console.log(toolbelt[itemlist][i].speed[0] + toolbelt[itemlist][i].speed[1]);
                            toolbelt[itemlist][i].speed[0] += toolbelt[itemlist][i].speed[1];
                            //Now that's a lota daamage!!
                            toolbelt[itemlist][i].damage[0] += toolbelt[itemlist][i].damage[1];
                        }
                        if (inventstage.split("_")[1] === "tools") {
                            toolbelt[itemlist][i].efficiency[0] += toolbelt[itemlist][i].efficiency[1];
                        }
                        if (inventstage.split("_")[1] === "apparel") {
                            toolbelt[itemlist][i].strength[0] += toolbelt[itemlist][i].strength[1];
                        }
                        toolbelt[itemlist][i].level += 1;
                        updateInvent(null);
                    }
                    else
                    {
                        desc.textContent = "Not enough funds to upgrade "+selected;
                    }
                    console.log("Upgraded: " + selected);
                }
                
            }
        }
    }
}

function interact() {
    //var yeild = Math.random()*Math.pow(distance, 1/2);
    
    for(i = 0; i < inventory.length; i++)
    {
        if (facing['type'] === inventory[i]['tile']) {
            if (map[facod]['har'] <= 0){
                var x = Math.round(Math.random() * (distance + 1));
                inventory[i]['amount'] += x;
                updateInvent(null);
                var y = Math.round(Math.random() * (distance+2));
                map[facod]['har'] = y;
                console.log("Harvested: "+y);
                desc.textContent = "Picked up " + x + " " + inventory[i]['name'];
            }
            else
            {
                desc.textContent = "Sorry, the tile has already been harvested. Come back later. Harvest = " + map[facod]['har'];
            }
        }
    }
    
}

craft(res)
{
    return ("r");
}