var ObjectTest;

ObjectTest = function(){
	var self = this;
	self.sprite = "image";
	self.positionX = 0;
	self.positionY = 0;
	return self;
}
ObjectTest.prototype.Init = function() {
}
ObjectTest.prototype.Update = function() {
}
ObjectTest.prototype.Draw = function(D, OffsetX, OffsetY) {
	D.drawImage(document.getElementById(this.sprite), this.positionX, this.positionY);
}