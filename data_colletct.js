function getMousePos(event) {
    var rect = canvas.getBoundingClientRect();

    var x = (event.clientX - rect.left) / (rect.right - rect.left) * width;
    var y = (event.clientY - rect.top) / (rect.bottom - rect.top) * height;

    x = x.toFixed(0);
    y = y.toFixed(0);

    ctx.arc(x, y, radius, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fillStyle = "rgb(255,255,0)";
    ctx.fill();

    // If there are right coordinate values, draw the line
    if(prex != null && prey != null)
    {
        ctx.beginPath();
        ctx.moveTo(prex,prey);
        ctx.lineTo(x,y);
        ctx.lineWidth = 3;
        // line color
        ctx.strokeStyle = "yellow";
        ctx.stroke();
        ctx.closePath();
    }
    prex= x; prey= y;

    var temp = new Array();

    temp.push(x);
    temp.push(y);

    // input the X,Y value
    coord.push(temp);

    document.getElementById("output1").innerHTML = temp;
    //document.getElementById("output").innerHTML = coord;

}

function dist(x1,y1,x2,y2) {
    x2-=x1; y2-=y1;
    return Math.sqrt((x2*x2) + (y2*y2));
}
