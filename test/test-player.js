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
	positionY: 175,
	width: 35,
	height: 70,
	update: function(game) {
		if(right) {
			game.offsetX += 2;
		}
		if(left) {
			game.offsetX -= 2;
		}
		if(up) {
			game.offsetY += 1;
		}
		if(down) {
			game.offsetY -= 1;
		}
	},
	draw: function(d) {
		d.fillStyle("#000000").fillRect(0, 0, 35, 70);
	}
}