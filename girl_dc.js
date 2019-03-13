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

    // this variable for displaying the segmentation
    var disp_coord = new Array();
    var num_point = new Array();
    var obnum = 0;

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
        disp_coord.push(temp);

        //document.getElementById("output1").innerHTML = temp;
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
        num_point[obnum++] = coord.length;

        // input the category name
        var menu = document.getElementById("menu");

        var object = menu.options[menu.selectedIndex].text;

        // when user wants to choose other categories
        if(object == "other"){
            var other = $("#other").val();
            temp_obj.category = other;
        }
        else{
            temp_obj.category = menu.options[menu.selectedIndex].text;
        }

        // input the category description
        var desc = $("#description").val();
        temp_obj.object_description = desc;

        var color = $("#color").val();
        temp_obj.object_color = color;

        var position = $("#position").val();
        temp_obj.object_position = position;

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
        disp_coord = [];
        temp_annotations = [];

        // restart collecting data
        //canvas.addEventListener("click", getMousePos, false);

    }, false);

    // undo collecting data
    var undo_btn = document.getElementById("undo");
    undo_btn.addEventListener("click", function() {

        //remove the last point
        coord.pop();
        disp_coord.pop();

        var index = 0;
        var temp_obnum = 0;
        var tnp = 0;
        prex = null; prey = null;

        // erase all lines
        ctx.clearRect(0, 0, width, height);

        tnp = num_point[temp_obnum];

        // redraw
        while(index < disp_coord.length){
            var x,y;
            x = disp_coord[index][0];
            y = disp_coord[index][1];

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.fillStyle = "rgb(255,255,0)";
            ctx.fill();

            if(tnp == 0){
                tnp = num_point[++temp_obnum];
            }

            // debugging test
            console.log(num_point[temp_obnum]);

            // If there are right coordinate values, draw the line
            if(prex != null && prey != null)
            {
                //console.log(tnp);
                tnp -= 1;

                ctx.beginPath();

                if(tnp == 0){

                }
                else{
                    ctx.moveTo(prex,prey);
                    ctx.lineTo(x,y);
                }

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
            obj.file_name = "Girl.jpg";
            obj.title = "Girl with a Pearl Earring";
            obj.id = 3;
            obj.height = "527";
            obj.width = "450";
            obj.artist = "Johannes Vermeer";
            obj.year = 1665;
            obj.medium = "Oil on canvas";
            obj.dimensions = "44.5 cm × 39 cm (17.5 in × 15 in)";
            obj.locations = "Mauritshuis, The Hague, Netherlands";
            obj.description = "Girl with a Pearl Earring is an oil painting by Dutch Golden Age painter Johannes Vermeer, dated c. 1665. Going by various names over the centuries, it became known by its present title towards the end of the 20th century after the large pearl earring worn by the girl portrayed there. The work has been in the collection of the Mauritshuis in The Hague since 1902 and has been the subject of various literary treatments. In 2006, the Dutch public selected it as the most beautiful painting in the Netherlands.";

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
