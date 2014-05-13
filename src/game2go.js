//Request AnimationFrame polyfill
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
 
// MIT license
 
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());




















/* Game2Go  **ITSELF**
 * =========================== */


var Game;

(function() { //Mask everything but Game object


Game = function(elem, options) {

//Pretty straightforward variables...
    var self             = this;
    self.options         = options || {}; var options = self.options;
    self.canvas          = elem;
    self.context         = self.canvas.getContext("2d");
    self.width           = self.canvas.offsetWidth;
    self.height          = self.canvas.offsetHeight;
    self.blockSize       = 35;
    self.Draw            = new Draw(self.context, self.blockSize);

    //Backgrounds:
    self.hasFarBackground = false;
    self.hasNormalBackground = true;
    self.hasForeground = false;
    
    self.hasStarted      = false;
    self.frames          = 0;
    self.offsetX         = 0;
    self.offsetY         = 0;
    self.speed           = self.options.speed || 5;
    self.playing         = false;
    
    self.drawBuffer      = [];
    self.worlds          = [];
    self.world           = [];
    self.worldNum        = 0;
    self.scene           = null;
    self.sceneNum        = 0;

    self.timer           = null;
    self.createTime      = new Date();
    self.initTime        = null;
    self.startTime       = null;
    self.lastStartTime   = null;
    self.stopTime        = null;
    this.worldLoadTime   = null;
    self.sceneLoadTime   = null;
    self.drawTimes       = [];
    self.savedBlocks     = {};

    if(!options.Player) {options.Player = {}};
    self.Player          = {
        positionX: options.Player.positionX || 0,
        positionY: options.Player.positionY || 0,
        width:     options.Player.width || self.blockSize,
        height:    options.Player.height || self.blockSize * 2,
        update:    options.Player.update,
        draw:      options.Player.draw
    };


//Register some events
    document.addEventListener("resize", function() {
        self.width = self.canvas.offsetWidth;
        self.height = self.canvas.offsetHeight;
    });

    return self;
}


/* LOOP
 * ==== */

//Start the game
Game.prototype.start = function(sceneID) {
    this.lastStartTime = new Date();
    if(!this.hasStarted) {
        this.startTime = this.lastStartTime;
        this.init(sceneID);
        this.hasStarted = true;
    }

    if(!this.playing) {
        this.playing = true;
        var game = this;
        this.timer = window.requestAnimationFrame(function() {
            game.Loop();
        })
    }

    return this;
}
//Stop the game
Game.prototype.stop = function() {
    this.stopTime = new Date();
    this.playing = false;
    return this;
}
//Initialization on first start()
Game.prototype.init = function(sceneID) {
    this.checkSAT();
    this.initTime = new Date();
    this.sceneNum = (sceneID || 0);
    this.loadScene(this.sceneNum);
    return this;
}
//The main Game Loop
Game.prototype.Loop = function() {

//Update frame
    var START = new Date();
    this.frames++;
    //this.offset.x += this.speed; //For testing purposes.
    this.clearCanvas();
    this.updateBuffer();
    this.updatePlayer();
    this.drawBackgrounds();
    this.drawTerrain();
    this.drawPlayer();
    this.drawForegrounds()
    
    var END = new Date();
    this.drawTimes.push(END - START);

//Request next frame
    if(this.playing) {
        var game = this;
        this.timer = window.requestAnimationFrame(function() {
            game.Loop();
        });
    }

    return this;
}
//Draw the terrain (=blocks)
Game.prototype.drawBackgrounds = function(){
    // Normal Background:
    if(this.scene.normalBackground != null){
        this.context.drawImage(document.getElementById(this.scene.normalBackground),0-this.offset.x,0,820, 420);
        
    }
    // Far       Background:
    if(this.scene.farBackground != null){
        this.context.drawImage(document.getElementById(this.scene.farBackground),0-this.offset.x,0,820, 420);
    }
}
Game.prototype.drawForegrounds = function(){
    if(this.scene.foreground != null){
        this.context.drawImage(document.getElementById(this.scene.foreground),0-this.offset.x,0,820, 420);
    }
}
Game.prototype.drawTerrain = function() {
    var column, i, j, leni, lenj;
    var self = this;
    var h = game.height;

//Loop DrawBuffer
    for(i = this.drawBuffer.length - 1; i >= 0; i--) {
        column = self.drawBuffer[i];

        for(j = column.length - 1; j >= 0; j--) {
//Reuse offsetX and offsetY for memory efficiency
            this.Draw.offsetX = ((i)*this.blockSize) - (this.offset.x % this.blockSize);
            this.Draw.offsetY = h-((j+1)*this.blockSize);
            column[j](this.Draw);
        }
    }

    return this;
}

Game.prototype.updatePlayer = function() {
    var p = this.Player;
    p.update();
    return this;
}
Game.prototype.drawPlayer = function() {
    this.Draw.positionX = this.Player.positionX;
    this.Draw.positionY = this.Player.positionY;
    this.Player.draw(this.Draw);
    return this;
}


/* DRAW UTILITIES */
//Update the drawBuffer
Game.prototype.updateBuffer = function() {
    this.drawBuffer = this.scene.terrain.slice(Math.floor(this.offset.x/this.blockSize), Math.ceil((this.offset.x + this.width)/this.blockSize));
    return this;
}
//Clear the whole canvas
Game.prototype.clearCanvas = function() {
    this.context.clearRect(0, 0, this.width, this.height);
    return this;
}



/* WORLDS 
 * ====== */

//Add a world to the game
Game.prototype.addWorld = function(world) {
    var parsedWorld = this.parseWorld(world);
    this.worlds.push(parsedWorld);
    return this;
}
//Load in a world (=select this world to play)
Game.prototype.loadWorld = Game.prototype.load = function(world) {
    this.stop();
    this.worldLoadTime = new Date();
//The index of the world is given
    if(typeof world === "number") {
        this.world = this.worlds[world];
    }
//The world itself is given
    else {
        var parsedWorld = this.parseWorld(world);
        this.worlds.push(parsedWorld);
        this.world = parsedWorld;
    }
    return this;
}

//Add a scene to the current world
Game.prototype.addScene = function(scene) {
    var parsedScene = this.parseScene(scene)
    this.world.push(parsedScene);
    return this;
}
//Load in a scene (=select this scene to play)
Game.prototype.loadScene = function(scene) {
//Stop the game to avoid corruption
    this.stop();
    this.sceneLoadTime = new Date();
//The index of the game in the world is given
    if(typeof scene === "number") {
        this.scene = this.world[scene];
    }
//The scene object itself is given
    else {
        var parsedScene = this.parseScene(scene);
        this.world.push(parsedScene);
        this.scene = parsedScene;
    }
    return this;
}

//Save a block
Game.prototype.saveBlock = function(name, b) {
    var parsedBlock = this.parseBlock(b);
    this.savedBlocks[name] = parsedBlock;
    return this;
}
Game.prototype.saveBlocks = function(blocks) {
    var parsedBlock;
    for(name in blocks) {
        parsedBlock = this.parseBlock(blocks[name]);
        this.savedBlocks[name] = parsedBlock;
    }
    return this;
}
Game.prototype.checkSAT = function() {
    if(SAT) {
        return true;
    }
    else {
        throw new Error("Make sure SAT.js is provided. You can find it here: https://github.com/jriecken/sat-js");
    }
}



/* UTILS
 * ===== */

//Get the average draw time (of all frames)
Game.prototype.getAverageDrawTime = function() {
    var sum = 0, i;
    for(i = this.drawTimes.length - 1; i >= 0; i--) {
        sum += this.drawTimes[i];
    }
    return (sum / this.drawTimes.length);
}

//Get parsed block
Game.prototype.parseBlock = function(b) {
    switch (typeof b) {
        case "function":
            return b;
            break;
        case "string":
            return this.savedBlocks[b];
            break;
        default:
            return null;
    }
}
Game.prototype.parseColumn = function(c) {
    var parsedColumn = [];
    for(var i = 0, len = c.length; i < len; i++) {
        parsedColumn.push(this.parseBlock(c[i]));
    }
    return parsedColumn;
}
Game.prototype.parseScene = function(s) {
    var parsedScene = [];
    for(var i = 0, len = s.length; i < len; i++) {
        parsedScene.push(this.parseColumn(s[i]));
    }
    return parsedScene;
}
Game.prototype.parseWorld = function(w) {
    var parsedWorld = [];
    for(var i = 0, len = w.length; i < len; i++) {
        parsedWorld.push(this.parseScene(w[i]));
    }
    return parsedWorld;
}




//The main Draw object
//An instance of this object is passed to the block functions
//Draw reflects the Canvas API, but x/y-coordinates are mapped to their right square on the canvas
//This means that every block should draw inside a Draw.blockSize x Draw.blockSize block (which is placed correctly on the canvas by Draw)
var Draw = function(context, blockSize, offsetX, offsetY) {
    var self       = this;
    self.blockSize = blockSize || 35;
    self.context   = context;
    self.offsetX   = offsetX || 0;
    self.offsetY   = offsetY || 0;

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
Draw.prototype.drawImage = Draw.prototype.image = Draw.prototype.img = function(img, sx, sy, sw, sh, dx, dy, dw, dh) {
//All args are given -> a sub-rectangle is specified
    if(dh) {
        dx += this.offsetX;
        dy += this.offsetY;
        this.context.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
    }
//4 args are given -> a (x, y)-coordinate and dimensions are given
    else if(sh) {
        dx = sx + this.offsetX;
        dy = sy + this.offsetY;
        dw = sw;
        dh = sh;
        this.context.drawImage(img, dx, dy, dw, dh);
    }
//2 args are given -> just an (x, y)-coordinate is given
    else if(sy) {
        dx = sx + this.offsetX;
        dy = sy + this.offsetY;
        this.context.drawImage(img, dx, dy);
    }

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





})();