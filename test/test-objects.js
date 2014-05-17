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



var ObjectTestNoOffset = function() {
	this.spriteID = "image";
	return this;
}
ObjectTestNoOffset.prototype.Draw = function(d) {
	d.drawImageNoOffset(document.getElementById(this.spriteID), 15, 15)
}