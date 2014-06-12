
var ObjectTest = function(){
    this.name     = "ObjectTest";
	this.spriteID = "image";
	this.height = 20;
	this.width = 20;
    this.destroyed = false;
	return this;
}
ObjectTest.prototype.Init = function() {
	this.positionX = 30;
	this.positionY = 140;
	this.sprite    = document.getElementById(this.spriteID);
}
ObjectTest.prototype.Update = function() {
	this.positionX += 1;
    return(this.destroyed);
}
ObjectTest.prototype.Draw = function(d) {
	d.drawImage(this.sprite, 0, 0);
}
var ObjectBomb = function(X, Y, sizeX, sizeY, timer, damage){
    this.name     = "ObjectBomb";
	this.spriteID = "image";
    this.positionX = X  || 0;
	this.positionY = Y  || 0;
	this.height = sizeY || 36;
	this.width  = sizeX || 36;
    this.timer  = timer || 60 * 4;
    this.damage = damage|| 0;
    this.destroyed = false;
	return this;
}
ObjectBomb.prototype.Init = function() {
	this.sprite    = document.getElementById(this.spriteID);
}
ObjectBomb.prototype.Update = function() {
	if(this.timer <= 0){
        //Bomb is destroyed
        //Explosion is created
    }
    else{
        this.timer -= 1;
    }
}
ObjectBomb.prototype.Draw = function(d) {
	d.drawImage(this.sprite, 0, 0);
}
var ObjectBombBlast = function(X, Y, damage){
    this.name     = "ObjectBombBlast";
	this.spriteID = "image";
    this.positionX = X - 36  || 0;
	this.positionY = Y - 36  || 0;
	this.height = 36 * 2;
	this.width  = 36 * 2;
    this.timer  = timer || 10;
    this.damage = damage|| 0;
    this.destroyed = false;
	return this;
}

ObjectBombBlast.prototype.Init = function() {
	this.sprite    = document.getElementById(this.spriteID);
}
ObjectBombBlast.prototype.Update = function() {
	if(this.timer <= 0){
        //Blast dissapears
    }
    else{
        this.timer -= 1;
    }
}
ObjectBombBlast.prototype.Draw = function(d) {
	d.drawImage(this.sprite, 0, 0);
}

var ObjectWarpTile = function(options){
    this.name      = "ObjectWarpTile";
    this.positionX = options.x          || 0;
	this.positionY = options.y          || 0;
    this.height    = options.height     || 36;
    this.width     = options.width      || 36;
    this.spawnPoint= options.spawnPoint || "standard";
    this.spawnWorld= options.spawnWorld || "ChrisHoulihan";
}
ObjectWarpTile.prototype.Update = function(game) {
    self = this;
    game.checkCollisionPlayer(this.collider, function(res, player) {
        console.log(self.spawnWorld);
        game.warpToScene(self.spawnWorld, self.spawnPoint);
    });
}
ObjectWarpTile.prototype.Init = function() {
    this.collider = new SAT.Box(new SAT.Vector(this.positionX, this.positionY), this.width, this.height).toPolygon();
}
ObjectWarpTile.prototype.Draw = function(d) {
	d.drawImage(document.getElementById("image"), 0, 0, this.width, this.height);
}
var ObjectFireBall = function(options){
    this.name      = "ObjectFireBall"; 
	this.positionX = options.x      || 0;
	this.positionY = options.y      || 0;
	this.speed     = options.speed  || 3;
	this.angle     = options.angle  || 0;
    this.damage    = options.damage || 10;
    this.destroyed = options.destroyed || false;

    this.size   = options.size || 36;
    this.height = options.height || this.size;
	this.width  = options.width  || this.size;
    
	return this;
}
ObjectFireBall.prototype.Init = function() {
	this.angleRadian =  (this.angle * Math.PI)/180;
	this.plusX       =  Math.cos(this.angleRadian);
	this.plusY       = -Math.sin(this.angleRadian);
    this.collider = new SAT.Box(new SAT.Vector(this.positionX, this.positionY), this.width, this.height).toPolygon();
	this.animation = new game.Animation("fireball", this.sprites, {time: 90, img: document.getElementById("spritesheet")}).start();
	game.saveAnimation("fireball", this.animation);
}
ObjectFireBall.prototype.Update = function(game) {
    var self = this;
    self.Move(this.plusX * this.speed,this.plusY * this.speed, game);
    //game.applyGravity(this);
    //if(SAT.testPolygonPolygon(this.collider, Player.collider, null)){
    game.checkCollisionPlayer(this.collider, function(res, player) {
        console.log(self.damage);
        player.damage(self.damage);
    }); 
   
        //this.destroyed = true;
    //}
    return this.destroyed;
}
ObjectFireBall.prototype.Draw = function(d) {
	d.drawSprite(this.animation.getSprite(), 0, 0, this.width, this.height);
}
ObjectFireBall.prototype.Move = function(x,y, game) {
    this.positionX += x;
    this.positionY += y;
    this.collider.pos.x += x;
    this.collider.pos.y += y;
    var po = {positionX: this.positionX, positionY: this.positionY, width: this.size, height: this.size};
    var positionX =  this.positionX;
    var positionY =  this.positionY;
    var colliderX =  this.collider.pos.x;
    var colliderY =  this.collider.pos.y;
    game.checkCollisionAll(this.collider, function(res, object, type) {
        if(type !== "player") {
            positionX -= res.overlapV.x;
            positionY -= res.overlapV.y;
            colliderX -= res.overlapV.x;
            colliderY -= res.overlapV.y;
        }
    });
  //   game.checkCollisionAll(this.collider, game.getTerrainCollidersObject(po), function(res) {
  //       positionX -= res.overlapV.x;
  //       positionY -= res.overlapV.y;
		// colliderX -= res.overlapV.x;
		// colliderY -= res.overlapV.y;
  //   });
  //   game.checkCollisionAll(this.collider, game.getObjectCollidersObject(po), function(res) {
  //       positionX -= res.overlapV.x;
  //       positionY -= res.overlapV.y;
		// colliderX -= res.overlapV.x;
		// colliderY -= res.overlapV.y;
  //   });

    // this.positionX = positionX;
    // this.positionY = positionY;
    // this.collider.pos.x = colliderX;
    // this.collider.pos.y = colliderY;
}
ObjectFireBall.prototype.sprites = [
	{x:96,  y:144, w:8, h:8},
	{x:104, y:144, w:8, h:8},
	{x:96,  y:152, w:8, h:8},
	{x:104, y:152, w:8, h:8}
];






var ObjectTestNoOffset = function() {
    this.name      = "ObjectTestNoOffset";
	this.spriteID  = "image";
    this.destroyed = false;

	return this;
}
ObjectTestNoOffset.prototype.Init = function() {
	this.sprite = document.getElementById(this.spriteID);
}
ObjectTestNoOffset.prototype.Draw = function(d) {
	d.drawImageNoOffset(this.sprite, 15, 15);
}