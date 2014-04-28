var Game;

//(function() { //Mask everything but Game object


Game = function(elem, options) {
	var self     = this;
	self.options = options;
	self.elem    = elem;
	self.context = self.elem.getContext("2d");
	//self.Draw    = new Draw(this.context);

	self.world   = [];
	self.level   = [];
	self.buffer  = [];

}




//})();