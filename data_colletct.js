window.onload = function(){

    // bring the "canvas" object
    var canvas = document.getElementById("mycanvas");

    // bring the rendering context
    var ctx = canvas.getContext("2d");

    // create image object
    var img = new Image();

    // look up the size the canvas being displayed
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    var coord = new Array();
    var temp_annotations = new Array();

    /* If its resolution does not match, change the size
                if (canvas.width !== width || canvas.height !== height) {
                    canvas.width = width;
                    canvas.height = height;
                    return true;
                }*/


    /* Call the image and draw it on the canvas.
                img.onload = function(){

                    ctx.drawImage(img,0,0);


                }*/

    // source of the image
    img.src = "Images/A_starry_night.jpg";



    var prex = null, prey = null;

    // When click the mouse, create event
    canvas.addEventListener("click", getMousePos, false);

    function getMousePos(event) {
        var rect = canvas.getBoundingClientRect();

        var x = (event.clientX - rect.left) / (rect.right - rect.left) * width;
        var y = (event.clientY - rect.top) / (rect.bottom - rect.top) * height;

        x = x.toFixed(0);
        y = y.toFixed(0);

        ctx.arc(x, y, 5, 0, Math.PI*2, true);
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

    // finsh collecting data
    var fin_btn = document.getElementById("finish");
    fin_btn.addEventListener("click", function() {

        // stop collecting data
        canvas.removeEventListener("click", getMousePos, false);

        var temp_obj = new Object();

        // input the coordinate value of the polygon
        temp_obj.segmentation = coord;

        // input the category name
        var menu = document.getElementById("menu");
        temp_obj.category = menu.options[menu.selectedIndex].text;


        // complete a dictionary about polygon info.(segmentation, category)
        temp_annotations.push(temp_obj);


        // create JSON file and write the coordination value.
        $(document).ready(function(){
            var obj = new Object();
            obj.file_name = "A starry night";
            obj.height = "300";
            obj.width = "454"
            obj.annotations = temp_annotations;


            var obj_s = JSON.stringify(obj, null, "\t");
            var dataUri = "data:application/json;charset=utf-8,"+ encodeURIComponent(obj_s);
            var link = $("#link").attr("href", dataUri);


            $("#json_output").html(obj_s);
        });

    }, false);

    // collect data again
    var rsm_btn = document.getElementById("resume");
    rsm_btn.addEventListener("click", function() {

        // reset value
        prex = null;
        prey = null;
        coord = [];

        // resume collecting data
        canvas.addEventListener("click", getMousePos, false);

    }, false);


    // reset all data
    var rst_btn = document.getElementById("reset");
    rst_btn.addEventListener("click", function() {

        // erase all lines
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // reset value
        prex = null;
        prey = null;
        coord = [];
        temp_annotations = [];

        // restart collecting data
        canvas.addEventListener("click", getMousePos, false);

    }, false);

    // reset all data
    var bck_btn = document.getElementById("back");
    bck_btn.addEventListener("click", function() {

        // remove the last drawn point from the drawing array
        var last_point=coord.pop();

        prex = last_point[0];
        prey = last_point[1];

        console.log(last_point);



    }, false);



}
