const localPlayer = mp.players.local;

job = '';
isElectrical = 0;

// Y to get employed or start job
mp.keys.bind(0x59, true, function() {
    if(job == ''){//get hired
        //if(distance(player, electricalofficce) <= 10)
        mp.events.callRemote('startJob', 'electrical');
        job = 'electrical';
    }else if(job != ''){
        localPlayer.outputChatBox("You are already epmloyeed");
    }else{
        //no interaction
    }
});

var waitingcall = 0;
// Z to start the job
mp.keys.bind(0x5A, true, function() {
    if(job == 'electrical' && isElectrical == 0 /* && distance(player, electricaloffice) <= 10  */ ){
        //start the work
        isElectrical = 1;
        mp.events.callRemote('start', localPlayer);
    }else {}
});

// K to fix near box
var fix;//global interval
mp.keys.bind(0x4B, true, function() {
    if(calcDistanceBetweenTwoVectors(assignedbox, localPlayer.position) <= 10 && isElectrical == 1 && job == 'electrical' && waitingcall == 0 && !localPlayer.getVehicleIsUsing()) {
        mp.events.callRemote('beginfix');
        waitingcall = 1;
        currentLabel = 'Fixing';
        fixingbox = 1;

        remaining = 7 - i;
        i += 1;
        fix = setInterval(fixtimer, 1000);
        //fixingbox = 0;
        //mp.events.callRemote('fix', localPlayer);
    }
});


var i = 1;
function fixtimer(){
    if(i == 7){
        clearTimeout(fix);
        fixingbox = 0;
        i = 1;
        waitingcall = 0;
        mp.events.callRemote('fix', localPlayer);
        if(marker){marker.destroy();}
        return
    }
    remaining = 7 - i;
    i += 1;
}

var fixingbox = 0;//if fixing to draw on screen
var currentLabel;
var remaining;
mp.events.add('render', () => {
    if(fixingbox != 0){
        mp.game.graphics.drawText(`${currentLabel} (${remaining} seconds)`, [0.5, 0.9], {
            font: 0,
            centre: false,
            color: [9, 255, 0, 255],
            scale: [0.4, 0.4],
            outline: false,
        });
    }
});


var marker;
var assignedbox;
mp.events.add("setWaypoint", (box) => {
    waitingcall = 0;
    mp.game.ui.setNewWaypoint(box[0], box[1]);
    assignedbox = box;
    marker = mp.markers.new(1, box, 3);
});

mp.events.add('quitjob', () => {
    job = '';
    isElectrical = 0;
    if(marker){marker.destroy();}
});

let calcDistanceBetweenTwoVectors = (pos1, pos2) =>  {
    let newPos = new mp.Vector3((pos1[0] - pos2.x), (pos1[1] - pos2.y), (pos1[2] - pos2.z));
    return Math.sqrt((newPos.x * newPos.x) + (newPos.y * newPos.y) + (newPos.z * newPos.z));
};