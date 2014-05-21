
var ObjectTest = function(){
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





var ObjectFireBall = function(options){
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

	this.animation = new game.Animation("fireball", this.sprites, {time: 90, img: document.getElementById("spritesheet")}).start();
	game.saveAnimation("fireball", this.animation);
}
ObjectFireBall.prototype.Update = function() {
	this.positionX += this.plusX * this.speed;
	this.positionY -= this.plusY * this.speed;
    this.collider = new SAT.Box(new SAT.Vector(this.positionX, this.positionY), this.width, this.height).toPolygon();
    if(SAT.testPolygonPolygon(this.collider, testPlayer.collider, null)){
        testPlayer.damage(this.damage);
        this.destroyed = true;
    }
    return this.destroyed;
}
ObjectFireBall.prototype.Draw = function(d) {
	var s = this.animation.getSprite();
	d.drawImage(s.img, s.x, s.y, s.w, s.h, 0, 0, this.width, this.height);
}
ObjectFireBall.prototype.sprites = [
	{x:96,  y:144, w:8, h:8},
	{x:104, y:144, w:8, h:8},
	{x:96,  y:152, w:8, h:8},
	{x:104, y:152, w:8, h:8}
];






var ObjectTestNoOffset = function() {
	this.spriteID  = "image";
    this.destroyed = false;

	return this;
}
ObjectTestNoOffset.prototype.Init = function() {
	this.sprite = document.getElementById(this.spriteID);
}
ObjectTestNoOffset.prototype.Draw = function(d) {
	d.drawImageNoOffset(this.sprite, 15, 15)
}