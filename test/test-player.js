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
	positionY: 140,
	width: 35,
	height: 60,
	hp: 100,
	money: 50,
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

		if(game.offsetX < 0) {game.offsetX = 0;}
		if(game.offsetY < 0) {game.offsetY = 0;}
	},
	damage: function(damage) {
		if(testPlayer.hp - damage > 0){
			testPlayer.hp -= damage;
		}
		else{
			//Player is killed
			alert("Game Over!");
		}
	},
	draw: function(d) {
		d.fillStyle("#000000").fillRect(0, 0, 35, 60);
	}
}