var canvas = document.getElementById("screen");
canvas.addEventListener("mousemove", mouseclick);
canvas.addEventListener("mousedown", mouseclick);
var map = {}
var currentType = "grass"
var mouseDown = 0;
window.onmousedown = function() {
  ++mouseDown;
}
window.onmouseup = function() {
  --mouseDown;
}
var ctx = canvas.getContext("2d");
var size = 576
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
    map[x+","+y] = {"type":currentType, "stand":terrain[currentType]["stand"], "special": $('#special').val(), "enemy": "none"}
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
    currentType = type["target"]["innerHTML"]
    ctx.fillStyle = terrain[type["target"]["innerHTML"]]["colour"]
}
ctx.fillStyle = "#33cc33"
for (i=0;i<Object.keys(terrain).length;i++){
    var btn = document.createElement("BUTTON");
    btn.innerHTML = Object.keys(terrain)[i];
    btn.type = "button"
    btn.addEventListener('click', changeColour);
    document.getElementById("butons").appendChild(btn);
}

function download() {
  var element = document.createElement('a');
  var text = "";
  for (i=0;i<Object.keys(map).length;i++){
      coord = Object.keys(map)[i].split(",")
      type = map[Object.keys(map)[i]]["type"]
      stand = map[Object.keys(map)[i]]["stand"]
      special = map[Object.keys(map)[i]]["special"]
      enemy = map[Object.keys(map)[i]]["enemy"]
      var str2 = (coord[0]-$('#posx').val())+"|"+(coord[1]-$('#posy').val())+"|"+type+"|"+stand+"|"+special+"|"+enemy+"\n"
      text = text.concat(str2)

  };

  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', "mapexert");

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
