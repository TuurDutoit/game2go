var Textures = {
	bricks: document.getElementById("texture-bricks")
}

var playerOptions = {
	name: "Player",
	spriteID: "mario",
	hp: 0,
	money: 0,
	offsetX: 198,
	offsetY: 186,
	width: 36,
	height: 72,
	speed: 5,
	gravity: 1,
	gravityTime: 1000,
	sprites: {
		right: [{x:80,  y:0, w:16, h:32}],
		left : [{x:736, y:0, w:16, h:32}],
		walkRight: [{x:112, y:0, w:16, h:32}, {x:127, y:0, w:16, h:32}, {x:112, y:0, w:16, h:32}, {x:96,  y:0, w:16, h:32}],
		walkLeft : [{x:704, y:0, w:16, h:32}, {x:720, y:0, w:16, h:32}, {x:704, y:0, w:16, h:32}, {x:688, y:0, w:16, h:32}]
	}
}
var player = new Player(playerOptions);

var options = {
    Player: player
}

var game = new Game(document.getElementById("game-canvas"), options);
game.saveBlocks(Blocks);
game.addWorld(testWorld);