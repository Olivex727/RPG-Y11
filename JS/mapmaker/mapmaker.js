const canvas = document.getElementById("screen");
canvas.addEventListener("mousemove", mouseclick);
canvas.addEventListener("mousedown", mouseclick);
let map = {}
let currentType = "grass"
let mouseDown = 0;
let currentImage = new Image()
window.onmousedown = function() {
  ++mouseDown;
}
window.onmouseup = function() {
  --mouseDown;
}
const ctx = canvas.getContext("2d");
const size = 576
const sps = 50

for(i = 0; i<sps-1;i++){
    ctx.fillStyle = "#000000"
    ctx.fillRect((i)*(size/sps)+(size/sps), 0, 1, size)
    ctx.fillRect(0, (i)*(size/sps)+(size/sps), size, 1)
}
function mouseclick(click) {
    if (mouseDown || click['type']=="mousedown"){
    var x = parseInt(click["layerX"]/(size/sps));
    var y = parseInt(click["layerY"]/(size/sps));
    ctx.drawImage(currentImage, x*(size/sps), y*(size/sps), (size/sps), (size/sps))
    //ctx.fillRect(x*(size/sps)+1, y*(size/sps)+1, (size/sps)-1, (size/sps)-1)
    map[x+","+y] = {"type":currentType, "stand":terrain[currentType]["stand"], "special": $('#special').val(), "enemy": "none"}
    }
}

tileImage = (image) => {
    let img = new Image();
    img.src = "/Images/"+image+".png"
    return img
}
const terrain = {
    "sand": {"colour":"#ffff4d", "stand":"True", "image":tileImage()},
    "grass": {"colour":"#33cc33", "stand":"True", "image":tileImage()},
    "water": {"colour":"#0033cc", "stand":"False", "image":tileImage()},
    "mountain": {"colour":"#666633", "stand":"True", "image":tileImage()},
    "lava": {"colour":"#cc6600", "stand":"False", "image":tileImage()},
    "forest": {"colour":"#336600", "stand":"True", "image":tileImage()},
    "snow": {"colour":"#b3ffff", "stand":"True", "image":tileImage()},
    "houseWall": {"colour":"#00000", "stand":"False", "image":tileImage()},
    "bridge": {"colour":"#000000", "stand":"True", "image":tileImage()},
    "roof1": {"colour":"#000000", "stand":"False", "image":tileImage()},
    "roof2": {"colour":"#000000", "stand":"False", "image":tileImage()},
    "roof3": {"colour":"#000000", "stand":"False", "image":tileImage()},
    "roof4": {"colour":"#000000", "stand":"False", "image":tileImage()},
    "roof5": {"colour":"#000000", "stand":"False", "image":tileImage()},
    "roof6": {"colour":"#000000", "stand":"False", "image":tileImage()},
    "roof7": {"colour":"#000000", "stand":"False", "image":tileImage()},
    "chimney": {"colour":"#000000", "stand":"False", "image":tileImage()},
    "door": {"colour":"#000000", "stand":"False", "image":tileImage()}

};
function changeColour(type){
    currentType = type["target"]["innerHTML"]
    currentImage = tileImage(type["target"]["innerHTML"])
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
