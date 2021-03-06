var testScene = {
    name: "Scene 1",
    Backgrounds: [
        {
            height: 420, width: 840, positionX: 0, positionY: 0,
            Draw: function(d) {
                d.drawImage(document.getElementById("background-scene1"), 0, 0);
            }
        }
    ],
	Objects: [new ObjectTest(), new ObjectTestNoOffset(), new ObjectFireBall({x:50, y:300, speed:1.5, angle:0, size:32}), new ObjectFireBall({x:150, y:300, speed:1, angle:0, size:32})],
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
	Objects: [new ObjectTest(), new ObjectTestNoOffset(), new ObjectFireBall({x:50, y:300, speed:1.5, angle:0, size:32}), new ObjectFireBall({x:150, y:300, speed:1, angle:0, size:32})],
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