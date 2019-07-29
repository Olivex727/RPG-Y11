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
    ctx.fillStyle = "#33cc33"
    var x = parseInt(click["layerX"]/(size/sps));
    var y = parseInt(click["layerY"]/(size/sps));
    ctx.fillRect(x*(size/sps)+1, y*(size/sps)+1, (size/sps)-1, (size/sps)-1)
    }
}
