//======CONFIG VARIABLES======//
//Map Generation and Design
var globalpos = [0,0]
var map = {};
var size = 512;
let genmap;
var sps = 15;
var playerpos = [(sps-1)/2, (sps-1)/2]
map[(sps-1)/2+","+(sps-1)/2] = {"type":"grass", "stand":"True", "special": "none", "enemy": "none", "har": 0, "quest": false}

//const save = 1;

//Compiling information on maps
var maptext = $.ajax({
    type: "GET",
    url: "/map",
    async: false
}).responseText.split("\n");

//Get save info from save file
var saves = $.ajax({
    type: "GET",
    url: "/save",
    async: false
}).responseText.split("\n");

for (i = 0; i < maptext.length; i++){
    var tile = maptext[i].split("|")
    map[tile[0]+","+tile[1]] = {"type":tile[2], "stand":tile[3], "special": tile[4], "enemy": tile[5], "har": parseInt(tile[6]), "quest": (tile[7] =="true")}
};


toolbelt = {weapons:[],tools:[],apparel:[]}; inventory = []; quests = [];
for (i = 0; i < saves.length; i++){
    //console.log(saves[i]);
    if(i == 0){ globalpos[0] = parseInt(saves[i]);}
    else if (i == 1) { globalpos[1] = parseInt(saves[i]); }
    else if (i == 2) { money = parseInt(saves[i]);}
    else if (i == 3) { debt = parseInt(saves[i]);}
    else {
        var line = saves[i].split("|")
        if(line[0] === "weapon"){
            for(x=2; x < 9; x++){line[x]=parseInt(line[x]);}
            toolbelt.weapons.push({"name": line[1], "damage": [line[2], line[3]], "speed": [line[4], line[5]], "level": line[6], "cost": [line[7], line[8]]});
        }
        if(line[0] === "tool"){
            for(x=3; x < 8; x++){line[x]=parseInt(line[x]);}
            toolbelt.tools.push({"name": line[1], "tilebase": line[2], "efficiency": [line[3], line[4]], "level": line[5], "cost": [line[6], line[7]]});
        }
        if(line[0] === "apparel"){
            for(x=6; x < 7; x++){line[x]=parseInt(line[x]);}
            toolbelt.apparel.push({"name": line[1], "strength": [line[2], line[3]], "level": line[4], "cost": [line[5], line[6]]});
        }
        if(line[0] === "item"){
            for(x=2; x < 5; x++){line[x]=parseInt(line[x]);}
            inventory.push({"name": line[1], "amount": line[2], "cost": line[3], "stock": line[4], "tile":line[5]});
        }
        if(line[0] === "quest"){
            for(x=3; x < 5; x++){line[x]=parseInt(line[x]);}
            quests.push({name: line[1], desc: line[2], reward: line[3], req: [line[4],line[5]], completed: (line[6]=="true"), npc:line[7], banked: (line[8]=="true")});
        }
    }
};

//Canvas Drawing
const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");

//Movement
let keysdown = []

//Inventory Management Variables
var scrollnum = 0;
var inventstage = "inventory"
var selected = null;
var crafting = ["", ""];
var facod = ""; //FACing what Object in what Direction

//Interactability and general values
var facing;
var lastmove = 'w';
var distance = 0;
var traveled = 0;

//Combat Variables (equipped is default)
let combatActive = false; //Used in combat branch, will be used for inventory only
var equipped = [{ name: "" }, { name: "" }];

//======MAIN FUNCTIONS======//

//WINDOW.ONLOAD -- First Loading of window
window.onload = function() {
    window.addEventListener("keydown", update);
    window.addEventListener("keyup", update);
    genmap = $.ajax({
        type: "GET",
        url: "/snoise?size=1000",
        async: false
    }).responseJSON
    $(".output").html("press s to start");
    updateInvent(null);
    console.log(globalpos[0].toString() + globalpos[1].toString());
    drawscreen(0,0);//globalpos[0], globalpos[1])
    facing = map["0,0"];
    //alert(map["0,0"]);
};

var slot1 = document.getElementById("item1");
var slot2 = document.getElementById("item2");
var slot3 = document.getElementById("item3");
var title = document.getElementById("inv");

//UPDATEINVENT -- Update the selections on the inventory
function updateInvent(scroll, change = null, printToConsole = true, keepSelectedItem = false) {
    if (printToConsole){console.log("updateInvent: " + inventstage + " -> " + change);}
    if (!keepSelectedItem){selected = ""; }//desc.textContent = "";}
    //Change what tab the inventory is on
    if (change != null) {
        inventstage = change;
        scrollnum = 0;
    }

    document.getElementById("money").textContent = "Money: " + money + ", Debt: " + debt;
    if (debt == 0) { document.getElementById("money").textContent += ", You can loan money now"; }
    else { document.getElementById("money").textContent += ", You Have a debt to pay"; }
    var res = craft(false);
    //var res = test();
    document.getElementById("crafting").textContent = "Equipped: [ "+equipped[0].name+", "+equipped[1].name+" ], Selected: [ "+selected+" ] Crafting Table: [ " +crafting[0]+", "+crafting[1]+" ] Result: ["+res+"]";
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
        if (!combatActive) {
            upButtons("Upgrade");
        }
        //TOOLBELT_WEAPONS
        if (inventstage.split("_")[1] === "weapons") {
            if (combatActive) {
                upButtons("Equip");
            }
            if (scroll != null && (scrollnum < toolbelt.weapons.length - 3 && scroll > 0) || (scrollnum > 0 && scroll < 0)) {
                scrollnum += scroll;
            }
            slot1.textContent = toolbelt.weapons[scrollnum].name + ": Dmg: " + toolbelt.weapons[scrollnum].damage[0] + ", Spd: " + toolbelt.weapons[scrollnum].speed[0] + ", LEVEL: " + toolbelt.weapons[scrollnum].level + ", Cost: " + toolbelt.weapons[scrollnum].cost[0];
            slot2.textContent = toolbelt.weapons[scrollnum + 1].name + ": Dmg: " + toolbelt.weapons[scrollnum + 1].damage[0] + ", Spd: " + toolbelt.weapons[scrollnum + 1].speed[0] + ", LEVEL: " + toolbelt.weapons[scrollnum + 1].level + ", Cost: " + toolbelt.weapons[scrollnum+1].cost[0];
            slot3.textContent = toolbelt.weapons[scrollnum + 2].name + ": Dmg: " + toolbelt.weapons[scrollnum + 2].damage[0] + ", Spd: " + toolbelt.weapons[scrollnum + 2].speed[0] + ", LEVEL: " + toolbelt.weapons[scrollnum + 2].level + ", Cost: " + toolbelt.weapons[scrollnum + 2].cost[0];
        }

        //TOOLBELT_TOOLS
        if (inventstage.split("_")[1] === "tools") {
            if (combatActive) {
                upButtons("Upgrade");
            }
            if (scroll != null && (scrollnum < toolbelt.tools.length - 3 && scroll > 0) || (scrollnum > 0 && scroll < 0)) {
                scrollnum += scroll;
            }
            slot1.textContent = toolbelt.tools[scrollnum].name + ": Spd: " + toolbelt.tools[scrollnum].efficiency[0] + ", Use: " + toolbelt.tools[scrollnum].tilebase + ", LEVEL: " + toolbelt.tools[scrollnum].level + ", Cost: " + toolbelt.tools[scrollnum].cost[0];
            slot2.textContent = toolbelt.tools[scrollnum + 1].name + ": Spd: " + toolbelt.tools[scrollnum + 1].efficiency[0] + ", Use: " + toolbelt.tools[scrollnum + 1].tilebase + ", LEVEL: " + toolbelt.tools[scrollnum + 1].level + ", Cost: " + toolbelt.tools[scrollnum+1].cost[0];
            slot3.textContent = toolbelt.tools[scrollnum+2].name + ": Spd: " + toolbelt.tools[scrollnum+2].efficiency[0] + ", Use: " + toolbelt.tools[scrollnum+2].tilebase + ", LEVEL: " + toolbelt.tools[scrollnum+2].level + ", Cost: " + toolbelt.tools[scrollnum+2].cost[0];
        }

        //TOOLBELT_APPAREL
        if (inventstage.split("_")[1] === "apparel") {
            if (combatActive) {
                upButtons("Equip");
            }
            if (scroll != null && (scrollnum < toolbelt.apparel.length - 3 && scroll > 0) || (scrollnum > 0 && scroll < 0)) {
                scrollnum += scroll;
            }
            slot1.textContent = toolbelt.apparel[scrollnum].name + ": Str: " + toolbelt.apparel[scrollnum].strength[0] + ", LEVEL: " + toolbelt.apparel[scrollnum].level + ", Cost: " + toolbelt.apparel[scrollnum].cost[0];
            slot2.textContent = toolbelt.apparel[scrollnum + 1].name + ": Str: " + toolbelt.apparel[scrollnum + 1].strength[0] + ", LEVEL: " + toolbelt.apparel[scrollnum + 1].level + ", Cost: " + toolbelt.apparel[scrollnum+1].cost[0];
            slot3.textContent = toolbelt.apparel[scrollnum+2].name + ": Str: " + toolbelt.apparel[scrollnum+2].strength[0] + ", LEVEL: " + toolbelt.apparel[scrollnum+2].level + ", Cost: " + toolbelt.apparel[scrollnum+2].cost[0];
        }
    }

    //QUESTS
    if (inventstage.split("_")[0] === "quests") {
        //alert("quest: " + quests[0].name);
        upButtons("Select");
        if (scroll != null && (scrollnum < quests.length - 3 && scroll > 0) || (scrollnum > 0 && scroll < 0)) {
            scrollnum += scroll;
        }
        if (quests[scrollnum] != null /*&& !quests[scrollnum].completed*/) {
            slot1.textContent = quests[scrollnum].name + ":\n " + quests[scrollnum].desc + ". req: " + quests[scrollnum].req[0] +" "+ quests[scrollnum].req[1] + "(s), reward: " + quests[scrollnum].reward + ", DONE: " + quests[scrollnum].completed;
        } else {slot1.textContent = "";}
        if (quests[scrollnum + 1] != null /*&& !quests[scrollnum].completed*/ ) {
            slot2.textContent = quests[scrollnum+1].name + ":\n " + quests[scrollnum+1].desc + ". req: " + quests[scrollnum+1].req[0] + " " + quests[scrollnum+1].req[1] + "(s), reward: " + quests[scrollnum+1].reward + ", DONE: " + quests[scrollnum+1].completed;
        } else {slot2.textContent = "";}
        if (quests[scrollnum + 2] != null /*&& !quests[scrollnum].completed*/) {
            slot3.textContent = quests[scrollnum + 2].name + ":\n " + quests[scrollnum + 2].desc + ". req: " + quests[scrollnum + 2].req[0] + " " + quests[scrollnum + 2].req[1] + "(s), reward: " + quests[scrollnum + 2].reward + ", DONE: " + quests[scrollnum + 2].completed;
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

//COMPRESS -- Pressing the specialised buttons, runs sevreal other functions
function ComPress(scroll, button, change=null){

    if (inventstage.split("_")[0] === "inventory"){
        if (button == 1) { crafting[1] = crafting[0]; crafting[0]=selected; updateInvent(null); }
        if (button == 2) { craft(true); updateInvent(null); }
        if (button == 3) { Transaction(true, 5); }
    }
    if (inventstage.split("_")[0] === "quests") {
        if (button == 1) { questManage('rem'); }
        if (button == 2) { questManage('comp'); }
        if (button == 3) { questManage('pri'); }
    }
    if (inventstage.split("_")[0] === "toolbelt") {
        if (button == 1) { updateInvent(0, 'toolbelt_weapons'); }
        if (button == 2) { updateInvent(0, 'toolbelt_tools'); }
        if (button == 3) { updateInvent(0, 'toolbelt_apparel'); }
    }
    if (inventstage.split("_")[0] === "market") {
        if (button == 1) { Transaction(false, 1); }
        if (button == 2) { Transaction(false, 10); }
        if (button == 3) { if(debt == 0){ Loan(false, 10000); } else { Loan(true, 0) } }
    }
}

let entity = null;

//DRAWSCREEN -- Drawing the Screen
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
        "player": {"colour":"#0d0d0d", "image":tileImage("player"), "hostile":false },
        "enemy": { "colour": "#ff0000", "image": tileImage("enemy"), "hostile": true, "type":["goblin", "witch"] },
        "npc": { "colour": "#ff0000", "image": tileImage("npc"), "hostile": false, "type":["villager", "farmer"] }
    }
    entity = entities;
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
        if (map[(x + globalpos[0]).toString() + "," + (y + globalpos[1]).toString()]['enemy'] != "none") {
            if (entities["enemy"]["type"].includes(map[(x + globalpos[0]).toString() + "," + (y + globalpos[1]).toString()]['enemy'])){
                ctx.drawImage(entities["enemy"]["image"], x * (size / sps) + ((size / sps) / 8), y * (size / sps) + ((size / sps) / 8), (size / sps) / 1.3, (size / sps) / 1.3);
                if ((x == playerpos[0] || y == playerpos[1])) {
                    console.log("battle start");
                }
            }
            if (entities["npc"]["type"].includes(map[(x + globalpos[0]).toString() + "," + (y + globalpos[1]).toString()]['enemy'])) {
                ctx.drawImage(entities["npc"]["image"], x * (size / sps) + ((size / sps) / 8), y * (size / sps) + ((size / sps) / 8), (size / sps) / 1.3, (size / sps) / 1.3);
            }
        }
    };

    for (y = 0; y < sps; y++){
        for (x = 0; x < sps; x++){ // draw map
            try {
                draw(x,y)
            } catch (e) { // if the tile dosent exist yet
                if (e instanceof TypeError ){
                
                    // chances of different tiles
                    pos = genmap[(x+globalpos[0]+500)][(y+globalpos[1]+500)]
                    let stand = "True";
                    let enemy = "none";
                    if((pos <= 0.375 && pos >= 0.28)||(pos <= 0.56 && pos >= 0.49)){ // terrain
                        type = "grass"
                        let x = Math.random();
                        if(x <= 0.01){ // enemies
                            enemy = entities["enemy"]["type"][Math.round((entities["enemy"]["type"].length - 1) * Math.random())];

                            stand = "False"
                        }
                        else if (x <= 0.02) { // npcs
                            enemy = entities["npc"]["type"][Math.round((entities["npc"]["type"].length - 1) * Math.random())];
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


                    map[(x+globalpos[0]).toString()+","+(y+globalpos[1]).toString()] = {"type":type, "stand":stand, "special": special, "enemy": enemy, "har": 0}
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

//UPDATE -- Updates the screen with the KeyPress info
function update(key) { //keys

    function arrayRemove(arr, value) {

       return arr.filter(function(ele){
           return ele != value;
       });

    }

    if($(".output").html() == "press s to start"){
        $(".output").html("")
    }

    let movex = 0;
    let movey = 0;
    var inter = false;
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
        if (keysdown.indexOf("e")>= 0){
            try{interact();}catch{}
        }
        if (movex != 0 || movey != 0){
            infotxt = document.getElementById("info");
            if (map[(playerpos[0]+globalpos[0]+movex)+","+(playerpos[1]+globalpos[1]+movey)]['stand'] == "True"){
                globalpos = [globalpos[0]+movex, globalpos[1]+movey]
                console.log(globalpos[0]+playerpos[0], (globalpos[1]+playerpos[1]));
                drawscreen(movex,movey);
                ++traveled;
                debt = Math.round(debt*1.006);
                MarketLoop();
                updateInvent(null, null, false, true);
                //console.log(debt * 1.6);
                distance = Math.round(Math.pow( Math.pow(globalpos[0], 2) + Math.pow(globalpos[1], 2), 1/2));
                info3txt = document.getElementById("info2");
                info3txt.textContent = "Distance: " + distance.toString() + ", Travelled: " + traveled.toString();

                //alert(map["0,-1"]);
                infotxt.textContent = "Globalpos: [" + (globalpos[0]).toString() + "," + (globalpos[1]).toString() + "], Playerpos: [" + (playerpos[0]).toString() + "," + (playerpos[1]).toString() + "], Tile On: " + map[(playerpos[0] + globalpos[0]) + "," + (playerpos[1] + globalpos[1])]['type'].toString();

            }
            facing = map[(playerpos[0] + globalpos[0] + movex) + "," + (playerpos[1] + globalpos[1] + movey)];
            facod = (playerpos[0] + globalpos[0] + movex).toString() + "," + (playerpos[1] + globalpos[1] + movey).toString();
            console.log((playerpos[0] + globalpos[0] + movex) , (playerpos[1] + globalpos[1] + movey));
            info2txt = document.getElementById("info1");
            info2txt.textContent = "Lastmove: " + lastmove + ", Facing: " + (facing['type'] + ", " + facing['enemy']).toString();
        }
    }else{
        if(keysdown.indexOf(key["key"]) != -1){
            keysdown = arrayRemove(keysdown, key["key"]);
        }
    }
};

var desc = document.getElementById("desc");

function selectItem(num){
    if (inventstage.split("_")[0] !== "toolbelt") {
        if (num == 0) { selected = slot1.textContent.split(":")[0] }
        if (num == 1) { selected = slot2.textContent.split(":")[0] }
        if (num == 2) { selected = slot3.textContent.split(":")[0] }
        console.log("Selected: " + selected);
        updateInvent(null, null, true, true);
    }
    else if (!combatActive)
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
                        console.log("Upgraded: " + selected);
                        equipped = [{ name: "" }, { name: "" }];
                        updateInvent(null, null, true, true);
                    }
                    else
                    {
                        desc.textContent = "Not enough funds to upgrade "+selected;
                    }
                }

            }
        }
    }
    else
    {
        if (num == 0) {selected = slot1.textContent.split(":")[0]} if (num == 1) {selected = slot2.textContent.split(":")[0]} if (num == 2) {selected = slot3.textContent.split(":")[0]}
        for (itemlist in toolbelt) {

            for (i = 0; i < toolbelt[itemlist].length; i++) {
                
                if (selected === toolbelt[itemlist][i].name) {
                    
                    if (inventstage.split("_")[1] === "weapons") {equipped[0] = toolbelt[itemlist][i];}
                    if (inventstage.split("_")[1] === "apparel") {equipped[1] = toolbelt[itemlist][i];}
                    console.log("Equipped: " + selected);
                    updateInvent(null, null, true, true);
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

    if (entity["npc"]["type"].includes(map[facod]['enemy']))
    {
        if (!map[facod]['quest'])
        {
            console.log("Facing NPC: " + facing['enemy']);
            desc.textContent = "You've received a new quest from the " + map[facod]['enemy'];
            for(i in questbank)
            {
                if (map[facod]['enemy'] === questbank[i].npc && !map[facod]['quest'])
                {
                    let alreadyexists = false;
                    for(q in quests)
                    {
                        if (quests[q].name === questbank[i].name)
                        {
                            alreadyexists = true;
                        }
                    }
                    if(!alreadyexists)
                    {
                        let x = quests.unshift(questbank[i]) - 1;
                        quests[x].banked = true;
                        map[facod]['quest'] = true;
                        updateInvent(null);
                    }
                }
            }
            if (!map[facod]['quest']) //If there are no more quests in the questbank
            {
                let newquest = {
                    name: "Help out the " + map[facod]['enemy'],
                    desc: "See the requirements",
                    reward: Math.round(distance * Math.random()),
                    req: [Math.round(distance * Math.random()), inventory[Math.round(Math.random() * (inventory.length - 1))].name],
                    completed: false,
                    npc: map[facod]['enemy'],
                    banked: true
                }
                let x = quests.push(newquest) - 1;
                map[facod]['quest'] = true;
                updateInvent(null);
            }
        }
        else
        {
            desc.textContent = "You can't get another quest from this person";
        }
        
    }
    else
    {
    //Check each item in inventory
    for(i in inventory)
    {
        //console.log(i + " " + inventory[i].name);
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
                    //console.log("LOL: " + i + " " + inventory[i].name);
                    //Add items to inventory
                    var x = Math.round(Math.random() * (distance + 1));
                    inventory[i].amount += x;

                    var y = Math.round(Math.random() * (distance + 2));
                    map[facod]['har'] = y;
                    console.log("Harvested: " + y + " " + inventory[i].name);
                    desc.textContent = "Picked up " + x + " " + inventory[i].name;
                    updateInvent(null);
                } else {
                    desc.textContent = "Missing the requred tool to harvest " + map[facod]['type'];
                }
            }
            else
            {
                desc.textContent = "Sorry, the tile has already been harvested. Come back later. Harvest = " + map[facod]['har'];
            }
        }
    }
    }
    console.log("interacted");
}

function craft(req){
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

function displayEditorInfo()
{
    var info = document.getElementById("editor");
    if (info.hidden) { info.hidden = false; }
    else if (!info.hidden) { info.hidden = true; }
}

function Transaction(sell, amount)
{
    for(i in inventory)
    {
        if (inventory[i].name === selected)
        {
            if (sell && inventory[i].amount >= amount) //Sell Items
            {
                inventory[i].amount -= amount;
                inventory[i].stock += amount;
                money += inventory[i].cost * amount
                updateInvent(null);
            }
            if (!sell && inventory[i].stock >= amount && money >= inventory[i].cost * amount) //Buy items
            {
                inventory[i].amount += amount;
                inventory[i].stock -= amount;
                money -= inventory[i].cost * amount
                updateInvent(null);
            }   
        }
    }
    
}

function Loan(pay, amount)
{
    if(!pay){ debt += amount; money += amount; }
    if (pay && money >= debt) { money -= debt; debt = 0; }
    updateInvent(null);
}

function MarketLoop()
{
    for(i in inventory)
    {
        if (inventory[i].cost > 10 && inventory[i].cost < 100000)
        {
            //let x = ;
            let y = Math.random() ;//(Math.random()/2) / ( 1 + 1/( Math.pow( Math.E, x ))); //Sigmoid function
            //console.log(y);
            if(y >= 0.5){
                inventory[i].cost = Math.round(inventory[i].cost * (1 + 1 / ((inventory[i].stock + 1) * 7)));
                //console.log(inventory[i].name + ", " + (1 + 1 / ((inventory[i].stock + 1) * 10)));
            }
            else{
                inventory[i].cost = Math.round(inventory[i].cost * (1 - 1 / ((inventory[i].stock + 1) * 7)));
                //console.log(inventory[i].name + ", " + (1 - 1 / ((inventory[i].stock + 1) * 10)));
            }
        }
        else if (inventory[i].cost > 10)
        {
            inventory[i].cost = 100000;
        }
        else
        {
            inventory[i].cost = 10;
        }
        
    }
}

function questManage(preset)
{
    var done = false;
    for(i in quests)
    {
        
        if (quests[i].name === selected && !done){
            if(preset === "rem")
            {
                quests[i].banked = false;
                quests = array_move(quests, i, quests.length - 1);
                quests.splice(quests.length - 1, 1);
                done = true;
            }
            if (preset === "pri") {
                quests = array_move(quests, i, 0);
                done = true;
            }
            if (preset === "comp") {
                for(item in inventory){
                    if (quests[i].req[1] === inventory[item].name && inventory[item].amount >= quests[i].req[0]) {
                        selected = "";
                        inventory[item].amount -= quests[i].req[0];
                        quests[i].completed = true;
                        money = quests[i].reward;
                        desc.textContent = "You completed the quest and got: $" + quests[i].reward;
                        //console.log(quests[i]);
                        quests = array_move(quests, i, quests.length - 1); //Doesn't work
                        //console.log(quests[quests.length - 1]);
                        //console.log(quests[i]);
                        done = true;
                    }
                }
            }
        }
    }
    updateInvent(null);
    
}

//Credit to user 'Reid' on Stack Overflow
function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
};