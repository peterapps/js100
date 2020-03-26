var canvas = false;
var ctx = false;
var vga_data = false;

function vgaInit(){
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    vga_data = new Array(640 * 480);
    for (var i = 0; i < 640*480; ++i){
        vga_data[i] = 0;
    }
}

function vgaDriver(){
    if (memory[0x80000060] == 0){ // vga_command == 0
        memory[0x80000061] = 0; // vga_response == 0
    } else { // vga_command == 1
        var vga_x1 = memory[0x80000063];
        var vga_y1 = memory[0x80000064];
        var vga_x2 = memory[0x80000065];
        var vga_y2 = memory[0x80000066];
        if (memory[0x80000062] == 0){ // vga_write == 0
            memory[0x80000068] = vga_data[vga_x1 + vga_y1*640];
        } else { // vga_write == 1
            var color = memory[0x80000067];
            vga_data[vga_x1 + vga_y1*640] = color;
            var r = (color >> 16) & 0xff;
            var g = (color >> 8) & 0xff;
            var b = color & 0xff;
            ctx.fillStyle = "rgb(" + r + ", " + g + ", " + b + ")";
            ctx.fillRect(vga_x1, vga_y1, vga_x2-vga_x1, vga_y2-vga_y1);
        }

        memory[0x80000061] = 1; // vga_response == 1
    }
}