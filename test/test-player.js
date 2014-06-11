window.addEventListener("keydown", function(e) {
    player.updateKeys(e, "pressed");
});
window.addEventListener("keyup", function(e) {
    player.updateKeys(e, "released");
});


var Player = function(options, sprites) {
    this.options    = options;
    this.offsetX    = options.offsetX    || 0;
    this.offsetY    = options.offsetY    || 0;
    this.width      = options.width      || 36;
    this.height     = options.height     || 72;
    this.speed      = options.speed      || 5;
    this.maxSpeed   = options.maxSpeed   || 5;
    this.maxJump    = options.maxJump    || 1;
    this.gravity    = options.gravity    || 0.22;

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
    var spritemap   = document.getElementById(this.spriteID);
    this.animations = {
        playerRight:     new game.Animation("playerRight",     this.sprites.right,     {time: 90, img: spritemap}).start(),
        playerLeft:      new game.Animation("playerLeft",      this.sprites.left,      {time: 90, img: spritemap}),
        playerWalkRight: new game.Animation("playerWalkRight", this.sprites.walkRight, {time: 90, img: spritemap}),
        playerWalkLeft:  new game.Animation("playerWalkLeft",  this.sprites.walkLeft,  {time: 90, img: spritemap}),
    }
    game.saveAnimations(this.animations);
    this.animation  = "playerRight";

    this.collider   = new SAT.Box(new SAT.Vector(this.offsetX + game.offsetX, this.offsetY), this.width, this.height).toPolygon();
    this.setBaseSpeed(this.speed);
    this.setMaxSpeed(this.maxSpeed);

    this.speedX     = 0;
    this.speedY     = 0;
    this.jumping    = 0;
    this.touching   = {
        top: false,
        right: false,
        bottom: false,
        left: false
    }

    this.origOffset = {x: this.offsetX, y: this.offsetY};

    this.hadInit    = true;

    return this;
}
Player.prototype.Update = function(game, player) {
//Check if speed is not exceeding maximum
    if(this.speedX > this.maxSpeed.x) {
        this.speedX = this.maxSpeed.x;
    }
    else if(this.speedX < -1*this.maxSpeed.x) {
        this.speedX = -1*this.maxSpeed.x;
    }
    if(this.speedY > this.maxSpeed.y) {
        this.speedY = this.maxSpeed.y;
    }
    else if(this.speedY < -1*this.maxSpeed.y) {
        this.speedY = -1*this.maxSpeed.y;
    }

//Move the player
    this.Move(this.speedX, this.speedY, game);

//Some checks for jumps, gravity etc.
    if(!this.touching.bottom) {
        //Apply gravity if not touching the floor
        this.speedY -= this.gravity;
    }
    else {
        //If touching the floor, stop jumping
        this.jumping = 0;
        this.speedY = 0;
    }
    if(this.touching.top) {
        this.speedY = 0;
    }

    return this;
}
Player.prototype.Move = function(x, y, game) {
//Do not allow the player to walk off the canvas
   this.performMove(x, y, game);

// Do not allow Player to walk out of the game
    if(game.offsetX < 0) {
        var diff = game.offsetX;
        game.offsetX -= diff;
        this.offsetX += diff;
        game.updatePlayerCollider();
    }
    if(game.offsetY < 0) {
        var diff = game.offsetY;
        game.offsetY -= diff;
        this.positionY += diff;
        game.updatePlayerCollider();
    }

    this.touching = {top:false, right:false, bottom:false, left: false};
    var player = this;
    game.checkCollisionTerrain(this.collider, function(res, block) {
//Handle collisions
        player.positionX -= res.overlapV.x;
        player.positionY -= res.overlapV.y;

//Set some 'touching' values
        if(res.overlapV.y > 0) {
            player.touching.top = true;
        }
        else if(res.overlapV.y < 0) {
            player.touching.bottom = true;
        }
        if(res.overlapV.x > 0) {
            player.touching.right = true;
        }
        else if(res.overlapV.x < 0) {
            player.touching.left = true;
        }
    });
}
Player.prototype.performMove = function(x, y, game) {
//Move the player, while checking it is not going off canvas
//X
    if(x < 0) { //Walking left
        if(this.offsetX <= this.origOffset.x) {
            this.positionX += x;
            if(game.offsetX < 0) { //Game offset going negative
                this.offsetX += game.offsetX;
                game.offsetX = 0;
            }
        }
        else {
            var diff = this.offsetX - this.origOffset.x;
            if(diff >= -1*x) {
                this.offsetX += x;
            }
            else {
                game.offsetX -= diff + x;
                this.offsetX = this.origOffset.x;
            }
        }
    }
    if(x > 0) { //Walking right
        if(this.offsetX >= this.origOffset.x) {
            this.positionX += x;
            maxOffset = game.gameWidth - game.width;
            if(game.offsetX > maxOffset) {
                var diff = game.offsetX - maxOffset;
                this.offsetX += diff;
                game.offsetX = maxOffset;
            }
        }
        else if(this.offsetX < this.origOffset.x) {
            var diff = this.origOffset.x - this.offsetX;
            if(diff >= x) {
                this.offsetX += x;
            }
            else {
                game.offsetX += diff;
                this.offsetX = this.origOffset.x;
            }
        }
    }

//Y
    if(y < 0) { //Going down
        var diff = this.offsetY - this.origOffset.y;
        if(diff >= -1*y) {
            this.offsetY += y;
        }
        else {
            game.offsetY += diff - (-1*y);
            this.offsetY = this.origOffset.y;
        }
    }
    if(y > 0) { //Going up
        if(this.offsetY >= this.origOffset.y) {
            this.positionY += y;
            maxOffset = game.gameHeight - game.height;
            if(game.offsetY > maxOffset) {
                var diff = game.offsetY - maxOffset;
                this.offsetY += diff;
                game.offsetY = maxOffset;
            }
        }
        else if(this.offsetY < this.origOffset.y) {
            var diff = this.origOffset.y - this.offsetY;
            if(diff >= y) {
                this.offsetY += y;
            }
            else {
                game.offsetY += diff;
                this.offsetY = this.origOffset.x;
            }
        }
    }

    if(player.offsetX < 0) {player.offsetX = 0;}
    if(player.offsetY < 0) {player.offsetY = 0;}
    if(player.offsetX > game.width - player.width) {player.offsetX = game.width - player.width;}
    if(player.offsetY > game.height - player.height) {player.offsetY = game.height - player.height;}
    if(game.offsetY > game.gameHeight - game.height) {game.offsetY = game.gameHeight - game.height;}

    game.updatePlayerCollider();
    return this;
}
Player.prototype.Draw = function(d, player) {
    var sprite = player.animations[player.animation].getSprite();
    d.drawSprite(sprite, 0, 0, player.width, player.height);
    //console.log(this.positionX);
    //console.log(this.positionY);
    return this;
}
Player.prototype.damage = function(damage) {
    this.hp -= damage;
    console.log("Bloooo");
    if(this.hp <= 0) {
        console.log("Blooeoo");
        //game.stop();
        game.warpToScene("TestSceneB", "standard");
        //alert("Game Over!");
    }
    return this;
}
Player.prototype.setBaseSpeed = function(x, y) {
//Sets the x/y speed _base_ speed
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
    if(this.origBaseSpeed) this.updateBaseSpeed();
    this.origBaseSpeed = this.speed;
    return this;
}
Player.prototype.setMaxSpeed = function(x, y) {
    //Sets the x/y _maximum_ speed
    if(y) {
        this.maxSpeed.x = x;
        this.maxSpeed.y = y;
    }
    else if(typeof x === "number") {
        this.maxSpeed.x = x;
        this.maxSpeed.y = x;
    }
    else if(typeof x === "object") {
        this.maxSpeed = x;
    }
    else {
        this.maxSpeed = {x: 5, y: 5};
    }
    return this;
}
Player.prototype.updateKeys = function(event, type) {
    if(type === "pressed") {
        switch(event.keyCode) {
            case 37:
                this.keys.left = game.getTime();
                this.speedX = -1*this.speed.x;
                break;
            case 38:
                if(this.jumping < this.maxJump && !this.keys.up) {
                    this.keys.up = game.getTime();
                    this.speedY += this.speed.y;
                    this.jumping++;
                }
                break;
            case 39:
                this.keys.right = game.getTime();
                this.speedX = this.speed.x;
                break;
            case 40:
                this.keys.down = game.getTime();
                break;
        }
    }
    else if(type === "released") {
        switch(event.keyCode) {
            case 37:
                this.keys.left = false;
                this.speedX = this.keys.right ? this.speed.x : 0;
                break;
            case 38:
                this.keys.up = false;
                break;
            case 39:
                this.keys.right = false;
                this.speedX = this.keys.left ? -1*this.speed.x : 0;
                break;
            case 40:
                this.keys.down = false;
                break;
        }
    }

    if(this.hadInit) this.updateAnimation(event, type);
    return this;
}
Player.prototype.updateBaseSpeed = function() {
    //Should be called when the base speed (player.speed) is changed
    //But before the origBaseSpeed is changed!
    var ratioX = this.speedX/this.origBaseSpeed.x;
    var ratioY = this.speedY/this.origBaseSpeed.y;
    
    this.speedX = ratioX * this.speed.x;
    this.speedY = ratioY * this.speed.y;

    return this;
}
Player.prototype.updateAnimation = function(event, type) {
    if(this.speedX > 0) {
        this.changeAnimation("playerWalkRight");
    }
    else if(this.speedX < 0) {
        this.changeAnimation("playerWalkLeft");
    }
    else {
        if(event.keyCode === 37 && type === "released") {
            this.changeAnimation("playerLeft");
        }
        else {
            this.changeAnimation("playerRight");
        }
    }

    //Jump & Crouch ... in master branch
    return this;
}
Player.prototype.changeAnimation = function(name) {
    this.animations[this.animation].stop();
    this.animations[name].start();
    this.animation = name;
    return this;
}