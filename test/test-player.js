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
    if(x < 0) { //Walking left
        this.positionX += x;
        if(game.offsetX < 0) { //Game offset going negative
            this.offsetX += game.offsetX;
            game.offsetX = 0;
            if(this.offsetX < 0) {
                this.offsetX = 0;
            }
            game.updatePlayerCollider();
        }
    }
    if(x > 0) { //Walking right
        if(this.offsetX === this.origOffset.x) {
            this.positionX += x;
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
            game.updatePlayerCollider();
        }
    }

    this.positionY += y;
    // if(game.offsetY < 0) {
    //     this.offsetY += game.offsetY;
    //     game.offsetY = 0;
    //     if(this.offsetY < 0) {
    //         this.offsetY = 0;
    //     }
    //     game.updatePlayerCollider();
    // }





    this.positionY += y;

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