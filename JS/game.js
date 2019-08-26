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
var crafting = ["Wood", "Wood"];

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
    selected="";
    //Change what tab the inventory is on
    if (change != null) {
        inventstage = change;
        scrollnum = 0;
    }

    document.getElementById("money").textContent = "Money: " + money;
    var res = craft(false);
    //var res = test();
    document.getElementById("crafting").textContent = "Crafting Table: [" +crafting[0]+", "+crafting[1]+"] Result: ["+res+"]";
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
        if (button == 1) { crafting[1] = crafting[0]; crafting[0]=selected; updateInvent(null); }
        if (button == 2) { craft(true); updateInvent(null); }
        if (button == 3) { /*Sell Item*/ }
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
const drawscreen = (movex,movey) => {
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
                ctx.fillRect((x)*(size/sps), (y)*(size/sps), (size/sps), (size/sps))
            } else {
                ctx.drawImage(terrain[map[(x+globalpos[0]).toString()+","+(y+globalpos[1]).toString()]['type']]["image"], (x)*(size/sps), (y)*(size/sps), (size/sps), (size/sps));
            }

        }
        if (map[(x+globalpos[0]).toString()+","+(y+globalpos[1]).toString()]['enemy'] != "none") {
            ctx.drawImage(entities["enemy"]["image"], x*(size/sps)+((size/sps)/8), y*(size/sps)+((size/sps)/8), (size/sps)/1.3, (size/sps)/1.3);
            if(x == playerpos[0] || y == playerpos[1]){
                console.log("battle start")
            }
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
        ctx.drawImage(entities["player"]["image"], playerpos[0]*(size/sps)+((size/sps)/8), playerpos[1]*(size/sps)+((size/sps)/8), ((size/sps)/1.3), ((size/sps)/1.3));
    }

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
                            //console.log(toolbelt[itemlist][i].speed[0]);
                            //console.log(toolbelt[itemlist][i].speed[1]);
                            //console.log(toolbelt[itemlist][i].speed[0] + toolbelt[itemlist][i].speed[1]);
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
    console.log("Facing: "+facing['type']);
    console.log("Map: " + map[facod]['type']);
    var minecheck = false;

    //Check each item in inventory
    for(i in inventory)
    {
        console.log(i + " " + inventory[i].name);
        // If the names of the tile and inventory items match up
        if (facing['type'] === inventory[i].tile) {

            //Check if the object can be harvested
            if (map[facod]['har'] <= 0){
                minecheck = false;

                //Check if the toolbelt contains the correct tool so that the item can be harvested
                for (item in toolbelt.tools) {

                    if (toolbelt.tools[item].tilebase === map[facod]['type']) {

                        if (toolbelt.tools[item].level > 0) {
                            minecheck = true;

                        }
                    }
                }


                //If the correct tool is in use
                if (minecheck) {
                    console.log("LOL: " + i + " " + inventory[i].name);
                    //Add items to inventory
                    var x = Math.round(Math.random() * (distance + 1));
                    inventory[i].amount += x;

                    var y = Math.round(Math.random() * (distance + 2));
                    map[facod]['har'] = y;
                    console.log("Harvested: " + y + inventory[i].name);
                    desc.textContent = "Picked up " + x + " " + inventory[i].name;
                    updateInvent(null);
                } else {
                    desc.textContent = "Missing the requred tool to mine " + map[facod]['type'];
                }
            }
            else
            {
                desc.textContent = "Sorry, the tile has already been harvested. Come back later. Harvest = " + map[facod]['har'];
            }
        }
    }
    console.log("interacted");
}

function craft(req)
{
    //console.log("START");
    for(res in CraftingRecipes)
    {
        //console.log(CraftingRecipes[res][0][0] + CraftingRecipes[res][0][1]);
        //console.log(crafting[0] + crafting[1]);
        if (
            (CraftingRecipes[res][0][0] === crafting[0]) &&
            (CraftingRecipes[res][0][1] === crafting[1])
        )
        {
            //console.log("SUC: " + crafting[0] + crafting[1] + CraftingRecipes[res][1][0]);

            if(!req){return (CraftingRecipes[res][1][0]);}
            else
            {
                var craftCheck = [false, false, false];
                var indexStore = [-1, -1]
                for (item in inventory)
                {
                    if (inventory[item].name === CraftingRecipes[res][0][0]) {
                        if (inventory[item].amount > CraftingRecipes[res][2][0])
                        {
                            inventory[item].amount -= CraftingRecipes[res][2][0];
                            craftCheck[0] = true;
                            indexStore[0] = item;
                        }
                    }
                    if (inventory[item].name === CraftingRecipes[res][0][1])
                    {
                        if (inventory[item].amount > CraftingRecipes[res][2][1])
                        {
                            inventory[item].amount -= CraftingRecipes[res][2][1];
                            craftCheck[1] = true;
                            indexStore[1] = item;
                        }
                    }
                }

                if (money > CraftingRecipes[res][2][2])
                {
                    money -= CraftingRecipes[res][2][2];
                    craftCheck[2] = true;
                }

                for (item in inventory) {
                    if (inventory[item].name === CraftingRecipes[res][1][0] && craftCheck[0] && craftCheck[1] && craftCheck[2]) {
                        inventory[item].amount += 1;
                        desc.textContent = "Crafted " + CraftingRecipes[res][1][0];
                    }
                }

                if (!craftCheck[0] || !craftCheck[1] || !craftCheck[2])
                {
                    desc.textContent = "Failed to Craft " + CraftingRecipes[res][1][0];
                    if (craftCheck[0]) {inventory[indexStore[0]].amount += CraftingRecipes[res][2][0];}
                    if (craftCheck[1]) {inventory[indexStore[0]].amount += CraftingRecipes[res][2][1];}
                    if (craftCheck[2]) {money += CraftingRecipes[res][2][2];}
                }
            }
        }
    }
    return ("");
}
