var Textures = {
	bricks: document.getElementById("texture-bricks")
}

var options = {
	Player: testPlayer
}

var game = new Game(document.getElementById("game-canvas"), options);
game.saveBlocks(Blocks);
game.addWorld(testWorld);




var spritemap = document.getElementById("spritesheet");
var FireBallAnimation = {name: "Fireball", frames: [{x:96, y:144, w:8, h:8}, {x:104, y:144, w:8, h:8}, {x:96, y:152, w:8, h:8}, {x:104, y:152, w:8, h:8}], time: 250};
