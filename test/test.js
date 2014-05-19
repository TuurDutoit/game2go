var Textures = {
	bricks: document.getElementById("texture-bricks")
}

var options = {
	Player: testPlayer
}

var game = new Game(document.getElementById("game-canvas"), options);
game.saveBlocks(Blocks);
game.addWorld(testWorld);
