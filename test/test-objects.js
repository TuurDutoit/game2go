var ObjectTest = function(){
	this.spriteID = "image";
	this.height = 20;
	this.width = 20;
    this.destroyed = false;
	return this;
}
ObjectTest.prototype.Init = function() {
	this.positionX = 30;
	this.positionY = 30;
}
ObjectTest.prototype.Update = function() {
	this.positionX += 1;
	this.positionY += 1;
    return(this.destroyed);
}
ObjectTest.prototype.Draw = function(d) {
	d.drawImage(document.getElementById(this.spriteID), 0, 0);
}





var ObjectFireBall = function(x, y , size, angle, speed, damage){
	// this.sprite =  {image:"spritesheet", size: 8, frames: {standard: [[96,144],[104,144],[96,152], [104,152]]}}
	this.animation = {name: "Fireball-normal", frames: [{x:96, y:144, w:8, h:8}, {x:104, y:144, w:8, h:8}, {x:96, y:152, w:8, h:8}, {x:104, y:152, w:8, h:8}], time: 250};
	// this.currentAnimation = "standard";
	// this.currentFrame = 0;
	this.positionX = x      || 0;
	this.positionY = y      || 0;
	this.speed     = speed  || 3;
	this.angle     = angle  || 0;
	this.size      = size   || 35;
    this.damage    = damage || 10;
	this.height    = this.size;
	this.width     = this.size;
    this.destroyed = false;
    
	return this;
}
ObjectFireBall.prototype.Init = function() {
	this.angleRadian = (this.angle * Math.PI)/180;
	this.plusX = Math.cos(this.angleRadian);
	this.plusY = -Math.sin(this.angleRadian);
}
ObjectFireBall.prototype.Update = function() {
	this.currentFrame = (this.currentFrame + 1) % this.sprite.frames[this.currentAnimation].length;
	this.positionX += this.plusX * this.speed;
	this.positionY -= this.plusY * this.speed;
    this.collider = new SAT.Box(new SAT.Vector(this.positionX, this.positionY), this.width, this.height).toPolygon();
    if(SAT.testPolygonPolygon(this.collider, testPlayer.collider, null)){
        testPlayer.damage(this.damage);
        this.destroyed = true;
    }
    return this.destroyed;
    //.collider.pos.x = testPlayer.positionX;
}
ObjectFireBall.prototype.Draw = function(d) {
	d.drawImage(document.getElementById(this.sprite.image), this.sprite.frames[this.currentAnimation][this.currentFrame][0], this.sprite.frames[this.currentAnimation][this.currentFrame][1], this.sprite.size , this.sprite.size, 0, 0, this.size, this.size);
}






var ObjectTestNoOffset = function() {
	this.spriteID = "image";
    this.destroyed = false;
	return this;
}
ObjectTestNoOffset.prototype.Draw = function(d) {
	d.drawImageNoOffset(document.getElementById(this.spriteID), 15, 15)
}