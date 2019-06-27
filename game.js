console.log("etbry");
//var node = require('node')

var canvas = document.getElementById("screen");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "#FF0000";
var player = ctx.fillRect(700, 350, 20, 20);

var globalx = 0;
var globaly = 0;

var locs = JSON.parse(loclist);
var types = JSON.parse(typelist);
var intops = JSON.parse(interactlist);
update(null)

/*while (true)
{
    $(document).on("keypress", function (e) {
        update(e.keyCode);
    });
}*/

function update(key)
{
    ctx.fillStyle = "#00FF00";
    console.log(key);
    locs.forEach(function(element){
        if (element.x - globalx < 35 && element.x - globalx > -35)
        {
            if (element.y - globaly < 18 && element.y - globaly > -18)
            {
                ctx.fillRect(700 - 20*(globalx - element.x), 350 - 20*(globalx - element.x), 20, 20);
            }
        }
        
    });
}

class loc //The main class that will be translated to the canvas
{  
    constructor(name, x, y, width, height, type, interact = 0)
    {
        this.intset = false;
        this.name = name; this.x = x; this.y = y; //Name of the object, it's co-ordinates on the game's map (in lists)
        this.width = width; this.height = height; //The size of (in blocks) each objbect (in lists)
        this.type = type; //The aesthetic settings of the object - what it looks like
        this.interact = interact; //Can the object be interacted with 0 it's a bckground tile, 1 means it's a barrier tile, 2 is interactible
    }
    setInteract(interactops)
    {
        if(this.interact == 2)
        {
            this.interactops = interactops; //The options of how the class will interact
            this.intset = true;
        }
    }
    
}
class interact //The interaction options of the class
{
    //All of the interaction settings
    constructor(inventadd = [""], inventrem = [""], newx = 0, newy = 0, vis = false, eventcall = "", newtype = "", condition = "") {
        this.inventadd = inventadd;
        this.inventrem = inventrem; //Remove or add item to inventory (List of strings)
        this.newvis = vis; // Will the object change it's visibility if interacted with
        this.newx = newx, newy; //This affects the player's global position
        this.eventcall = eventcall; //This activates the interact function of a seperate location
        this.newtype = newtype; //the new type the object will change to
        this.condition = condition; //Interactible if another object has been interacted with
    }
}
class type //The aesthetics of each object
{
    constructor(sfx, visibility, display_img = false, color = "", img = "")
    {
        this.sfx = sfx; // Sound effect file that will be played on the interact call
        this.vis = visibility; //If the object can be seen or not
        this.disp = display_img; //Wether to display a color or image
        this.color = color; //The color of the object
        this.img = img //The image of the object
    }
}

//This function will interact with any object
function interactobj(obj, src) //obj is the object that will be interacted with, src is who is interacting
{
    //In here is all of the ways you can interact with the object
}
