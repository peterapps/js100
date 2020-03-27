var lcdCanvas = false;
var lcdCtx = false;

function lcdInit(){
    lcdCanvas = document.getElementById("lcd");
    lcdCtx = lcdCanvas.getContext("2d");
    lcdCtx.clearRect(0, 0, lcdCanvas.width, lcdCanvas.height);
    lcdCtx.fillStyle = "white";
    lcdCtx.font = "20px Arial";
    lcdCtx.textBaseline = "middle";
    lcdCtx.textAlign = "center";
}

function lcdDriver(){
    if (memory[0x80000010] == 0){ // lcd_command == 0
        memory[0x80000011] = 0; // lcd_response = 0
    } else { // lcd_command == 1
        var x = memory[0x80000012];
        var y = memory[0x80000013];
        var c = String.fromCharCode(memory[0x80000014]);
        lcdCtx.clearRect(10 + x*20, 10 + y*20, 20, 20);
        lcdCtx.fillText(c, 20 + x*20, 20 + y*20);
        memory[0x80000011] = 1; // lcd_response = 1
    }
}