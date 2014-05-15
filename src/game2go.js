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
    self.blockSize       = options.blockSize || 35;
    self.Draw            = new Draw(self.context, self.blockSize);
    
    self.frames          = 0;
    self.offsetX         = 0;
    self.offsetY         = 0;
    self.playing         = false;
    self.hadInit         = false;

    self.terrainBuffer   = [];
    self.world           = [];
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

    self.terrainMatrix    = [];
    self.terrainColliders = [];

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
    if(!this.hadInit) {
        this.init(sceneID);
        this.hadInit = true;
    }

    if(!this.playing) {
        this.playing = true;
        this.lastStartTime = new Date();
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
    this.updatePlayer();
    this.updateObjects();
    this.updateTerrain();
    this.clearCanvas();
    this.drawBackgrounds();
    this.drawTerrain();
    this.drawObjects();
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

//Functions used by Loop
Game.prototype.updatePlayer = function() {
    this.Player.update(this);
    if(this.offsetX < 0) {
        this.offsetX = 0;
    }
    if(this.offsetY < 0) {
        this.offsetY = 0;
    }
    return this;
}
Game.prototype.drawPlayer = function() {
    this.Draw.offsetX = this.Player.positionX;
    this.Draw.offsetY = this.Player.positionY;
    this.Player.draw(this.Draw);
    return this;
}

Game.prototype.updateObjects = function() {
    //Nothing in here, yet

    return this;
}
Game.prototype.drawObjects = function() {
    //Nothing in here, yet

    return this;
}

Game.prototype.updateTerrain = function() {
    this.terrainBuffer = this.scene.Terrain.slice(Math.floor(this.offsetX/this.blockSize), Math.ceil((this.offsetX + this.width)/this.blockSize));
    return this;
}
Game.prototype.drawTerrain = function() {
    var column, i, j, leni, lenj;
    var self = this;
    var h = game.height;

//Loop terrainBuffer
    for(i = self.terrainBuffer.length - 1; i >= 0; i--) {
        column = self.terrainBuffer[i];

        for(j = column.length - 1; j >= 0; j--) {
//Reuse offsetX and offsetY for memory efficiency
            this.Draw.offsetX = (i*this.blockSize) - (this.offsetX % this.blockSize);
            this.Draw.offsetY = h-((j+1)*this.blockSize) + this.offsetY;
            column[j].draw(this.Draw);
        }
    }

    return this;
}

//Draw the terrain (=blocks)
Game.prototype.drawBackgrounds = function(){
    if(this.scene.Backgrounds instanceof Array) {
        var b = this.scene.Backgrounds;
        for(var i = 0, len = b.length; i < len; i++) {
            this.Draw.offsetX = -this.offsetX;
            this.Draw.offsetY = this.offsetY;
            b[i](this.Draw);
        }
    }
    return this;
}
Game.prototype.drawForegrounds = function(){
    if(this.scene.Foregrounds instanceof Array) {
        var f = this.scene.Foregrounds;
        for(var i = 0, len = f.length; i < len; i++) {
            this.Draw.offsetX = -this.offsetX;
            this.Draw.offsetY = this.offsetY;
            f[i](this.Draw);
        }
    }
    return this;
}

Game.prototype.clearCanvas = function() {
    this.context.clearRect(0, 0, this.width, this.height);
    return this;
}





/* COLLIDERS
 * ========= */

Game.prototype.updateTerrainColliders = function() {
//this.terrainColliders conatins an array of SAT.Polygons
    this.updateTerrainMatrix();
    this.terrainColliders = this.getTerrainColliders();
    return this;
}
Game.prototype.updateTerrainMatrix = function() {
    var terrainMatrix = [];
    var highest = this.getHighestColumnLength();
    var terrain = this.scene.Terrain;

    for(var i = 0, len = terrain.length; i < len; i++) {
        var column = terrain[i];
        var columnMatrix = [];

        for(var j = 0; j < highest; j++) {
            if(column[j] && column[j].hasCollider !== false) {
                columnMatrix.push(true);
            }
            else {
                columnMatrix.push(false);
            }
        }
        terrainMatrix.push(columnMatrix);
    }

    this.terrainMatrix = terrainMatrix;
    return this;
}
Game.prototype.surroundMatrix = function(matrix, val) {
    var m = this.cloneMatrix(matrix);
    var height = this.getHighestColumnLength(matrix) + 2;
    var extraColumn = this.getArray(height, val);

    for(var i = 0, len = m.length; i < len; i++) {
        m[i].unshift(val);
        m[i].push(val);
    }
    m.unshift(extraColumn);
    m.push(extraColumn);

    return m;
}
Game.prototype.getTerrainColliders = function(tm) {
//Get colliders from terrainMatrix (tm)
	var tm = this.terrainMatrix;
	var FalseSurround = this.surroundMatrix(tm, false);
	var TrueSurround = this.surroundMatrix(tm, true);
    var ColliderPoints = tm;
    for(var x = 1, len = tm.length - 1; x < len; x++) {
        for(var y = 1; y < len; y++){
			ColliderPoints[x - 1][y - 1] = false;
            if(FalseSurround[x + 1][y] == false){
                if(FalseSurround[x][y + 1] == false){
                    ColliderPoints[x + 1 - 1][y + 1 - 1] = true;
                }
                if(FalseSurround[x][y - 1] == false){
                    ColliderPoints[x + 1 - 1][y - 1] = true;
                }
            }
            if(FalseSurround[x - 1][y] == false){
                if(FalseSurround[x][y + 1] == false){
                    ColliderPoints[x - 1][y + 1 - 1] = true;
                }
                if(FalseSurround[x][y - 1] == false){
                    ColliderPoints[x - 1][y - 1] = true;
                }
            }
            if(TrueSurround[x + 1][y + 1] == false){
                ColliderPoints[x - 1][y - 1] = true;
            }
            if(TrueSurround[x + 1][y - 1] == false){
                ColliderPoints[x - 1][y - 1] = true;
            }
            if(TrueSurround[x - 1][y - 1] == false){
                ColliderPoints[x - 1][y - 1] = true;
            }
            if(TrueSurround[x - 1][y + 1] == false){
                ColliderPoints[x - 1][y - 1] = true;
            } 
        }
    }
    /**for(var x = 1, len = tm.length - 1; x < len; x++) {
        for(var y = 1; y < len; y++){
            if(tm[x + 1][y] == false){
                if(tm[x][y + 1] == false){
                    ColliderPoints[x + 1][y + 1] = true;
                }
                if(tm[x][y - 1] == false){
                    ColliderPoints[x + 1][y] = true;
                }
            }
            if(tm[x - 1][y] == false){
                if(tm[x][y + 1] == false){
                    ColliderPoints[x][y + 1] = true;
                }
                if(tm[x][y - 1] == false){
                    ColliderPoints[x][y] = true;
                }
            }
            if(tm[x + 1][y + 1] == false){
                ColliderPoints[x][y] = true;
            }
            if(tm[x + 1][y - 1] == false){
                ColliderPoints[x][y] = true;
            }
            if(tm[x - 1][y - 1] == false){
                ColliderPoints[x][y] = true;
            }
            if(tm[x - 1][y + 1] == false){
                ColliderPoints[x][y] = true;
            } 
        }
    }**/
	alert(ColliderPoints[0][0]);
	alert(ColliderPoints[0][1]);
	alert(ColliderPoints[0][2]);
	alert(ColliderPoints[0][3]);
    return [];
}











/* WORLDS 
 * ====== */

//Load in a world (=select this world to play)
Game.prototype.loadWorld = Game.prototype.load = function(world) {
    this.stop();
    this.reset();
    this.worldLoadTime = new Date();

    this.world = world;
    this.loadScene(0);

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
    this.reset();
    this.sceneLoadTime = new Date();

//The index of the game in the world is given
    if(typeof scene === "number") {
        var parsedScene = this.parseScene(this.world.Scenes[scene]);
        this.scene = parsedScene;
    }
//The scene object itself is given
    else {
        var parsedScene = this.parseScene(scene);
        this.world.Scenes.push(parsedScene);
        this.scene = parsedScene;
    }

    this.updateTerrainColliders();

    return this;
}

//Save a block
Game.prototype.saveBlock = function(name, b) {
    this.savedBlocks[name] = b;
    return this;
}
Game.prototype.saveBlocks = function(blocks) {
    for(name in blocks) {
        this.savedBlocks[name] = blocks[name];
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
Game.prototype.getHighestColumnLength = function(matrix) {
    var highestColumnLength = 0;
    var t = matrix || this.scene.Terrain;
    for(var i = 0, len = t.length; i < len; i++) {
        if(t[i].length > highestColumnLength) {
            highestColumnLength = t[i].length;
        }
    }
    return highestColumnLength;
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
        case "object":
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
        var parsedBlock = this.parseBlock(c[i]);
        parsedColumn.push(parsedBlock);
    }
    return parsedColumn;
}
Game.prototype.parseScene = function(s) {
    var parsedScene = this.cloneObject(s);
    parsedScene.Terrain = [];
    for(var i = 0, len = s.Terrain.length; i < len; i++) {
        parsedScene.Terrain.push(this.parseColumn(s.Terrain[i]));
    }
    return parsedScene;
}

Game.prototype.cloneObject = function(obj) {
    var newObj = new Object();
    for(key in obj) {
        newObj[key] = obj[key];
    }
    return newObj;
}
Game.prototype.cloneArray = function(arr) {
    return arr.slice(0);
}
Game.prototype.cloneMatrix = function(m) {
    return m.map(function(arr) {return arr.slice(0)});
}
Game.prototype.getArray = function(length, value) {
    var arr = [];
    for(var i = 0; i < length; i++) {
        arr.push(value);
    }
    return arr;
}

Game.prototype.reset = function() {
    this.offsetX          = 0;
    this.offsetY          = 0;
    this.terrainBuffer    = [];
    this.scene            = [];
    this.terrainMatrix    = [];
    this.terrainColliders = [];
    
    this.Player           = {
        positionX: options.Player.positionX || 0,
        positionY: options.Player.positionY || 0,
        width:     options.Player.width || self.blockSize,
        height:    options.Player.height || self.blockSize * 2,
        update:    options.Player.update,
        draw:      options.Player.draw
    };

    return this;
}



//The main Draw object
//An instance of this object is passed to the block functions
//Draw reflects the Canvas API, but x/y-coordinates are mapped to their right square on the canvas
//This means that every block should draw inside a Draw.blockSize x Draw.blockSize block (which is placed correctly on the canvas by Draw)
var Draw = function(context, blockSize, offsetX, offsetY) {
    var self       = this;
    self.context   = context;
    self.offsetX   = offsetX || 0;
    self.offsetY   = offsetY || 0;
    self.blockSize = blockSize || 35;

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
    if(typeof dh === "number") {
        dx += this.offsetX;
        dy += this.offsetY;
        this.context.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
    }
//4 args are given -> a (x, y)-coordinate and dimensions are given
    else if(typeof sh === "number") {
        dx = sx + this.offsetX;
        dy = sy + this.offsetY;
        dw = sw;
        dh = sh;
        this.context.drawImage(img, dx, dy, dw, dh);
    }
//2 args are given -> just an (x, y)-coordinate is given
    else if(typeof sy === "number") {
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