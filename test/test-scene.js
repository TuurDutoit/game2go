var sceneMainEntrance = {
    name: "Scene 1",
    Backgrounds: [
        {
            height: 420, width: 840, positionX: 0, positionY: 0,
            Draw: function(d) {
                d.drawImage(document.getElementById("background-scene1"), 0, 0);
            }
        }
    ],
    SpawnPoints: {standard: {x: 36*2,y: 36*2}, rightDoorUp: {x: 36*9, y: 36*7}, rightDoorDown: {x: 36*9, y: 36*1}},
	Objects: [new ObjectTest(), new ObjectTestNoOffset(), new ObjectFireBall({x:50, y:300, speed:1.5, angle:0, size:32}), new ObjectFireBall({x:90, y:300, speed:1, angle:0, size:32}), new ObjectWarpTile({x: 0, y: 36*2, height: 36 * 3, width: 36, spawnPoint: "standard", spawnWorld: "ChrisHoulihan"}), new ObjectWarpTile({x: 36*11, y: 36*2, height: 36 * 3, width: 36, spawnPoint: "leftDoorDown", spawnWorld: "TestSceneB"}), new ObjectWarpTile({x: 36*11, y: 36*7, height: 36 * 3, width: 36, spawnPoint: "leftDoorUp", spawnWorld: "TestSceneB"})],
    Foregrounds: [],
    Terrain: [
        [ "Bricks", "Bricks", "Empty", "Empty", "Empty", "Bricks", "Bricks" , "Bricks", "Bricks", "Bricks", "Bricks", "Bricks"],
        [ "Bricks", "Bricks", "Empty", "Empty", "Empty", "Empty","Empty","Bricks", "Empty", "Empty", "Empty", "Bricks"],
        [ "Bricks", "Bricks", "Empty", "Empty", "Empty", "Empty","Empty","Bricks", "Empty", "Empty", "Empty", "Bricks"],
        [ "Bricks", "Bricks", "Empty", "Empty", "Empty", "Empty","Empty","Empty", "Empty", "Empty", "Empty", "Bricks"],
        [ "Bricks", "Bricks", "Empty", "Empty", "Empty", "Empty","Empty","Empty", "Empty", "Empty", "Empty", "Bricks"],
        [ "Bricks", "Bricks", "Empty", "Empty", "Empty", "Empty","Bricks","Empty", "Empty", "Empty", "Empty", "Bricks"],
        [ "Bricks", "Bricks", "Empty", "Empty", "Empty", "Empty","Empty","Empty", "Empty", "Empty", "Empty", "Bricks"],
        [ "Bricks", "Bricks", "Empty", "Empty", "Empty", "Empty","Empty","Empty", "Empty", "Empty", "Empty", "Bricks"],
        [ "Bricks", "Bricks", "Empty", "Empty", "Empty", "Empty","Empty","Empty", "Empty", "Empty", "Empty", "Bricks"],
        [ "Bricks", "Bricks", "Empty", "Empty", "Empty", "Bricks","Empty","Empty", "Empty", "Empty", "Empty", "Bricks"],
        [ "Bricks", "Bricks", "Empty", "Empty", "Empty", "Bricks","Bricks","Empty", "Empty", "Empty", "Empty", "Bricks"],
        [ "Bricks", "Bricks", "Empty", "Empty", "Empty", "Bricks","Bricks","Empty", "Empty", "Empty", "Bricks", "Bricks"]
    ]
}
var testSceneB = {
    name: "Scene 2",
    Backgrounds: [
        {
            height: 420, width: 840, positionX: 0, positionY: 0,
            Draw: function(d) {
                d.drawImage(document.getElementById("spritesheet"), 0, 0);
            }
        }
    ],
    SpawnPoints: {standard: {x: 36,y: 36 * 29}, leftDoorDown: {x: 36,y: 36 * 24}, leftDoorUp: {x: 36,y: 36 * 29}},
	Objects: [new ObjectWarpTile({x: 0, y: 36*24, height: 36 * 3, width: 30, spawnPoint: "rightDoorDown", spawnWorld: "MainEntrance"}), new ObjectWarpTile({x: 0, y: 36*29, height: 36 * 3, width: 30, spawnPoint: "rightDoorUp", spawnWorld: "MainEntrance"})],
    Foregrounds: [],
    Terrain: [
        [ "Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks", "Empty", "Empty", "Empty", "Bricks", "Bricks" , "Empty", "Empty", "Empty", "Bricks", "Bricks", "Bricks", "Bricks"],
        [ "Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks", "Empty", "Empty", "Empty", "Bricks","Bricks","Empty", "Empty", "Empty", "Bricks", "Bricks", "Bricks", "Bricks"],
        [ "Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks", "Empty", "Empty", "Empty", "Bricks","Bricks","Empty", "Empty", "Empty", "Bricks", "Bricks", "Bricks", "Bricks"],
        [ "Bricks", "Bricks","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty", "Empty", "Empty", "Empty", "Bricks","Bricks","Empty", "Empty", "Empty", "Bricks", "Bricks", "Bricks", "Bricks"],
        [ "Bricks", "Bricks","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty", "Empty", "Empty", "Empty", "Bricks","Bricks","Empty", "Empty", "Empty", "Bricks", "Bricks", "Bricks", "Bricks"],
        [ "Bricks", "Bricks","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty", "Empty", "Empty", "Empty", "Bricks","Bricks","Empty", "Empty", "Empty", "Bricks", "Bricks", "Bricks", "Bricks"],
        [ "Bricks", "Bricks","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty", "Empty", "Empty", "Empty", "Bricks","Bricks","Empty", "Empty", "Empty", "Bricks", "Bricks", "Bricks", "Bricks"],
        [ "Bricks", "Bricks","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty", "Empty", "Empty", "Empty", "Bricks","Bricks","Empty", "Empty", "Empty", "Bricks", "Bricks", "Bricks", "Bricks"],
        [ "Bricks", "Bricks","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty","Empty", "Empty", "Empty", "Empty", "Empty", "Bricks","Bricks","Empty", "Empty", "Empty", "Bricks", "Bricks", "Bricks", "Bricks"],
        [ "Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks", "Bricks", "Bricks", "Bricks", "Bricks","Bricks","Empty", "Empty", "Empty", "Bricks", "Bricks", "Bricks", "Bricks"],
        [ "Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks", "Bricks", "Bricks", "Bricks", "Bricks","Bricks","Empty", "Empty", "Empty", "Bricks", "Bricks", "Bricks", "Bricks"],
        [ "Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks", "Bricks", "Bricks", "Bricks", "Bricks","Bricks","Empty", "Empty", "Empty", "Bricks", "Bricks", "Bricks", "Bricks"],
        [ "Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks", "Bricks", "Bricks", "Bricks", "Bricks","Bricks","Empty", "Empty", "Empty", "Bricks", "Bricks", "Bricks", "Bricks"],
        [ "Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks", "Bricks", "Bricks", "Bricks", "Bricks","Bricks","Empty", "Empty", "Empty", "Bricks", "Bricks", "Bricks", "Bricks"],
        [ "Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks", "Bricks", "Bricks", "Bricks", "Bricks","Bricks","Empty", "Empty", "Empty", "Bricks", "Bricks", "Bricks", "Bricks"],
        [ "Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks", "Bricks", "Bricks", "Bricks", "Bricks","Empty","Empty", "Empty", "Empty", "Empty", "Bricks", "Bricks", "Bricks"],
        [ "Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks", "Bricks", "Bricks", "Bricks", "Empty","Empty","Empty", "Empty", "Empty", "Empty", "Empty", "Bricks", "Bricks"],
        [ "Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks", "Bricks", "Bricks", "Bricks", "Empty","Empty","Empty", "Bricks", "Empty", "Empty", "Empty", "Bricks", "Bricks"],
        [ "Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks", "Bricks", "Bricks", "Bricks", "Empty","Empty","Empty", "Bricks", "Empty", "Empty", "Empty", "Bricks", "Bricks"],
        [ "Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks", "Bricks", "Bricks", "Bricks", "Empty","Empty","Empty", "Bricks", "Empty", "Empty", "Empty", "Bricks", "Bricks"],
        [ "Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks","Bricks", "Bricks", "Bricks", "Bricks", "Bricks", "Empty","Empty","Empty", "Bricks", "Empty", "Empty", "Empty", "Bricks", "Bricks"]
    ]
}
var sceneChrisHoulihan = {
// Used for errorhandling, if there's a problem while loading a scene, you will end up here.
// The name is a reference to Chris Houlihans secret room in Legend Of Zelda: A Link to the Past.
    name: "Scene Chris Houlihan",
    Backgrounds: [
        {
            height: 420, width: 840, positionX: 0, positionY: 0,
            Draw: function(d) {
                //d.drawImage(document.getElementById("spritesheet"), 0, 0);
            }
        }
    ],
    SpawnPoints: {standard: {x: 36,y: 36*2}},
	Objects: [],
    Foregrounds: [],
    Terrain: [
        [ "Bricks",  "Bricks", "Bricks", "Bricks" , "Bricks",  "Bricks", "Bricks", "Bricks", "Bricks",  "Bricks", "Bricks", "Bricks"],
        [ "Bricks",  "Empty", "Empty","Empty","Empty","Empty","Empty","Empty","Empty","Empty","Empty","Bricks"],
        [ "Bricks", "Empty", "Empty","Empty","Empty","Empty","Empty","Empty","Empty","Empty","Empty" ,"Bricks"],
        [ "Bricks", "Empty", "Empty","Empty","Empty","Empty","Empty","Empty","Empty","Empty","Empty" ,"Bricks"],
        [ "Bricks", "Empty", "Empty","Empty","Empty","Empty","Empty","Empty","Empty","Empty","Empty" ,"Bricks"],
        [ "Bricks", "Empty", "Empty","Empty","Empty","Empty","Empty","Empty","Empty","Empty","Empty" ,"Bricks"],
        [ "Bricks", "Empty", "Empty","Empty","Empty","Empty","Empty","Empty","Empty","Empty","Empty" ,"Bricks"],
        [ "Bricks", "Empty", "Empty","Empty","Empty","Empty","Empty","Empty","Empty","Empty","Empty" ,"Bricks"],
        [ "Bricks", "Empty", "Empty","Empty","Empty","Empty","Empty","Empty","Empty","Empty","Empty" ,"Bricks"],
        [ "Bricks", "Empty", "Empty","Empty","Empty","Empty","Empty","Empty","Empty","Empty","Empty" ,"Bricks"],
        [ "Bricks", "Empty", "Empty","Empty","Empty","Empty","Empty","Empty","Empty","Empty","Empty" ,"Bricks"],
        [ "Bricks",  "Bricks", "Bricks", "Bricks" , "Bricks",  "Bricks", "Bricks", "Bricks", "Bricks",  "Bricks", "Bricks", "Bricks"]
    ]
}