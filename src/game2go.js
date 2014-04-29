var Game;

//(function() { //Mask everything but Game object


//The main Game constructor
Game = function(elem, options) {
//Pretty straightforward variables...
    var self     = this;
    self.options = options || {};
    self.canvas  = elem;
    self.context = self.canvas.getContext("2d");
    self.Draw    = new Draw(this.context);

    self.hasStarted      = false;
    self.frames          = 0;
    self.offset          = 0;
    self.refreshRate     = self.options.refreshRate || 16;
    self.speed           = self.options.speed || 5;
    
    self.drawBuffer      = [];
    self.worlds          = [];
    self.world           = [];
    self.worldNum        = 0;
    self.level           = null;
    self.levelNum        = 0;

    self.timer           = null;
    self.createTime      = new Date();
    self.initTime        = null;
    self.startTime       = null;
    self.lastStartTime   = null;
    self.stopTime        = null;
    this.worldLoadTime   = null;
    self.levelLoadTime   = null;
    self.drawTimes       = [];

    return self;
}


/* LOOP
 * ==== */

//Start the game
Game.prototype.start = function(levelID) {
    this.lastStartTime = new Date();
    if(!this.hasStarted) {
        this.startTime = this.lastStartTime;
        this.init(levelID);
    }
    this.hasStarted = true;

    if(!this.timer) {
        var game = this;
        this.timer = setInterval(function() {
            game.Loop.apply(game);
        }, this.refreshRate);
        game.Loop();
    }

    return this;
}
//Stop the game
Game.prototype.stop = function() {
    this.stopTime = new Date();
    clearInterval(this.timer);
    this.timer = null;
    return this;
}
//Initialization on first start()
Game.prototype.init = function(levelID) {
    this.initTime = new Date();
    this.levelNum = (levelID || 0);
    this.loadLevel(this.levelNum);
    return this;
}
//The main Game Loop
Game.prototype.Loop = function() {
    var START = new Date();
    this.frames++;
    this.offset += this.speed;
    this.clearCanvas();
    this.updateBuffer();
    this.drawBackground();
    var END = new Date();
    this.drawTimes.push(END - START);
    return this;
}
//Draw the background (=blocks)
Game.prototype.drawBackground = function() {
    var column, i, j, leni, lenj;
    var self = this, h = game.getHeight();

//Loop drawBuffer
    leni = self.drawBuffer.length;
    for(i = 0; i < leni; i++) {
        column = self.drawBuffer[i];
        lenj = column.length;
        for(j = 0; j < lenj; j++) {
//Reuse offsetX and offsetY for memory efficiency
            this.Draw.offsetX = ((i)*20) - (this.offset % 20);
            this.Draw.offsetY = h-((j+1)*20);
            column[j](this.Draw);
        }
    }
    return this;
}
//Update the drawBuffer
Game.prototype.updateBuffer = function() {
    if(!this.level) {this.level = this.world[this.levelNum || 0];}
    this.drawBuffer = this.level.slice(Math.floor(this.offset/20), Math.ceil((this.offset + this.getWidth())/20));
    return this;
}
//Clear the whole canvas
Game.prototype.clearCanvas = function() {
    this.context.clearRect(0, 0, this.getWidth(), this.getHeight());
    return this;
}



/* LEVELS 
 * ====== */

//Add a world to the game
Game.prototype.addWorld = function(world) {
    this.worlds.push(world);
    return this;
}
//Load in a world (=select this world to play)
Game.prototype.load = Game.prototype.loadWorld = function(world) {
    this.stop();
    this.worldLoadTime = new Date();
//The index of the world is given
    if(typeof world === "number") {
        this.world = this.worlds[world];
    }
//The world itself is given
    else {
        this.worlds.push(world);
//Select last added world
        this.world = this.worlds.slice(-1)[0];
    }
    return this;
}
//Load in a level (=select this level to play)
Game.prototype.loadLevel = function(level) {
//Stop the game to avoid corruption
    this.stop();
    this.levelLoadTime = new Date();
//The index of the game in the world is given
    if(typeof level === "number") {
        this.level = this.world[level];
    }
//The level object itself is given
    else {
        this.world.push(level);
        this.level = level;
    }
    return this;
}
//Add a level to the current world
Game.prototype.addLevel = function(level) {
    this.world.push(level);
    return this;
}



/* UTILS
 * ===== */

//Get the width of the canvas
//CAUTION: this includes border and padding!
Game.prototype.getWidth = function() {
    return this.canvas.offsetWidth;
}
//Get the height of the canvas
//CAUTION: this includes border and padding!
Game.prototype.getHeight = function() {
    return this.canvas.offsetHeight;
}
//Get the average draw time (of all frames)
Game.prototype.getAverageDrawTime = function() {
    var sum = 0, len = this.drawTimes.length;
    for(var i = 0; i < len; i++) {
        sum += this.drawTimes[i];
    }
    return (sum / len);
}




//The main Draw object
//An instance of this object is passed to the block functions
//Draw reflects the Canvas API, but x/y-coordinates are mapped to their right square on the canvas
//This means that every block should draw inside a 20x20 block (which is placed correctly on the canvas by Draw)
var Draw = function(context, offsetX, offsetY) {
    var self     = this;
    this.context = context;
    this.offsetX = offsetX || 0;
    this.offsetY = offsetY || 0;

    return self;
}

Draw.prototype.beginPath = function() {
    this.context.beginPath();
    return this;
}
Draw.prototype.closePath = function() {
    this.context.closePath();
    return this;
}
Draw.prototype.moveTo = function(x, y) {
    this.context.moveTo(x, y);
    return this;
}
Draw.prototype.save = function() {
    this.context.save();
    return this;
}
Draw.prototype.restore = function() {
    this.context.restore();
    return this;
}
Draw.prototype.clip = function() {
    this.context.clip();
    return this;
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
Draw.prototype.stroke = function() {
    this.context.stroke();
    return this;
}
Draw.prototype.fill = function() {
    this.context.fill();
    return this;
}
Draw.prototype.clearRect = function(x, y, w, h) {
    this.context.clearRect(x+this.offsetX, y+this.offsetY, w, h);
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
Draw.prototype.fullRect = function(x, y, w, h) {
    this.strokeRect(x+this.offsetX, y+this.offsetY, w, h);
    this.fillRect(x+this.offsetX, y+this.offsetY, w, h);
    return this;
}

Draw.prototype.lineTo = function(x, y) {
    this.context.lineTo(x+this.offsetX, y+this.offsetY);
    return this;
}
Draw.prototype.rect = function(x, y, w, h) {
    this.context.rect(x+this.offsetX, y+this.offsetY, w, h);
    return this;
}
Draw.prototype.arc = function(x, y, r, sa, ea, ac) {
    this.context.arc(x+this.offsetX, y+this.offsetY, r, sa, ea, ac);
    return this;
}
Draw.prototype.arcTo = function(x1, y1, x2, y2, r) {
    this.context.arcTo(x1+this.offsetX, y1+this.offset.Y, x2+this.offsetX, y2+this.offsetY, r);
    return this;
}
Draw.prototype.bezierCurveTo = function(x1, y1, x2, y2, x3, y3) {
    this.context.bezierCurveTo(x1+this.offsetX, y1+this.offset.Y, x2+this.offsetX, y2+this.offsetY, x3+this.offsetX, y3+this.offsetY);
    return this;
}
Draw.prototype.quadraticCurveTo = function(x1, y1, x2, y2) {
    this.context.quadraticCurveTo(x1+this.offsetX, y1+this.offset.Y, x2+this.offsetX, y2+this.offsetY);
    return this;
}

Draw.prototype.fillText = function(text, x, y, maxw) {
    this.context.fillText(text, x+this.offsetX, y+this.offsetY, maxw);
    return this;
}
Draw.prototype.strokeText = function(text, x, y, maxw) {
    this.context.strokeText(text, x+this.offsetX, y+this.offsetY, maxw);
    return this;
}
Draw.prototype.fullText = function(text, x, y, maxw) {
    this.fillText(text, x+this.offsetX, y+this.offsetY, maxw);
    this.strokeText(text, x+this.offsetX, y+this.offsetY, maxw);
    return this;
}


/* NOT IMPLEMETED
 * ==============*/
 //->Security
     //.rotate()
     //.translate()
     //.scale()
     //.scrollPathIntoView()
 //->Too complex/not enough time --> look into them!
 //TODO
     //.createImageData()
     //.createLinearGradient()
     //.createRadialGradient()
     //.createPattern()
     //.drawCustomFocusRing()
     //.drawSystemFocusRing()
     //.drawImage()
     //.getImageData()
     //.getLineDash()
     //.isPointInPath()
     //.isPointInStroke()
     //.measureText()
     //.putImageData()
     //.setLineDash()
     //.setTransform()

/* EXTRA
 * =====*/

 //.fullRect()
 //.fullText()





//})();