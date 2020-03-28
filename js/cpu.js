var iar = 0;
var running = false;

function handleRun(){
    if (running){
        running = false;
        return;
    }
    message("Running.");
    iar = 0;
    running = true;
    document.getElementById("run_btn").value = "Stop";
    vgaInit();
    serialSendInit();
    sdramInit();
    audioReset();
    lcdInit();
    cameraInit();
    requestAnimationFrame(cpuCycle);
}

function cpuCycle(){
    for (var i = 0; i < 2500; ++i){
        executeOp();
        basicIODriver();
        vgaDriver();
        sdramDriver();
        serialSendDriver();
        touchDriver();
        sdcardDriver();
        audioDriver();
        keyboardDriver();
        serialReceiveDriver();
        lcdDriver();
        cameraDriver();
        micDriver();
        if (!running) break;
    }
    if (audioBuffer.length > 0){
        audioPlay();
        audioReset();
    }

    if (running) requestAnimationFrame(cpuCycle);
    else {
        document.getElementById("run_btn").value = "Run";
        message("Halted.");
    }
}

function executeOp(){
    var op = memory[iar++];
    var arg1 = memory[iar++];
    var arg2 = memory[iar++];
    var arg3 = memory[iar++];

    switch (op){
        case 0: // halt
            running = false;
            iar -= 4;
            break;
        case 1: // add
            memory[arg1] = memory[arg2] + memory[arg3];
            break;
        case 2: // sub
            memory[arg1] = memory[arg2] - memory[arg3];
            break;
        case 3: // mult
            memory[arg1] = memory[arg2] * memory[arg3];
            break;
        case 4: // div
            memory[arg1] = memory[arg2] / memory[arg3];
            memory[arg1] |= 0;
            break;
        case 5: // cp
            memory[arg1] = memory[arg2];
            break;
        case 6: // and
            memory[arg1] = memory[arg2] & memory[arg3];
            break;
        case 7: // or
            memory[arg1] = memory[arg2] | memory[arg3];
            break;
        case 8: // not
            memory[arg1] = ~memory[arg2];
            break;
        case 9: // sl
            memory[arg1] = memory[arg2] << memory[arg3];
            break;
        case 10: // sr
            memory[arg1] = memory[arg2] >> memory[arg3];
            break;
        case 11: // cpfa
            memory[arg1] = memory[arg2 + memory[arg3]];
            break;
        case 12: // cpta
            memory[arg2 + memory[arg3]] = memory[arg1];
            break;
        case 13: // be
            if (memory[arg2] == memory[arg3]){
                iar = arg1;
            }
            break;
        case 14: // bne
            if (memory[arg2] != memory[arg3]){
                iar = arg1;
            }
            break;
        case 15: // blt
            if (memory[arg2] < memory[arg3]){
                iar = arg1;
            }
            break;
        case 16: // call
            memory[arg2] = iar;
            iar = arg1;
            break;
        case 17: // ret
            iar = memory[arg1];
            break;
        default:
            message("Invalid opcode " + op);
            running = false;
            break;
    }
    
}