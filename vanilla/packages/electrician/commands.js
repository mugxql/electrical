let pos = require('./positions.json');

//organises the json into indexed "array"
var index = [];
var nrt = 0;
for (var x in pos) {
   index.push(x);
   nrt++;
}
index.sort(function (a, b) {    
    return a == b ? 0 : (a > b ? 1 : -1); 
});

mp.events.add('playerJoin', (player) => {
    player.setVariable('job', '');
    player.setVariable('isWorking', 0);
});


mp.events.add("startJob", (player, work) => {
    if(player.getVariable('job') == ''){
        player.setVariable('job', work);
        player.setVariable('isWorking', 0);
        player.outputChatBox("You just got hired as an electrician");
    }else{
        player.outputChatBox("You are already employed! Do /quitjob first");
    }
});

mp.events.addCommand('quitjob', (player) => {
    player.setVariable('job', '');
    player.setVariable('isWorking', 0);
    player.call('quitjob');
    player.outputChatBox("You just quit your job");
});

var veh;
mp.events.add('start', (player) =>{
    if(player.getVariable('job') == 'electrical' && player.getVariable('isWorking') == 0){
        player.setVariable('isWorking', 1);
        player.outputChatBox("You started working");
        veh = mp.vehicles.new(mp.joaat("scramjet"), player.position);
        //assign call after 5 seconds
        setTimeout(function(){mp.events.call('call', player);},5000);
    }else{
        player.outputChatBox("You need to be hired as electrician");
    }
});

mp.events.add('call', (player) => {
    if(player.getVariable('isWorking') == 1 && player.getVariable('job') == 'electrical'){
        player.outputChatBox("Incoming Call: \"Hey! My power went out.. can you come out to look into it\"");
        //create waypoint with coordinate:
        assignBox(player);
        player.call('setWaypoint', [currentBox]);
    }
});

mp.events.add('beginfix', (player) => {
    player.playScenario('WORLD_HUMAN_WELDING');
    setTimeout(() => {
        player.stopAnimation();
    }, 6000)
});

mp.events.add('fix', (player) => {
    if(player.getVariable('job') == 'electrical' && player.getVariable('isWorking') == 1){
        player.outputChatBox("Fixed!");
        //give money based on calcDistanceBetweenTwoVectors(worklocation, currentBox);
        setTimeout(function(){mp.events.call('call', player);},5000);
    }
});

var currentBox;
var worklocation;//to calculate the distance of the route
function assignBox(player){
    var boxid = Math.round(Math.random() * nrt);//nrt exclusive
    var box = pos[index[boxid]];
    //serverside calculations:
    worklocation = player.location;
    currentBox = [box.Position.X, box.Position.Y, box.Position.Z];
}

let calcDistanceBetweenTwoVectors = (pos1, pos2) =>  {
    let newPos = new mp.Vector3((pos1.x - pos2.x), (pos1.y - pos2.y), (pos1.z - pos2.z));
    return Math.sqrt((newPos.x * newPos.x) + (newPos.y * newPos.y) + (newPos.z * newPos.z));
};