var Game;

//(function() { //Mask everything but Game object


Game = function(elem, options) {
	var self     = this;
	self.options = options;
	self.elem    = elem;
	self.context = self.elem.getContext("2d");
	self.Draw    = new Draw(this.context);

	self.world   = [];
	self.level   = [];
	self.buffer  = [];

}


var Draw = function(context, offsetX, offsetY) {
	this.context = context;
	this.offsetX = offsetX || 0;
	this.offsetY = offsetY || 0;
}

Draw.prototype.fillStyle = function(style) {
	this.context.fillStyle = style;
	return this;
}
Draw.prototype.strokeStyle = function(style) {
	this.context.strokeStyle = style;
	return this;
}
Draw.prototype.strokeWidth = function(width) {
	this.context.strokeWidth = width;
	return this;
}
Draw.prototype.beginPath = function() {
	this.context.beginPath();
	return this;
}
Draw.prototype.endPath = function() {
	this.context.endPath();
	return this;
}
Draw.prototype.stroke = function() {
	this.context.stroke();
	return this;
}
Draw.prototype.fill = function() {
	this.context.fill();
	return this;
}

Draw.prototype.fillRect = function(x, y, w, h) {
	this.context.fillRect(x+this.offsetX, y+this.offsetY, w, h);
	return this;
}
Draw.prototype.strokeRect = function(x, y, w, h) {
	this.context.strokeRect(x+this.offsetX, y+this.offsetY, w, h);
	return this;
}
Draw.rect = function(x, y, w, h) {
	this.strokeRect(x, y, w, h);
	this.fillRect(x, y, w, h);
	return this;
}





//})();