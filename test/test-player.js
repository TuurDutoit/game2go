var jumping = false;
setTimeout(function() {
	jumping = true;
}, 1000);
setTimeout(function() {
	jumping = false;
}, 2000);


var testPlayer = {
	positionX: 193,
	positionY: 175,
	width: 35,
	height: 70,
	update: function(game) {
		game.offsetX += 2;
		if(jumping) game.offsetY += 1;
	},
	draw: function(d) {
		d.fillStyle("#000000").fillRect(0, 0, 35, 70);
	}
}