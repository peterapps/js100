var key_pressed = 0;
var key_ascii = 0;
var key_active = false;
var key_input = false;
var prev_key_down = 0;

function keyboardInit(){
    key_input = document.getElementById("key_input");
    key_input.addEventListener("keydown", keyboardDown, false);
    key_input.addEventListener("keyup", keyboardUp, false);
}

function keyboardDown(event){
    event.preventDefault();
    if (prev_key_down == event.keyCode) return;
    key_active = true;
    key_pressed = 1;
    key_ascii = event.keyCode;
    prev_key_down = event.keyCode;
}

function keyboardUp(event){
    event.preventDefault();
    key_active = true;
    key_pressed = 0;
    key_ascii = event.keyCode;
}

function keyboardDriver(){
    if (!running) return;

    if (memory[0x80000020] == 0){ // ps2_command == 0
        memory[0x80000021] = 0; // ps2_response = 0
        key_active = false;
    } else { // ps2_command == 1
        if (key_active){
            memory[0x80000021] = 1; // ps2_response = 1
            memory[0x80000022] = key_pressed;
            memory[0x80000023] = key_ascii;
        }
    }
}