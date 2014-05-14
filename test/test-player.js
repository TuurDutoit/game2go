var right = false, left = false, up = false, down = false;
window.addEventListener("keydown", function(e) {
	switch(e.keyCode) {
		case 40:
			down = true;
			break;
		case 39:
			right = true;
			break;
		case 38:
			up = true;
			break;
		case 37:
			left = true;
			break;
	}
});
window.addEventListener("keyup", function(e) {
	switch(e.keyCode) {
		case 40:
			down = false;
			break;
		case 39:
			right = false;
			break;
		case 38:
			up = false;
			break;
		case 37:
			left = false;
			break;
	}
})



var testPlayer = {
	positionX: 193,
	positionY: 220,
	width: 35,
	height: 60,
	update: function(game) {
		if(right) {
			game.offsetX += 3;
		}
		if(left) {
			game.offsetX -= 3;
		}
		if(up) {
			game.offsetY += 3;
		}
		if(down) {
			game.offsetY -= 3;
		}
	},
	draw: function(d) {
		d.fillStyle("#000000").fillRect(0, 0, 35, 60);
	}
}