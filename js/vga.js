var canvas = false;
var ctx = false;
var vga_data = false;

function vgaInit(){
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    vga_data = new Array(640 * 960);
    for (var i = 0; i < 640*960; ++i){
        vga_data[i] = 0;
    }
}

function vgaPutRect(x1, y1, x2, y2, color){
    for (var i = x1; i < x2; ++i){
        for (var j = y1; j < y2; ++j){
            vga_data[i + j*640] = color;
        }
    }
    var r = (color >> 16) & 0xff;
    var g = (color >> 8) & 0xff;
    var b = color & 0xff;
    ctx.fillStyle = "rgb(" + r + ", " + g + ", " + b + ")";
    ctx.fillRect(x1, y1, x2-x1, y2-y1);
}

function vgaDriver(){
    if (memory[0x80000060] == 0){ // vga_command == 0
        memory[0x80000061] = 0; // vga_response == 0
    } else { // vga_command == 1
        var x1 = memory[0x80000063];
        var y1 = memory[0x80000064];
        if (memory[0x80000062] == 0){ // vga_write == 0
            memory[0x80000068] = vga_data[x1 + y1*640];
        } else { // vga_write == 1
            var x2 = memory[0x80000065];
            var y2 = memory[0x80000066];
            var color = memory[0x80000067];
            vgaPutRect(x1, y1, x2, y2, color);
        }

        memory[0x80000061] = 1; // vga_response == 1
    }
}