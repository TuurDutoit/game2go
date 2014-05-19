var Textures = {
	bricks: document.getElementById("texture-bricks")
}

var options = {
	Player: testPlayer
}
console.log(options);

var game = new Game(document.getElementById("game-canvas"), options);
game.saveBlocks(Blocks);
game.addWorld(testWorld);
