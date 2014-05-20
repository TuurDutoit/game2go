var ObjectTest = function(){
	this.spriteID = "image";
	this.height = 20;
	this.width = 20;
    this.destroyed = false;
    this.hasCollider = false;
	return this;
}
ObjectTest.prototype.Init = function() {
	this.positionX = 30;
	this.positionY = 30;
}
ObjectTest.prototype.Update = function(game) {
	this.positionX += 1;
	this.positionY += 1;
    return(this.destroyed);
}
ObjectTest.prototype.Draw = function(d) {
	d.drawImage(document.getElementById(this.spriteID), 0, 0);
}





var ObjectFireBall = function(x, y , size, angle, speed, damage){
	this.sprite =  {image:"spritesheet", size: 8, frames: {standard: [[96,144],[104,144],[96,152], [104,152]]}}
	this.currentAnimation = "standard";
	this.currentFrame = 0;
	this.positionX = x || 0;
	this.positionY = y || 0;
	this.speed = speed || 3;
	this.angle = angle || 0;
	this.size  = size || 35;
    this.damage  = damage || 10;
	this.height = this.size;
	this.width = this.size;
    this.destroyed = false;
    this.hasCollider = true;
    this.collider = null;
	return this;
}
ObjectFireBall.prototype.Init = function() {
	this.angleRadian = (this.angle * Math.PI)/180;
    this.collider = new SAT.Box(new SAT.Vector(this.positionX, this.positionY), this.width, this.height).toPolygon();
	this.plusX = Math.cos(this.angleRadian);
	this.plusY = Math.sin(this.angleRadian);
}
ObjectFireBall.prototype.Move = function(x,y, game) {
    this.positionX += x;
    this.positionY += y;
    this.collider.pos.x += x;
    this.collider.pos.y += y;
    var po = {positionX: this.positionX, positionY: this.positionY, width: this.size, height: this.size};
    var tc = game.getTerrainCollidersObject(po);
    var positionX =  this.positionX;
    var positionY =  this.positionY;
    var colliderX =  this.collider.pos.x;
    var colliderY =  this.collider.pos.y;
    game.checkCollisionAll(this.collider, tc, function(res) {
        positionX -= res.overlapV.x;
        positionY -= res.overlapV.y;
		colliderX -= res.overlapV.x;
		colliderY -= res.overlapV.y;
    });
    for(i = 0; i < game.scene.Objects.length; i++){
        if(game.scene.Objects[i].hasCollider){
            console.log(game.scene.Objects[i].collider);
            //if(game.scene.Ojects[i].positionX*game.scene.Ojects[i].positionX + game.scene.Ojects[i].positionY*game.scene.Ojects[i].positionY <= 200){
                game.checkCollision(this.collider, game.scene.Objects[i].collider, function(res) {
                    positionX -= res.overlapV.x;
                    positionY -= res.overlapV.y;
                    colliderX -= res.overlapV.x;
                    colliderY -= res.overlapV.y;
                });
            //}
        }
    }
    this.positionX = positionX;
    this.positionY = positionY;
    this.collider.pos.x = colliderX;
    this.collider.pos.y = colliderY;
}
ObjectFireBall.prototype.Update = function(game) {
    this.Move(this.plusX * this.speed,this.plusY * this.speed, game);
	this.currentFrame = (this.currentFrame + 1) % this.sprite.frames[this.currentAnimation].length;
    this.collider = new SAT.Box(new SAT.Vector(this.positionX, this.positionY), this.width, this.height).toPolygon();
    if(SAT.testPolygonPolygon(this.collider, testPlayer.collider, null)){
        testPlayer.damage(this.damage);
        this.destroyed = true;
    }
    return this.destroyed;
}
ObjectFireBall.prototype.Draw = function(d) {
	d.drawImage(document.getElementById(this.sprite.image), this.sprite.frames[this.currentAnimation][this.currentFrame][0], this.sprite.frames[this.currentAnimation][this.currentFrame][1], this.sprite.size , this.sprite.size, 0, 0, this.size, this.size);
}






var ObjectTestNoOffset = function() {
	this.spriteID = "image";
    this.destroyed = false;
    this.hasCollider = false;
	return this;
}
ObjectTestNoOffset.prototype.Draw = function(d) {
	d.drawImageNoOffset(document.getElementById(this.spriteID), 15, 15)
}