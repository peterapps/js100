var ledg = [];
var ledr = [];
var sw = [];
var hex30 = false;
var hex74 = false;

var ledg_state = 0;
var ledr_state = 0;
var sw_state = 0;
var prev_sw_state = 0;
var hex30_state = 0;
var hex74_state = 0;

function basicIOInit(){
    hex30 = document.getElementById("hex30");
    hex74 = document.getElementById("hex74");

    var row = document.getElementById("num_labels");
    for (var i = 17; i >= 0; --i){
        var td = document.createElement("th");
        td.innerHTML = i;
        row.appendChild(td);
    }
    row = document.getElementById("ledg_row");
    for (var i = 17; i >= 8; --i) row.appendChild(document.createElement("td"));
    for (var i = 0; i < 8; ++i) ledg.push(document.createElement("td"));
    for (var i = 7; i >= 0; --i) row.appendChild(ledg[i]);

    row = document.getElementById("ledr_row");
    for (var i = 0; i < 18; ++i) ledr.push(document.createElement("td"));
    for (var i = 17; i >= 0; --i) row.appendChild(ledr[i]);

    row = document.getElementById("sw_row");
    for (var i = 0; i < 18; ++i){
        var td = document.createElement("td");
        var btn = document.createElement("button");
        btn.id = "sw_" + i;
        btn.className = "sw_off";
        btn.addEventListener("click", function(event){
            this.className = (this.className == "sw_off") ? "sw_on" : "sw_off";
            var btn_num = parseInt(this.id.substring(3));
            sw_state ^= 1 << btn_num;
        }, false);
        td.appendChild(btn);
        sw.push(td);
    }
    for (var i = 17; i >= 0; --i) row.appendChild(sw[i]);
}

function basicIODriver(){
    if (sw_state != prev_sw_state){ // SW
        memory[0x80000000] = sw_state;
        prev_sw_state = sw_state;
    }
    if (memory[0x80000001] != ledr_state){ // LED_RED
        ledr_state = memory[0x80000001];
        for (var i = 0; i < 18; ++i){
            var val = (ledr_state >> i) & 1;
            ledr[i].style.backgroundColor = (val == 1) ? "red" : "white";
        }
    }
    if (memory[0x80000002] != ledg_state){ // LED_GREEN
        ledr_state = memory[0x80000002];
        for (var i = 0; i < 8; ++i){
            var val = (ledg_state >> i) & 1;
            ledg[i].style.backgroundColor = (val == 1) ? "green" : "white";
        }
    }
    if (memory[0x80000003] != hex30_state){ // HEX3-HEX0
        hex30_state = memory[0x80000003];
        var str = "0000" + hex30_state.toString(16);
        hex30.innerHTML = str.slice(-4);
    }
    if (memory[0x80000004] != hex74_state){ // HEX7-HEX4
        hex74_state = memory[0x80000004];
        var str = "0000" + hex74_state.toString(16);
        hex74.innerHTML = str.slice(-4);
    }

    // Clock
    memory[0x80000005] += 1;
    if (memory[0x80000005] > 2147483647) memory[0x80000005] = 0;
}