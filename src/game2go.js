var Game;

//(function() { //Mask everything but Game object


Game = function(elem, options) {
    var self     = this;
    self.options = options;
    self.canvas  = elem;
    self.context = self.canvas.getContext("2d");
    self.Draw    = new Draw(this.context);

    self.drawBuffer      = [];
    self.worlds          = [];
    self.world           = [];
    self.currentLevel    = null;
    self.currentLevelNum = 0;
    self.hasStarted      = false;
    self.frames          = 0;

    self.timer           = null;
    self.createTime      = new Date();
    self.initTime        = null;
    self.startTime       = null;
    self.lastStartTime   = null;
    self.stopTime        = null;
    this.worldLoadTime   = null;
    self.levelLoadTime   = null;

    return self;
}


/* LOOP
 * ==== */

Game.prototype.start = function(levelID) {
    this.lastStartTime = new Date();
    if(!this.hasStarted) {
        this.startTime = this.lastStartTime;
        this.init(levelID);
    }
    this.hasStarted = true;

    var game = this;
    this.timer = setInterval(function() {
        game.Loop.apply(game);
    }, 1000);

    return this;
}
Game.prototype.stop = function() {
    this.stopTime = new Date();
    if(this.timer) clearInterval(this.timer);
    return this;
}
Game.prototype.init = function(levelID) {
    this.initTime = new Date();
    this.currentLevelNum = (levelID || 0);
    this.loadLevel(this.currentLevelNum);
    this.fillBuffer(0);
    return this;
}
Game.prototype.Loop = function() {
    this.frames++;
    console.log("Drawing frame", this.frames);
    this.drawBackground();
    return this;
}
Game.prototype.drawBackground = function() {
    var column, i, j;
    var self = this;
    for(i = self.currentLevel.length - 1; i >= 0; i--) {
        column = self.currentLevel[i];
        for(j = column.length - 1; j >= 0; j--) {
            this.Draw.offsetX = i*20;
            this.Draw.offsetY = j*20;
            column[j](this.Draw);
        }
    }
    return this;
}
Game.prototype.fillBuffer = function(index) {
    if(!index) var index = 0;
    if(!this.currentLevel) {this.currentLevel = this.world[0];}
    this.drawBuffer = this.currentLevel.slice(index, Math.ceil(this.getWidth()/20) + 2);
    return this;
}



/* LEVELS 
 * ====== */

Game.prototype.addWorld = function(world) {
    this.worlds.push(world);
    return this;
}
Game.prototype.load = Game.prototype.loadWorld = function(world) {
    this.stop();
    this.worldLoadTime = new Date();
    if(typeof world === "number") {
        this.world = this.worlds[world];
    }
    else {
        this.worlds.push(world);
        this.world = world;
    }
    return this;
}
Game.prototype.loadLevel = function(level) {
    this.stop();
    this.levelLoadTime = new Date();
    if(typeof level === "number") {
        this.currentLevel = this.world[level];
    }
    else {
        this.world.push(level);
        this.currentLevel = level;
    }
    return this;
}
Game.prototype.addLevel = function(level) {
    this.world.push(level);
    return this;
}



/* UTILS
 * ===== */
Game.prototype.getWidth = function() {
    return this.canvas.offsetWidth;
}
Game.prototype.getHeight = function() {
    return this.canvas.offsetHeight;
}





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