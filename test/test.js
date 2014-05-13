var options = {
	Player: testPlayer
}

var game = new Game(document.getElementById("game-canvas"), options);
game.saveBlocks(Block);
game.load(testWorld);
