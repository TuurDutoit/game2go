var ObjectTest = function(){
	this.sprite = "image";
	return this;
}
ObjectTest.prototype.Init = function() {
	this.positionX = 15;
	this.positionY = 15;
}
ObjectTest.prototype.Update = function() {
	this.positionX += 1;
}
ObjectTest.prototype.Draw = function(d) {
	d.drawImage(document.getElementById(this.sprite), 0, 0);
}