var direction = [0,0];
window.addEventListener("keydown", function(e) {
	switch(e.keyCode) {
		case 40:
			direction[1] = -1;
			break;
		case 39:
			direction[0] = 1;
			break;
		case 38:
			direction[1] = 1;
			break;
		case 37:
			direction[0] = -1;
			break;
	}
});
window.addEventListener("keyup", function(e) {
	switch(e.keyCode) {
		case 40:
			direction[1] = 0;
			break;
		case 39:
			direction[0] = 0;
			break;
		case 38:
			direction[1] = 0;
			break;
		case 37:
			direction[0] = 0;
			break;
	}
})

var log = false;



var testPlayer = {
	positionX: 193,
	positionY: 140,
	width: 35,
	height: 60,
	hp: 100,
	money: 50,
	speed: 5,
	update: function(game) {
		var p = game.Player;
		game.offsetX += direction[0] * testPlayer.speed;
		game.offsetY += direction[1] * testPlayer.speed;
		
		var po = {positionX: game.offsetX + p.positionX, positionY: game.offsetY + p.positionY, width: p.width, height: p.height};
		var tc = game.getTerrainCollidersObject(po);
		var pc = new SAT.Box(new SAT.Vector(po.positionX, po.positionY), po.width, po.height).toPolygon();

		for(var i = 0, len = tc.length; i < len; i++) {
			var r = new SAT.Response();
			if(SAT.testPolygonPolygon(pc, tc[i], r)) {
				game.offsetX -= r.overlapV.x;
				game.offsetY -= r.overlapV.y;
			}
		}
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