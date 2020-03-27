var cam_video = false;
var cam_canvas = false;
var cam_ctx = false;
var cam_active = false;
var cam_trying = false;
var cam_stream = false;

function cameraInit(){
    cam_active = false;
    cam_trying = false;
    cam_video = document.getElementById("cam_vid");
    cam_canvas = document.createElement("canvas");
}

function camVideoInit(){
    cam_canvas.width = 640;
    cam_canvas.height = 480;
    cam_ctx = cam_canvas.getContext("2d");
    // Get access to the camera!
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Not adding `{ audio: true }` since we only want video now
        navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
            //video.src = window.URL.createObjectURL(stream);
            cam_video.srcObject = stream;
            cam_stream = stream;
            cam_video.play();
            cam_active = true;
        }).catch(function(err){
            message("There was an error loading the camera.");
            running = false;
        });
    } else {
        message("Could not load camera.");
        running = false;
    }
}

function rgbTo15(r, g, b){
    var r = Math.floor(r * 31 / 255);
    var g = Math.floor(g * 31 / 255);
    var b = Math.floor(b * 31 / 255);
    return r | (g << 5) | (b << 10);
}

function cameraDriver(){
    if (!running && cam_active){
        cam_stream.getTracks().forEach(function(track) {
            track.stop();
        });
        cam_active = false;
        cam_trying = false;
    }

    if (memory[0x800000b0] == 0){ // camera_command == 0
        memory[0x800000b1] = 0; // camera_response == 0
    } else { // camera_command == 1
        if (!cam_trying){
            camVideoInit();
            cam_trying = true;
        }
        if (!cam_active){
            memory[0x800000b1] = 0;
            return;
        }
        var x = memory[0x800000b2];
        var y = memory[0x800000b3];
        var scale = memory[0x800000b4];
        var mirror = memory[0x800000b5];

        var width = 80;
        var height = 60;
        for (var i = 0; i < scale; ++i){
            width *= 2;
            height *= 2;
        }

        cam_canvas.width = width;
        cam_canvas.height = height;
        cam_ctx.drawImage(cam_video, 0, 0, width, height);

        if (x < 640 || y < 480){
            // Draw to the VGA monitor
            ctx.drawImage(cam_canvas, x, y);
        }
        // Put in VGA memory
        var data = cam_ctx.getImageData(0, 0, width, height);
        for (var i = 0; i < data.data.length; i += 4){
            var r = data.data[i];
            var g = data.data[i+1];
            var b = data.data[i+2];
            var x0 = i % width;
            var y0 = Math.floor(i / width);
            x0 += x;
            y0 += y;
            vga_data[x0 + y0*640] = rgbTo15(r, g, b);
        }

        memory[0x800000b1] = 1; // vga_response = 1
    }
}