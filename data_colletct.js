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
    var prex = null, prey = null;
    var radius = 5;


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

    function drawLine(x,y){

        ctx.beginPath();
        ctx.moveTo(prex,prey);
        ctx.lineTo(x,y);
        ctx.lineWidth = 3;
        // line color
        ctx.strokeStyle = "yellow";
        ctx.stroke();
        ctx.closePath();

    }

    function dist(x1,y1,x2,y2) {
        x2-=x1; y2-=y1;
        return Math.sqrt((x2*x2) + (y2*y2));
    }

    // When click the mouse, create event
    canvas.addEventListener("click", getMousePos, false);

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
        ctx.clearRect(0, 0, width, height);

        // reset value
        prex = null;
        prey = null;
        coord = [];
        temp_annotations = [];

        // restart collecting data
        canvas.addEventListener("click", getMousePos, false);

    }, false);

    // back to previous point
    var bck_btn = document.getElementById("back");
    bck_btn.addEventListener("click", function() {

            var newx, newy;
            var temp, length;
            var x1,y1,x2,y2;
            // remove the last drawn point from the drawing array

            var new_point = coord.pop();
            var pre_point = coord.pop();
            coord.push(pre_point);


            if(new_point){
                newx = new_point[0];
                newy = new_point[1];
            }

            if(pre_point){
                prex = pre_point[0];
                prey = pre_point[1];
            }else{

                prex = null;
                prey = null;
            }

            // erase the previous point
            ctx.clearRect(newx - radius, newy - radius, radius*2, radius*2);

            x1 = prex; y1 = prey;
            x2 = newx; y2 = newy;

            if (x2 < x1) {
                tmp = x1; x1 = x2; x2 = tmp;
                tmp = y1; y1 = y2; y2 = tmp;
            }

            length = dist(x1,y1,x2,y2);

            //ctx.translate(x1,y1);
            //ctx.rotate(Math.atan2(y2-y1,x2-x1));
            //ctx.fillRect(0,0,3, length);
            //ctx.fillStyle  = "red";
            // erase the line
            //ctx.clearRect(0,0, 3, length);


            // restart collecting data
            canvas.addEventListener("click", getMousePos, false);


    }, false);


    // convert data collection to json file
    var sbm_btn = document.getElementById("submit");
    sbm_btn.addEventListener("click", function() {

        // create JSON file and write the coordination value.
        $(document).ready(function(){
            var obj = new Object();
            obj.file_name = "A starry night";
            obj.height = "300";
            obj.width = "454"
            obj.annotations = temp_annotations;

            var images = new Array();
            images.push(obj);

            var final_obj = new Object();
            final_obj.images = images;

            // convert object to json
            var obj_s = JSON.stringify(final_obj, null, "\t");
            var dataUri = "data:application/json;charset=utf-8,"+ encodeURIComponent(obj_s);
            var link = $("#link").attr("href", dataUri);

            $("#json_output").html(obj_s);


        });

    }, false);


}