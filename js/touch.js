var touch_x = 0;
var touch_y = 0;
var touch_pressed = false;

var mouse_button1 = false;
var mouse_button2 = false;
var mouse_button3 = false;
var prev_mouse_x = 320;
var prev_mouse_y = 240;
var mouse_up = false;

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
    touch_x = Math.floor(x * 2);
    touch_y = Math.floor(y * 2);
}

function touchMouseDown(event){
    event.preventDefault();
    touch_pressed = true;
    getCursorPosition(event);

    switch (event.button){
        case 1:
            mouse_button1 = true;
            break;
        case 2:
            mouse_button2 = true;
            break;
        case 3:
            mouse_button3 = true;
            break;
    }
}

function touchMouseUp(event){
    event.preventDefault();
    touch_pressed = false;
    mouse_up = true;

    switch (event.button){
        case 1:
            mouse_button1 = false;
            break;
        case 2:
            mouse_button2 = false;
            break;
        case 3:
            mouse_button3 = false;
            break;
    }
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

    if (memory[0x80000070] == 0){ // mouse_command == 0
        memory[0x80000071] = 0; // mouse_response = 0
    } else {
        if (touch_pressed || touch_x != prev_mouse_x || touch_y != prev_mouse_y || mouse_up){
            var dx = touch_x - prev_mouse_x;
            var dy = touch_y - prev_mouse_y;
            prev_mouse_x = touch_x;
            prev_mouse_y = touch_y;
            memory[0x80000071] = 1;
            memory[0x80000072] = dx;
            memory[0x80000073] = dy;
            memory[0x80000074] = mouse_button1;
            memory[0x80000075] = mouse_button2;
            memory[0x80000076] = mouse_button3;
            mouse_up = false;
        } else {
            memory[0x80000071] = 0;
        }
    }
}