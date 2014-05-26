window.addEventListener("keydown", function(e) {
    switch(e.keyCode) {
        case 40:
            //Down
            if(!player.keys.down) {
                player.keys.down = game.getTime();
                player.updateSpeeds("downPressed");
            }
            break;
        case 39:
            //Right
            if(!player.keys.right) {
                player.keys.right = game.getTime();
                player.updateSpeeds("rightPressed");
            }
            break;
        case 38:
            //Up
            if(!player.keys.up) {
                player.keys.up = game.getTime();
                player.updateSpeeds("upPressed");
            }
            break;
        case 37:
            //Left
            if(!player.keys.left) {
                player.keys.left = game.getTime();
                player.updateSpeeds("leftPressed");
            }
            break;
        }
    });
window.addEventListener("keyup", function(e) {
    switch(e.keyCode) {
        case 40:
            //Down
            if(player.keys.down) {
                player.keys.down = false;
                player.updateSpeeds("downRealeased");
            }
            break;
        case 39:
            //Right
            if(player.keys.right) {
                player.keys.right = false;
                player.updateSpeeds("rightRealeased");
            }
            break;
        case 38:
            //Up
            if(player.keys.up) {
                player.keys.up = false;
                player.updateSpeeds("upRealeased");
            }
            break;
        case 37:
            //Left
            if(player.keys.left) {
                player.keys.left = false;
                player.updateSpeeds("leftRealeased");
            }
            break;
    }
})



var Player = function(options, sprites) {
    this.options    = options;
    this.offsetX    = options.offsetX  || 0;
    this.offsetY    = options.offsetY  || 0;
    this.width      = options.width    || 36;
    this.height     = options.height   || 72;
    this.gravity    = new Gravity(options.gravity || 0, options.gravityTime || 10);

    this.keys = {
        up:    false,
        down:  false,
        right: false,
        left:  false
    }

    this.name       = options.name     || "Player";
    this.spriteID   = options.spriteID || "player-sprite";
    this.hp         = options.hp       || 0;
    this.money      = options.money    || 0;


    this.sprites    = options.sprites;

    return this;
}
Player.prototype.Init = function(game) {
    var spritemap = document.getElementById(this.spriteID);
    this.animations = {
        playerRight:     new game.Animation("playerRight",     this.sprites.right,     {time: 90, img: spritemap}).start(),
        playerLeft:      new game.Animation("playerLeft",      this.sprites.left,      {time: 90, img: spritemap}),
        playerWalkRight: new game.Animation("playerWalkRight", this.sprites.walkRight, {time: 90, img: spritemap}),
        playerWalkLeft:  new game.Animation("playerWalkLeft",  this.sprites.walkLeft,  {time: 90, img: spritemap}),
    }
    game.saveAnimations(this.animations);
    this.animation = "playerRight";

    this.collider = new SAT.Box(new SAT.Vector(this.offsetX + game.offsetX, this.offsetY), this.width, this.height).toPolygon();
    this.setSpeed(this.speed);

    this.speedX = 0;
    this.speedY = 0;

    this.Move(0,0,game);

    return this;
}
Player.prototype.Update = function(game, player) {
    this.speedY = this.gravity.apply(this.speedY);
    this.Move(this.speedX, this.speedY, game);
    return this;
}
Player.prototype.Move = function(x, y, game) {
    this.positionX += x;
    this.positionY += y;

    var player = this;
    player.grounded = false;
    game.checkCollisionTerrain(this.collider, function(res, block) {
        if(res.overlapV.y !== 0 && res.overlap > 0.5) {
            player.speedY = 0;
            if(res.overlapN === -1)  {
                player.gravity.stop();
            }
        }
        if(res.overlapN.y === -1) {
            player.grounded = true;
        };

        player.positionX -= res.overlapV.x;
        player.positionY -= res.overlapV.y;

        if(game.offsetX < 0) {
            player.positionX += -1*game.offsetX;
        }
        if(game.offsetY < 0) {
            player.positionY += -1*game.offsetY;
        }
    });
}
Player.prototype.Draw = function(d, player) {
    var sprite = player.animations[player.animation].getSprite();
    d.drawSprite(sprite, 0, 0, player.width, player.height);
    return this;
}
Player.prototype.damage = function(damage) {
    this.hp -= damage;
    if(damage <= 0) {
        game.stop();
        alert("Game Over!");
    }
}
Player.prototype.setSpeed = function(x, y) {
//Sets the x/y speed base speed
    if(y) {
        this.speed.x = x;
        this.speed.y = y;
    }
    else if(typeof x === "number") {
        this.speed.x = x;
        this.speed.y = x;
    }
    else if(typeof x === "object") {
        this.speed = x;
    }
    else {
        this.speed = {x: 5, y: 5};
    }
    this.updateSpeeds();
    return this;
}
Player.prototype.updateSpeeds = function(event) {
    if(this.keys.right && this.keys.left) {
        if(this.keys.left < this.keys.right) {
            this.speedX = -1*this.speed.x
        }
        else {
            this.speedX = this.speed.x;
        }
    }
    else if(this.keys.right) {
        this.speedX = this.speed.x;
    }
    else if(this.keys.left) {
        this.speedX = -1*this.speed.x;
    }
    else {
        this.speedX = 0;
    }

    if(this.keys.up) {
        if(event === "upPressed" && this.grounded) {
            this.speedY = this.speed.y;
            this.gravity.start();
        }
    }

    this.updateAnimation();
}
Player.prototype.updateAnimation = function(event) {
    if(this.speedX > 0) {
        this.changeAnimation("playerWalkRight");
    }
    else if(this.speedX < 0) {
        this.changeAnimation("playerWalkLeft");
    }
    else {
        if(event === "leftReleased") {
            this.changeAnimation("playerLeft");
        }
        else {
            this.changeAnimation("playerRight");
        }
    }

    //Jump & Crouch ...
}
Player.prototype.changeAnimation = function(name) {
    this.animations[this.animation].stop();
    this.animations[name].start();
    this.animation = name;
    return this;
}







var Gravity = function(coefficient, time) {
    this.coefficient = coefficient;
    this.time        = time;
    this.started     = false;
    return this;
}
Gravity.prototype.start = function() {
    //Start gravity
    this.lastGetTime = Game.prototype.getTime();
    this.started     = true;
    return this;
}
Gravity.prototype.stop = function() {
    //Stop gravity
    //getSpeed will return 0
    this.started = false;
    return this;
}
Gravity.prototype.getSpeed = function() {
    if(this.started) {
        //Get delta time
        var dtime = (Game.prototype.getTime() - this.lastGetTime) / this.time;
        //Return the velocity to be substracted from the current velocity
        return this.coefficient * dtime;
    }
    else {
        return 0;
    }
}
Gravity.prototype.apply = function(speed) {
    //Apply getSpeed on the given speed
    return speed - this.getSpeed();
}