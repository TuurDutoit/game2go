window.addEventListener("keydown", function(e) {
    player.updateDirection(e, "pressed");
});
window.addEventListener("keyup", function(e) {
    player.updateDirection(e, "released");
});



var Player = function(options, sprites) {
    this.options    = options;
    this.offsetX    = options.offsetX    || 0;
    this.offsetY    = options.offsetY    || 0;
    this.width      = options.width      || 36;
    this.height     = options.height     || 72;
    this.gravity    = options.gravity || 0.22;

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

    this.hadInit = true;

    return this;
}
Player.prototype.Update = function(game, player) {
    this.Move(this.speedX, this.speedY, game);
    return this;
}
Player.prototype.Move = function(x, y, game) {
    this.positionX += x;
    this.positionY += y;

    var player = this;
    this.grounded = false; game.checkCollisionTerrain(this.collider, function(res, block) {
//Handle collisions
        player.positionX -= res.overlapV.x;
        player.positionY -= res.overlapV.y;

    if(res.overlapN.y === -1) {
        player.speedY = 0;
        player.grounded = true;
    }
    else if(res.overlapN.y === 1) {
        player.speedY = 0;
    }

    if(!player.grounded) {
        player.speedY -= player.gravity;
    }

// Do not allow Player to walk out of the game
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
    this.updateDirection();
    return this;
}
Player.prototype.updateDirection = function(event, type) {
    if(type === "pressed") {
        switch(event.keyCode) {
            case 37:
                this.keys.left = game.getTime();
                this.speedX = -1*this.speed.x;
                break;
            case 38:
                this.keys.up = game.getTime();
                this.speedY = this.speed.y;
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