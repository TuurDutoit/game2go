var ObjectTest = function(){
	this.spriteID = "image";
	return this;
}
ObjectTest.prototype.Init = function() {
	this.positionX = 30;
	this.positionY = 30;
}
ObjectTest.prototype.Update = function() {
	this.positionX += 1;
	this.positionY += 1;
}
ObjectTest.prototype.Draw = function(d) {
	d.drawImage(document.getElementById(this.spriteID), 0, 0);
}

var ObjectFireBall = function(x, y , angle){
	this.spriteID = "image";
	this.positionX = x;
	this.positionY = y;
	this.angle = angle;
	return this;
}
ObjectFireBall.prototype.Init = function() {
	this.angleRadian = (this.angle * Math.PI)/180;
	//alert(this.angle);
	//alert("Test");
	this.plusX = Math.cos(this.angleRadian);
	this.plusY = Math.sin(this.angleRadian);
}
ObjectFireBall.prototype.Update = function() {
	this.positionX += this.plusX;
	this.positionY -= this.plusY;
}
ObjectFireBall.prototype.Draw = function(d) {
	d.drawImage(document.getElementById(this.spriteID), 0, 0);
}

var ObjectTestNoOffset = function() {
	this.spriteID = "image";
	return this;
}
ObjectTestNoOffset.prototype.Draw = function(d) {
	d.drawImageNoOffset(document.getElementById(this.spriteID), 15, 15)
}