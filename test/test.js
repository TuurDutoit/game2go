var Textures = {
	bricks: document.getElementById("texture-bricks")
}

var options = {
	Player: testPlayer,
    gravity: 1,
    maxGravitySpeed: 50
}

var game = new Game(document.getElementById("game-canvas"), options);
game.saveBlocks(Blocks);
game.addWorld(testWorld);