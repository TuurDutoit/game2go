var Game;



(function() { //Mask everything but Game object


Game = function(elem, options) {

//Pretty straightforward variables...
    var self              = this;
    self.options          = options || {}; var options = self.options;
    self.canvas           = elem;
    self.context          = self.canvas.getContext("2d");
    self.width            = self.canvas.offsetWidth;
    self.height           = self.canvas.offsetHeight;
    self.blockSize        = options.blockSize || 35;
    self.Draw             = new Draw(self.context, self.blockSize);
    
    self.frames           = 0;
    self.offsetX          = 0;
    self.offsetY          = 0;
    self.playing          = false;
    self.hadInit          = false;

    self.world            = null;
    self.scene            = null;
    self.sceneNum         = 0;
    self.terrainBuffer    = [];
    self.terrainColliders = [];
    self.objectColliders  = [];
    self.gameHeight       = 0;

    self.timer            = null;
    self.createTime       = this.getTime();
    self.initTime         = null;
    self.startTime        = null;
    self.lastStartTime    = null;
    self.stopTime         = null;
    self.worldLoadTime    = null;
    self.sceneLoadTime    = null;
    self.drawTimes        = [];
    self.savedBlocks      = {};
    
    self.Player = self.options.Player || {};
    if(!self.Player.positionX) self.Player.positionX = 0;
    if(!self.Player.positionY) self.Player.positionY = 0;
    if(!self.Player.width)     self.Player.width = self.blockSize;
    if(!self.Player.height)    self.Player.height = self.blockSize;


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
        this.lastStartTime = this.getTime();
        this.requestLoop();
    }

    return this;
}
//Stop the game
Game.prototype.stop = function() {
    this.stopTime = this.getTime();
    this.playing = false;
    return this;
}
//Initialization on first start()
Game.prototype.init = function(sceneID) {
    this.checkSAT();
    this.initTime = this.getTime();
    this.sceneNum = (sceneID || 0);
    this.loadScene(this.sceneNum);
    return this;
}
//The main Game Loop
Game.prototype.Loop = function() {

//Update frame
    var START = this.getTime();

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
    
    this.drawTimes.push(this.getTime() - START);
    this.requestLoop();

    return this;
}

//Functions used by Loop
Game.prototype.updatePlayer = function() {
    this.Player.Update(this);
    return this;
}
Game.prototype.drawPlayer = function() {
    this.Draw.offsetX = this.Player.positionX;
    this.Draw.offsetY = this.height - this.Player.positionY - (this.Player.height || this.blockSize);
    this.Player.Draw(this.Draw);
    return this;
}
Game.prototype.initObjects = function() {
    var objects = this.scene.Objects;
	for(var i = 0, len = objects.length; i < len; i++) {
        if(objects[i].Init) {
            objects[i].Init();
        }
	}
	return this;
}
Game.prototype.updateObjects = function() {
    var objects = this.scene.Objects;
	for(var i = 0, len = objects.length; i < len; i++) {
        if(objects[i].Update) {
            if(objects[i].Update()){
                objects.splice(i, 1);
            }
        }
	}
	return this;
}
Game.prototype.drawObjects = function() {
    var objects = this.scene.Objects;
	for(var i = 0, len = objects.length; i < len; i++) {
        if(objects[i].Draw) {
            var object = objects[i];
            this.Draw.offsetX = -this.offsetX + object.positionX;
            this.Draw.offsetY = this.height - (object.positionY - this.offsetY) - (object.height || this.blockSize);
            object.Draw(this.Draw);
        }
	}
    return this;
}

Game.prototype.updateTerrain = function() {
    this.terrainBuffer = this.scene.Terrain.slice(Math.floor(this.offsetX/this.blockSize), Math.ceil((this.offsetX + this.width)/this.blockSize));
    return this;
}
Game.prototype.drawTerrain = function() {
    var column, i, j, leni, lenj;
    var h = game.height;

//Loop terrainBuffer
    for(i = this.terrainBuffer.length - 1; i >= 0; i--) {
        column = this.terrainBuffer[i];

        for(j = column.length - 1; j >= 0; j--) {
//Reuse offsetX and offsetY for memory efficiency
            this.Draw.offsetX = (i*this.blockSize) - (this.offsetX % this.blockSize);
            this.Draw.offsetY = h-((j+1)*this.blockSize) + this.offsetY;
            column[j].Draw(this.Draw);
        }
    }

    return this;
}

//Draw the terrain (=blocks)
Game.prototype.drawBackgrounds = function(){
//Check if any backgrounds are given
    if(this.scene.Backgrounds instanceof Array) {
        var backgrounds = this.scene.Backgrounds;
        for(var i = 0, len = backgrounds.length; i < len; i++) {
            var b = backgrounds[i];
            this.Draw.offsetX = -this.offsetX + (b.positionX || 0);
            this.Draw.offsetY = this.height - ((b.positionY || 0) - this.offsetY) - (b.height || 0);
            b.Draw(this.Draw);
        }
    }
    return this;
}
Game.prototype.drawForegrounds = function(){
//Check if any backgrounds are given
    if(this.scene.Foregrounds instanceof Array) {
        var foregrounds = this.scene.Foregrounds;
        for(var i = 0, len = foregrounds.length; i < len; i++) {
            var f = foregrounds[i];
            this.Draw.offsetX = -this.offsetX + (f.positionX || 0);
            this.Draw.offsetY = this.height - ((f.positionY || 0) - this.offsetY) - (f.height || 0);
            f.Draw(this.Draw);
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
    var terrain = this.scene.Terrain;
    var colliders = [];
    var w = this.blockSize;
    var column, j;

    for(var i = 0, len = terrain.length; i < len; i++) {
        column = terrain[i];
        var columnColliders = [];
        for(var j = 0, lenj = column.length; j < lenj; j++) {
            var block = column[j];
            if(block.collider) {
                columnColliders.push(block.collider);
            }
            else if(block && block.hasCollider !== false) {
                var x = i * w;
                var y = j * w;
                columnColliders.push(new SAT.Box(new SAT.Vector(x, y), w, w).toPolygon());
            }
        }

        colliders.push(columnColliders);
    }

    this.terrainColliders = colliders;
    return this;
}

Game.prototype.updateObjectColliders = function() {
    var colliders = [];
    var objects = this.scene.Objects;
    
    for(var i = 0, len = objects.length; i < len; i++) {
        var object = objects[i];
        if(object.collider) {
            colliders.push(object.collider);
        }
        else if(object.hasCollider !== false) {
            var collider = new SAT.Box( new SAT.Vector(object.x, object.y), object.width, object height);
            colliders.push(collider);
        }
    }
    
    this.objectColliders = colliders;
    return this;
}

Game.prototype.getTerrainColliders = function(x, w) {
    var columns = this.terrainColliders.slice(Math.floor(x / this.blockSize), Math.ceil((x + w) / this.blockSize));
    var colliders = this.flattenMatrix(columns);

    return colliders;
}
Game.prototype.getTerrainCollidersObject = function(object) {
    return this.getTerrainColliders(object.positionX, object.width);
}

Game.prototype.checkCollision = function(A, B, res) {
    if(A instanceof SAT.Box) var A = A.toPolygon();
    if(B instanceof SAT.Box) var B = B.toPolygon();

    if(A instanceof SAT.Polygon) {
        if(B instanceof SAT.Polygon) {
            return SAT.testPolygonPolygon(A, B, res);
        }
        else {
            return SAT.testPolygonCircle(A, B, res);
        }
    }
    else if(A instanceof SAT.Circle) {
        if(B instanceof SAT.Polygon) {
            return SAT.testCirclePolygon(A, B, res);
        }
        else {
            return SAT.testCircleCircle(A, B, res);
        }
    }
}
Game.prototype.checkCollisionAll = function(A, B, cb) {
    var result = [];
    for(var i = 0, len = B.length; i < len; i++) {
        var collider = B[i];
        var res = new SAT.Response();
        if(this.checkCollision(A, collider, res)) {
            result.push(res);
            if(cb) {
                cb(res);
            }
        }
    }

    return result;
}


/* SAT Methods and Constructors */
Game.prototype.Vector  = SAT.Vector;
Game.prototype.Polygon = SAT.Polygon;
Game.prototype.Circle  = SAT.Circle;
Game.prototype.Box     = SAT.Box;

Game.prototype.testPolygonPolygon = SAT.testPolygonPolygon;
Game.prototype.testCirclePolygon  = SAT.testCirclePolygon;
Game.prototype.testPolygonCircle  = SAT.testPolygonCircle;
Game.prototype.testCircleCircle   = SAT.testCircleCircle;












/* WORLDS 
 * ====== */

//Load in a world (=select this world to play)
Game.prototype.loadWorld = Game.prototype.load = function(world) {
    this.stop();
    this.reset();
    this.worldLoadTime = this.getTime();

    this.world = world;
    this.loadScene(0);

    return this;
}
Game.prototype.addWorld = function(world) {
    this.world = world;
    return this;
}

//Add a scene to the current world
Game.prototype.addScene = function(scene) {
    this.world.push(scene);
    return this;
}
//Load in a scene (=select this scene to play)
Game.prototype.loadScene = function(scene) {
//Stop the game to avoid corruption
    this.stop();
    this.reset();
    this.sceneLoadTime = this.getTime();

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

    this.updateGameHeight();
    this.updateGameWidth();
    this.updateTerrainColliders();
    this.initObjects();

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

Game.prototype.updateGameHeight = function() {
    this.gameHeight = this.getHighestColumnLength() * this.blockSize;
    return this;
}
Game.prototype.updateGameWidth = function() {
    this.gameWidth = this.scene.Terrain.length * this.blockSize;
    return this;
}



/* UTILS
 * ===== */

//Request an AnimationFrame
Game.prototype.requestLoop = function() {
    if(this.playing) {
        var game = this;
        requestAnimationFrame(function() {
            game.Loop();
        });
    }
    return this;
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

Game.prototype.reset = function() {
    this.offsetX          = 0;
    this.offsetY          = 0;
    this.terrainBuffer    = [];
    this.scene            = [];
    this.terrainColliders = [];
    this.objectColliders  = [];
    this.gameHeight       = 0;
    this.gameWidth        = 0;
    
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

//Get the average draw time (of all frames)
Game.prototype.getAverageDrawTime = function() {
    var sum = 0;
    for(var i = this.drawTimes.length - 1; i >= 0; i--) {
        sum += this.drawTimes[i];
    }
    return (sum / this.drawTimes.length);
}




/* MISCELLEANOUS
 * ============= */
Game.prototype.cloneObject = function(obj) {
    var newObj = {};
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
Game.prototype.flattenMatrix = function(m) {
    var array = [];
    for(var i = 0, len = m.length; i < len; i++) {
        array = array.concat(m[i]);
    }
    return array;
}
Game.prototype.getArray = function(length, value) {
    var arr = [];
    for(var i = 0; i < length; i++) {
        arr.push(value);
    }
    return arr;
}
Game.prototype.getTime = function() {
    if(window.performance && window.performance.now) {
        return window.performance.now();
    }
    else {
        return new Date();
    }
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
Draw.prototype.drawImageNoOffset = function() {
    this.context.drawImage.apply(this.context, arguments);

    return this;
}


/* NOT IMPLEMETED in Draw
 * ==============*/
 //->Security
     //.rotate()
     //.translate()
     //.scale()
     //.scrollPathIntoView()
 //->Too complex/not enough time --> I'll look into them!
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
 //.drawImageNoOffset()











//Request AnimationFrame polyfill
//Adapted from:

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license

var requestAnimationFrame, cancelAnimationFrame;
var lastTime = 0;
var vendors = ['ms', 'moz', 'webkit', 'o'];
for(var x = 0; x < vendors.length && !requestAnimationFrame; ++x) {
    requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
}
if (!requestAnimationFrame) {
    requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
          timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };
}
if (!cancelAnimationFrame) {
    cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };
}


})();
