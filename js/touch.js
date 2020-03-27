var touch_x = 0;
var touch_y = 0;
var touch_pressed = false;

function touchInit(){
    canvas = document.getElementById("canvas");
    canvas.addEventListener("mousedown", touchMouseDown, false);
    canvas.addEventListener("mousemove", getCursorPosition, false);
    canvas.addEventListener("mouseup", touchMouseUp, false);
}

function getCursorPosition(event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    touch_x = x * 2;
    touch_y = y * 2;
}

function touchMouseDown(event){
    event.preventDefault();
    touch_pressed = true;
    getCursorPosition(event);
}

function touchMouseUp(event){
    event.preventDefault();
    touch_pressed = false;
}

function touchDriver(){
    if (!running) return;

    if (memory[0x800000e0] == 0){ // touch_command == 0
        memory[0x800000e1] = 0; // touch_response = 0
    } else { // touch_command == 1
        if (touch_pressed){
            memory[0x800000e1] = 1; // touch_response = 1
            memory[0x800000e2] = touch_x;
            memory[0x800000e3] = touch_y;
            memory[0x800000e4] = 1;
        } else {
            memory[0x800000e1] = 0; // only respond on a touch
            memory[0x800000e4] = 0;
        }
    }
}