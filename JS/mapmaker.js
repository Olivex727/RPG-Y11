var canvas = document.getElementById("screen");
canvas.addEventListener("mousedown", mouseclick);
canvas.addEventListener("mousemove", mouseclick);

var mouseDown = 0;
canvas.onmousedown = function() {
  ++mouseDown;
}
canvas.onmouseup = function() {
  --mouseDown;
}
var ctx = canvas.getContext("2d");
var size = 704
var sps = 11

for(i = 0; i<sps-1;i++){
    ctx.fillStyle = "#000000"
    ctx.fillRect((i)*(size/sps)+(size/sps), 0, 1, 704)
    ctx.fillRect(0, (i)*(size/sps)+(size/sps), 704, 1)
}
function mouseclick(click) {
    if (mouseDown || click['type']=="mousedown"){
    var x = parseInt(click["layerX"]/(size/sps));
    var y = parseInt(click["layerY"]/(size/sps));
    ctx.fillRect(x*(size/sps)+1, y*(size/sps)+1, (size/sps)-1, (size/sps)-1)
    }
}
var terrain = {
    "grass": {"colour":"#33cc33", "stand":"True"},
    "water": {"colour":"#0033cc", "stand":"False"},
    "mountain": {"colour":"#666633", "stand":"True"},
    "lava": {"colour":"#cc6600", "stand":"False"},
    "forest": {"colour":"#336600", "stand":"True"},
};
function changeColour(type){
    ctx.fillStyle = terrain[type["target"]["innerHTML"]]["colour"]
}

for (i=0;i<Object.keys(terrain).length;i++){
    var btn = document.createElement("BUTTON");
    btn.innerHTML = Object.keys(terrain)[i];
    btn.type = "button"
    btn.addEventListener('click', changeColour);
    document.getElementById("butons").appendChild(btn);
}
