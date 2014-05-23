var direction = [0,0];
var jumped = false;
window.addEventListener("keydown", function(e) {
	switch(e.keyCode) {
		case 40:
            if(direction[0] == 0 && direction[1] == 0){
                testPlayer.currentFrameCounter = 0;
                testPlayer.currentFrame = 0;
            }
			direction[1] = -1;
            //testPlayer.currentAnimation = "";
			break;
		case 39:
            if(direction[0] == 0 && direction[1] == 0){
                testPlayer.currentFrameCounter = 0;
                testPlayer.currentFrame = 0;
            }
            testPlayer.directionFacing = "right";
			direction[0] = 1;
            testPlayer.currentAnimation = "runningRight";
           // testPlayer.currentFrameCounter = 0;
           // testPlayer.currentFrame = 0;
			break;
		case 38:
            if(direction[0] == 0 && direction[1] == 0){
                testPlayer.currentFrameCounter = 0;
                testPlayer.currentFrame = 0;
            }
			direction[1] = 1;
           // testPlayer.currentAnimation = "runningRight";
            //testPlayer.currentFrameCounter = 0;
            //testPlayer.currentFrame = 0;
			break;
		case 37:
            if(direction[0] == 0 && direction[1] == 0){
                testPlayer.currentFrameCounter = 0;
                testPlayer.currentFrame = 0;
            }
            testPlayer.directionFacing = "left";
			direction[0] = -1;
            testPlayer.currentAnimation = "runningLeft";
            //testPlayer.currentFrameCounter = 0;
            //testPlayer.currentFrame = 0;
			break;
        case 32:
            console.log("TEST");
            jumped = true;
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
        case 32:
            console.log("TEST");
            jumped = true;
            break;
	}
})

var log = false;



var testPlayer = {
    sprite: {image:"mario", sizeX: 16, sizeY: 32, frames: {standardRight: [[80,0]], standardLeft: [[736,0]], runningRight: [[112,0],[127,0],[112,0], [96,0]], runningLeft: [[704,0],[720,0],[704,0], [688,0]]}},
	positionX: 193,
	positionY: 140,
	width: 35,
	height: 60,
	hp: 100,
	money: 50,
    currentAnimation: "standardRight",
    currentFrame: 0,
    currentFrameCounter: 0,
    directionFacing: "right",
	speed: 5,
    collider: null,
    isJuming: false,
    jumpSpeed: 0,
    jumpHeight: 18,
    Jump: function(height){
        if(!testPlayer.isJumping){
            testPlayer.isJumping = true;
            testPlayer.jumpSpeed = height;
            console.log(testPlayer.jumpSpeed);
        }
    },
    ApplyJump: function(game){
        if(testPlayer.isJumping){
            testPlayer.Move(0,testPlayer.jumpSpeed, game);
            testPlayer.jumpSpeed -= 1;
            if(testPlayer.jumpSpeed < 0){
                testPlayer.jumpSpeed = 0;
            }
        }
    },
    Move: function(x,y, game){
        var p = game.Player;
        testPlayer.currentFrameCounter += 0.1;
        testPlayer.currentFrame = (parseInt(testPlayer.currentFrameCounter)) % testPlayer.sprite.frames[testPlayer.currentAnimation].length;
		game.offsetX += x;
		game.offsetY += y;
		var po = {positionX: testPlayer.getPositionX(game), positionY: testPlayer.getPositionY(game), width: p.width, height: p.height};
		var tc = game.getTerrainCollidersObject(po);
		testPlayer.collider = new SAT.Box(new SAT.Vector(po.positionX, po.positionY), po.width, po.height).toPolygon();
		game.checkCollisionAll(testPlayer.collider, tc, function(res) {
			game.offsetX -= res.overlapV.x;
			game.offsetY -= res.overlapV.y;

			testPlayer.collider.pos.x -= res.overlapV.x;
			testPlayer.collider.pos.y -= res.overlapV.y;

			if(game.offsetX < 0) {
				game.offsetX = 0;
				testPlayer.collider.pos.x = testPlayer.positionX;
			}
		});

		if(game.offsetX < 0) {
			game.offsetX = 0;
		}
    },
	Update: function(game) {
        if(direction[0] == 0 && direction[1] == 0){
            if(testPlayer.directionFacing == "right"){
                testPlayer.currentAnimation = "standardRight";
            }
            else{
                testPlayer.currentAnimation = "standardLeft";
            }
        }
        testPlayer.Move(direction[0] * testPlayer.speed,direction[1] * testPlayer.speed,game);
        game.applyGravity(testPlayer);
        if(jumped){
            //console.log(testPlayer.jumpHeight);
            testPlayer.Jump(testPlayer.jumpHeight);
        }
        testPlayer.ApplyJump(game);
      //  console.log(game.offsetY);

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
	Draw: function(d) {
		d.drawImage(document.getElementById(testPlayer.sprite.image), testPlayer.sprite.frames[testPlayer.currentAnimation][testPlayer.currentFrame][0], testPlayer.sprite.frames[testPlayer.currentAnimation][testPlayer.currentFrame][1], testPlayer.sprite.sizeX , testPlayer.sprite.sizeY, 0, 0, testPlayer.width, testPlayer.height);
	},
	getPositionX: function(game) {
		return game.offsetX + testPlayer.positionX;
	},
	getPositionY: function(game) {
		return game.offsetY + testPlayer.positionY;
	}
}