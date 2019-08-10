const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");

    let img2 = $.ajax({
        type: "GET",
        url: "/oldnoise?size2=500",
        async: false
    }).responseJSON
    for(y = 0; y < img2.length; ++y){
        for(x = 0; x < img2[y].length; ++x){
            colour = "rgb("+(img2[y][x]*255).toString()+","+(img2[y][x]*255).toString()+","+(img2[y][x]*255).toString()+")";
            ctx.fillStyle = colour;
            ctx.fillRect( x, y, 1, 1 );
        }
    }
