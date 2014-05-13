var testPlayer = {
	positionY: 70,
	positionX: 35,
	width: 35,
	height: 70,
	update: function(player, game) {
		player.positionX += 2;
		//player.positionY += 1;
	},
	draw: function(d) {
		d.fillStyle("#000000").fillRect(0, 0, 35, 70);
	}
}