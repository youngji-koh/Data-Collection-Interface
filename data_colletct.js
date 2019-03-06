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

        rsm_btn.disabled = 'disabled';

        var rect = canvas.getBoundingClientRect();

        var x = (event.clientX - rect.left) / (rect.right - rect.left) * width;
        var y = (event.clientY - rect.top) / (rect.bottom - rect.top) * height;

        x = x.toFixed(0);
        y = y.toFixed(0);

        x = parseInt(x);
        y = parseInt(y);

        ctx.beginPath();
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


    // When click the mouse, create event
    canvas.addEventListener("click", getMousePos, false);

    // finsh collecting data
    var fin_btn = document.getElementById("finish");
    fin_btn.addEventListener("click", function() {

        // stop collecting data
        canvas.removeEventListener("click", getMousePos, false);
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
        //canvas.addEventListener("click", getMousePos, false);

    }, false);

    // undo collecting data
    var undo_btn = document.getElementById("undo");
    undo_btn.addEventListener("click", function() {

            //remove the last point
            coord.pop();

            var index = 0;
            prex = null; prey = null;

            // erase all lines
            ctx.clearRect(0, 0, width, height);

            // redraw
            while(index < coord.length){
                var x,y;
                x = coord[index][0];
                y = coord[index][1];

                ctx.beginPath();
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
                index++;
            }
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
