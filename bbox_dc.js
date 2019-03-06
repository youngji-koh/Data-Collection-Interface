window.onload = function(){

    // bring the "canvas" object
    var canvas = document.getElementById("mycanvas");

    // bring the rendering context
    var ctx = canvas.getContext("2d");

    // look up the size the canvas being displayed
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // for JSON file
    var coord = new Array();
    var temp_annotations = new Array();


    var canvasOffset;
    var offsetX;
    var offsetY;

    var isDrawing = false;
    var rect;

    var startX;
    var startY;
    var endX;
    var endY;

    canvas.addEventListener("mousedown", handleMouseDown, false);
    canvas.addEventListener("mouseup", handleMouseUp, false);
    canvas.addEventListener("mousemove", handleMouseMove, false);


    function handleMouseUp() {

        isDrawing = false;
        canvas.style.cursor = "default";

        var temp = new Array();
        temp.push(startX);
        temp.push(endY);
        coord.push(temp);

        var temp = new Array();
        temp.push(endX);
        temp.push(endY);
        coord.push(temp);

        var temp = new Array();
        temp.push(endX);
        temp.push(startY);
        coord.push(temp);


        //drawing();

    }

    function handleMouseMove(e) {
        if (isDrawing) {

            rect = canvas.getBoundingClientRect();
            var mouseX = (event.clientX - rect.left) / (rect.right - rect.left) * width;;
            var mouseY = (event.clientY - rect.top) / (rect.bottom - rect.top) * height;

            mouseX = parseInt(mouseX);
            mouseY = parseInt(mouseY);

            ctx.fillStyle = "rgba(255,255,153,0.5)";
            ctx.clearRect(startX, startY, mouseX - startX, mouseY - startY);
            ctx.beginPath();
            ctx.rect(startX, startY, mouseX - startX, mouseY - startY);
            ctx.stroke();
            ctx.fillRect(startX, startY, mouseX - startX, mouseY - startY);

            // When finish drawing, save the coordinate value
            endX = mouseX;
            endY = mouseY;

        }

    }

    function handleMouseDown(e) {

        rsm_btn.disabled = 'disabled';

        canvas.style.cursor = "crosshair";
        isDrawing = true

        rect = canvas.getBoundingClientRect();
        startX = (event.clientX - rect.left) / (rect.right - rect.left) * width;
        startY = (event.clientY - rect.top) / (rect.bottom - rect.top) * height;

        startX = parseInt(startX);
        startY = parseInt(startY);


        var temp = new Array();
        temp.push(startX);
        temp.push(startY);

        coord.push(temp);


    }

    function drawing(){


        var index = 0;

        // erase all lines
        ctx.clearRect(0, 0, width, height);

        // draw
        while(index < coord.length){

            var x,y,w,h;
            x = coord[index][0];
            y = coord[index][1];

            index += 3;
            w = coord[index][0] - x;
            h = coord[index][1] - y;
            index++;

            ctx.fillStyle = "rgba(255,255,153,0.5)";
            ctx.beginPath();
            ctx.rect(x,y,w,h);
            ctx.stroke();
            ctx.fillRect(x,y,w,h);

        }
    }

    // finsh collecting data
    var fin_btn = document.getElementById("finish");
    fin_btn.addEventListener("click", function() {

        // stop collecting data
        canvas.removeEventListener("mousedown", handleMouseDown, false);
        canvas.removeEventListener("mouseup", handleMouseUp, false);
        canvas.removeEventListener("mousemove", handleMouseMove, false);


        document.getElementById("output").innerHTML = coord;
        rsm_btn.disabled = false;
        var temp_obj = new Object();

        // input the coordinate value of the polygon
        temp_obj.segmentation = coord;

        // input the category name
        var menu = document.getElementById("menu");
        temp_obj.category = menu.options[menu.selectedIndex].text;

        // input the category description
        var desc = $("#description").val();
        temp_obj.object_description = desc;

        // complete a dictionary about polygon info.(segmentation, category)
        temp_annotations.push(temp_obj);

    }, false);

    // collect data again
    var rsm_btn = document.getElementById("resume");
    rsm_btn.addEventListener("click", function() {

        // reset value
        coord = [];

        // resume collecting data
        canvas.addEventListener("mousedown", handleMouseDown, false);
        canvas.addEventListener("mouseup", handleMouseUp, false);
        canvas.addEventListener("mousemove", handleMouseMove, false);

    }, false);

    // reset all data
    var rst_btn = document.getElementById("reset");
    rst_btn.addEventListener("click", function() {

        // erase all lines
        ctx.clearRect(0, 0, width, height);

        // reset value
        coord = [];
        temp_annotations = [];

        // restart collecting data
        //canvas.addEventListener("click", getMousePos, false);

    }, false);


    // convert data collection to json file
    var sbm_btn = document.getElementById("submit");
    sbm_btn.addEventListener("click", function() {

        // create JSON file and write the coordination value.
        $(document).ready(function(){
            var obj = new Object();
            obj.file_name = "A_starry_night.jpg";
            obj.title = "A Starry Night";
            obj.id = 1;
            obj.height = "300";
            obj.width = "454";
            obj.artist = "Vincent van Gogh";
            obj.year = 1889;
            obj.medium = "Oil on canvas";
            obj.dimensions = "73.7 cm × 92.1 cm (29 in x 36 1⁄4 in)";
            obj.locations = "Museum of Modern Art, New York City";
            obj.description = "The Starry Night is an oil on canvas by the Dutch post-impressionist painter Vincent van Gogh. Painted in June 1889, it depicts the view from the east-facing window of his asylum room at Saint-Rémy-de-Provence, just before sunrise, with the addition of an idealized village. It has been in the permanent collection of the Museum of Modern Art in New York City since 1941, acquired through the Lillie P. Bliss Bequest. Regarded as among Van Gogh's finest works, The Starry Night is one of the most recognized paintings in the history of Western culture.";

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
