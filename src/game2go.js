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
    self.blockSize        = options.blockSize || 36;
    self.gravity          = options.gravity   || 10;
    self.maxGravitySpeed  = options.maxGravitySpeed || 50;
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
    self.gameWidth        = 0;

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
    self.animations       = {};
    self._events          = {};
    
    self.Player = self.options.Player || {};
    if(!self.Player.positionX) self.Player.positionX = 0;
    if(!self.Player.positionY) self.Player.positionY = 0;
    if(!self.Player.width)     self.Player.width = self.blockSize;
    if(!self.Player.height)    self.Player.height = self.blockSize;


//Register some events
    document.addEventListener("resize", function(e) {
        self.emit("beforeresize", [self, e]);
        self.width = self.canvas.offsetWidth;
        self.height = self.canvas.offsetHeight;
        self.emit("resize", [self, e]);
    });

    return self;
}


/* LOOP
 * ==== */

//Start the game
Game.prototype.start = function(sceneID) {
    this.emit("beforestart", [this, arguments]);
    if(!this.hadInit) {
        this.init(sceneID);
        this.hadInit = true;
    }

    if(!this.playing) {
        this.emit("beforeplay", [this, arguments]);
        this.playing = true;
        this.lastStartTime = this.getTime();
        this.requestLoop();
        this.emit("play", [this, arguments]);
    }
    this.emit("start", [this, arguments]);

    return this;
}
//Stop the game
Game.prototype.stop = function() {
    this.emit("beforestop", [this]);
    this.stopTime = this.getTime();
    this.playing = false;
    this.emit("stop", [this]);
    return this;
}
//Initialization on first start()
Game.prototype.init = function(sceneID) {
    this.checkSAT();
    this.emit("beforeinit", [this, arguments]);
    this.initTime = this.getTime();
    this.sceneNum = (sceneID || 0);
    this.loadScene(this.sceneNum);
    this.emit("init", [this, arguments]);
    return this;
}
//The main Game Loop
Game.prototype.Loop = function() {

//Update frame
    var START = this.getTime();
    this.emit("beforeframe", [this]);

    this.frames++;
    this.updatePlayer();
    this.updateObjects();
    this.updateTerrain();
    this.clearCanvas();
    this.drawBackgrounds();
    this.drawTerrain();
    this.drawObjects();
    this.drawPlayer();
    this.drawForegrounds();
    this.drawTimes.push(this.getTime() - START);
    this.emit("frame", [this]);
    this.requestLoop();

    return this;
}

//Functions used by Loop
Game.prototype.initPlayer = function() {
    this.emit("beforeinitplayer", [this]);
    if(this.Player.Init) this.Player.Init(this);
    this.emit("initplayer", [this]);
    return this;
}
Game.prototype.updatePlayer = function() {
    this.emit("beforeupdateplayer", [this]);
    this.Player.Update(this);
    this.emit("updateplayer", [this]);
    return this;
}
Game.prototype.drawPlayer = function() {
    this.emit("beforedrawplayer", [this]);
    this.Draw.offsetX = this.Player.positionX;
    this.Draw.offsetY = this.height - this.Player.positionY - (this.Player.height || this.blockSize);
    this.Player.Draw(this.Draw);
    this.emit("drawplayer", [this]);
    return this;
}
Game.prototype.initObjects = function() {
    this.emit("beforeinitobjects", [this]);
    var objects = this.scene.Objects;
   	for(var i = 0, len = objects.length; i < len; i++) {
        if(objects[i].Init) {
            objects[i].Init(this);
        }
	   }
	   this.emit("initobjects", [this]);
	   return this;
}
Game.prototype.updateObjects = function() {
    this.emit("beforeupdateobjects", [this]);
    var objects = this.scene.Objects;
   	for(var i = 0, len = objects.length; i < len; i++) {
        if(objects[i].Update) {
            if(objects[i].Update(this)){
                objects.splice(i, 1);
            }
        }
	   }
	   this.emit("updateobjects", [this]);
       this.emit("beforeupdateobjectcolliders", [this]);
       this.updateObjectColliders();
       this.emit("updateobjectcolliders", [this]);
	   return this;
}
Game.prototype.drawObjects = function() {
    this.emit("beforedrawobjects", [this]);
    var objects = this.scene.Objects;
	   for(var i = 0, len = objects.length; i < len; i++) {
        if(objects[i].Draw) {
            var object = objects[i];
            this.Draw.offsetX = -this.offsetX + object.positionX;
            this.Draw.offsetY = this.height - (object.positionY - this.offsetY) - (object.height || this.blockSize);
            object.Draw(this.Draw);
        }
   	}
   	this.emit("drawobjects", [this]);
    return this;
}

Game.prototype.updateTerrain = function() {
    this.emit("beforeupdateterrain", [this]);
    this.terrainBuffer = this.scene.Terrain.slice(Math.floor(this.offsetX/this.blockSize), Math.ceil((this.offsetX + this.width)/this.blockSize));
    this.emit("updateterrain", [this]);
    return this;
}
Game.prototype.drawTerrain = function() {
    this.emit("beforedrawterrain", [this]);
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
    this.emit("drawterrain", [this]);

    return this;
}

//Draw the terrain (=blocks)
Game.prototype.drawBackgrounds = function() {
    this.emit("beforedrawbackgrounds", [this]);
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
    this.emit("drawbackgrounds", [this]);
    return this;
}
Game.prototype.drawForegrounds = function() {
    this.emit("beforedrawforegrounds", [this]);
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
    this.emit("drawforegrounds", [this]);
    return this;
}
Game.prototype.clearCanvas = function() {
    this.emit("beforeclearcanvas", [this]);
    this.context.clearRect(0, 0, this.width, this.height);
    this.emit("afterclearcanvas");
    //console.log(this.gravity);
    return this;
    
}

Game.prototype.applyGravity = function(object){
    object.Move(0,-object.fallSpeed, this);
    object.fallSpeed += 0.1;
    if(object.fallSpeed > this.maxGravitySpeed){
        object.fallSpeed = this.maxGravitySpeed;
    }
}








/* COLLIDERS
 * ========= */

Game.prototype.updateTerrainColliders = function() {
    this.emit("beforeupdateterraincolliders", [this]);
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
    this.emit("updateterraincolliders", [this]);
    return this;
}

Game.prototype.updateObjectColliders = function() {
    this.emit("beforeupdateobjectcolliders", [this]);
    var colliders = [];
    var objects = this.scene.Objects;
    for(var i = 0, len = objects.length; i < len; i++) {
        var object = objects[i];
        if(object.collider) {
            colliders.push(object.collider);
        }
        else if(object.hasCollider !== false) {
            var collider = new SAT.Box( new SAT.Vector(object.positionX, object.positionX), object.width, object.height).toPolygon();
            colliders.push(collider);
        }
    }
    
    this.objectColliders = colliders;
    this.emit("updateobjectcolliders", [this]);
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
Game.prototype.getObjectColliders = function(x, w) {
    if(typeof w !== "number") {var Collider = x; var x = Collider.pos.x; var w = this.getPolygonWidth(Collider);}
    
    var colliders = [];
    var objects = this.objectColliders;
    var xw = x + w;
    for(var i = 0, len = objects.length; i < len; i++) {
        var o = objects[i];
        var ow = this.getPolygonWidth(o);
       if(((x > o.pos.x && x < o.pos.x+ow) ||
           (xw > o.pos.x && xw < o.pos.x+ow) ||
           (x < o.pos.x && xw > o.pos.x+ ow))
          && o !== Collider) {
               colliders.push(o);
         }
     }
     return colliders;
}
Game.prototype.getObjectCollidersObject = function(object) {
    return this.getObjectColliders(object.positionX, object.width);
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






/* WORLDS 
 * ====== */

//Load in a world (=select this world to play)
Game.prototype.loadWorld = Game.prototype.load = function(world) {
    this.emit("beforeloadworld", [this, world]);
    this.stop();
    this.reset();
    this.worldLoadTime = this.getTime();

    this.world = world;
    this.loadScene(0);
    this.emit("loadworld", [this, world]);

    return this;
}
Game.prototype.addWorld = function(world) {
    this.emit("beforeaddworld", [this, world]);
    this.world = world;
    this.emit("addworld", [this, world]);
    return this;
}

//Add a scene to the current world
Game.prototype.addScene = function(scene) {
    this.emit("beforeaddscene", [this, scene])
    this.world.push(scene);
    this.emit("addscene", [this, scene]);
    return this;
}
//Load in a scene (=select this scene to play)
Game.prototype.loadScene = function(scene) {
    this.emit("beforeloadscene", [this, scene]);
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

    this.emit("beforeupdateloadscene", [this, scene]);

    this.updateGameHeight();
    this.updateGameWidth();
    this.updateTerrainColliders();
    this.initObjects();

    this.emit("resetplayer", [this]);
    this.emit("loadscene", [this, scene]);

    return this;
}



/* SAVES
 * ===== */

//Save a block
Game.prototype.saveBlock = function(name, b) {
    this.emit("beforesaveblock", [this, name, b]);
    this.savedBlocks[name] = b;
    this.emit("saveblock", [this, name, b]);
    return this;
}
Game.prototype.saveBlocks = function(blocks) {
    this.emit("beforesaveblocks", [this, blocks]);
    for(name in blocks) {
        this.savedBlocks[name] = blocks[name];
    }
    this.emit("saveblocks", [this, blocks]);
    return this;
}

var Animation = function(name, sprites, options) {
    if(!options) var options = {};
    this.name       = name;
    this.sprites    = Game.prototype.parseSprites(sprites, options.image || options.img);
    this.options    = options;
    this.autoStart  = options.start || options.autoStart || true;
    this.interval   = options.time || 500;

    this.startTime     = null;
    this.lastStartTime = null;
    this.lastPauseTime = null;
    this.lastStopTime  = null;
    this.pauseTime     = 0;

    this.running       = false;
    this.paused        = false;


    return this;
}
Animation.prototype.start = function() {
    var time = Game.prototype.getTime();
    if(this.startTime === null) {
        this.startTime = time;
    }
    if(this.paused) {
        this.pauseTime += time - this.lastPauseTime;
        this.paused     = false;
    }
    if(!this.running) {
        this.lastStartTime = time;
        this.running       = true;
    }
    return this;
}
Animation.prototype.pause = function() {
    if(this.running && !this.paused) {
        this.lastPauseTime = Game.prototype.getTime();
        this.paused        = true;
    }
    return this;
}
Animation.prototype.stop = function() {
    this.lastStopTime  = Game.prototype.getTime();
    this.running       = false;
    this.paused        = false;
    this.pauseTime     = 0;

    this.startTime     = null;
    this.lastStartTime = null;
    this.lastPauseTime = null;

    return this;
}
Animation.prototype.reset = function() {
    this.stop().start();
    return this;
}
Animation.prototype.getRunningTime = function() {
    return (Game.prototype.getTime() - this.startTime - (this.pausedTime || 0));
}
Animation.prototype.getSprite = function() {
    return this.sprites[Math.floor(this.getRunningTime() / this.interval) % this.sprites.length];
}
Game.prototype.Animation = Animation;

Game.prototype.parseAnimation = function(anim) {
    return new this.Animation(anim.name, anim.sprites, anim.options);
}
Game.prototype.parseAnimations = function(anims) {
    var result = [];
    for(var i = 0, len = anims.length; i < len; i++) {
        result.push(this.parseAnimation(anims[i]));
    }
    return result;
}
Game.prototype.saveAnimation = function(name, animation) {
    if(!animation) {var animation = name; var name = animation.name;}

    this.animations[name] = animation;
    
    return this;
}
Game.prototype.saveAnimations = function(animations) {
    for(var i = 0, len = animations.length; i < len; i++) {
        this.saveAnimation(animations[i]);
    }
    return this;
}


var Sprite = function(img, x, y, w, h) {
    this.img = img;
    this.x   = x;
    this.y   = y;
    this.w   = w;
    this.h   = h;
    
    return this;
}
Game.prototype.Sprite = Sprite;
Game.prototype.parseSprite = function(s, img) {
    if(s instanceof Game.prototype.Sprite) {
        return s;
    }
    else {
        return new Game.prototype.Sprite(s.img || s.image || img, s.x || s.positionX, s.y || s.positionY, s.w || s.width, s.h || s.height);
    }
}
Game.prototype.parseSprites = function(sprites, img) {
    var result = [];
    for(var i = 0, len = sprites.length; i < len; i++) {
        result.push(this.parseSprite(sprites[i], img));
    }
    return result;
}






Game.prototype.checkSAT = function() {
    this.emit("beforechecksat", [this]);
    if(SAT) {
        return true;
    }
    else {
        throw new Error("Make sure SAT.js is provided. You can find it here: https://github.com/jriecken/sat-js");
    }
    this.emit("checksat", [this]);
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
    this.emit("beforeupdategameheight", [this]);
    this.gameHeight = this.getHighestColumnLength() * this.blockSize;
    this.emit("updategameheight", [this]);
    return this;
}
Game.prototype.updateGameWidth = function() {
    this.emit("beforeupdategamewidth", [this]);
    this.gameWidth = this.scene.Terrain.length * this.blockSize;
    this.emit("updategamewidth", [this]);
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
    this.emit("beforeparseblock", [this, b]);
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
    this.emit("parseblock", [this, b]);
}
Game.prototype.parseColumn = function(c) {
    this.emit("beforeparsecolumn", [this, c]);
    var parsedColumn = [];
    for(var i = 0, len = c.length; i < len; i++) {
        var parsedBlock = this.parseBlock(c[i]);
        parsedColumn.push(parsedBlock);
    }
    this.emit("parsecolumn", [this, c]);
    return parsedColumn;
}
Game.prototype.parseScene = function(s) {
    this.emit("beforeparsescene", [this, s]);
    var parsedScene = this.cloneObject(s);
    parsedScene.Terrain = [];
    for(var i = 0, len = s.Terrain.length; i < len; i++) {
        parsedScene.Terrain.push(this.parseColumn(s.Terrain[i]));
    }
    this.emit("parsescene", [this, s]);
    return parsedScene;
}

Game.prototype.reset = function() {
    this.emit("beforereset", [this]);

    this.offsetX          = 0;
    this.offsetY          = 0;
    this.terrainBuffer    = [];
    this.scene            = [];
    this.terrainColliders = [];
    this.objectColliders  = [];
    this.gameHeight       = 0;
    this.gameWidth        = 0;
    //Reset Player on 'resetplayer' event, fired in loadScene

    this.emit("reset", [this]);

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

Game.prototype.getPolygonWidth = function(polygon) {
    var highestX = 0;
    for(var i = 0, len = polygon.calcPoints.length; i < len; i++) {
        if(polygon.calcPoints[i] > highestX) {
            highestX = polygon.calcPoints[i];
        }
    }
    return highestX;
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






/* EVENTS
 * ====== */
Game.prototype.on = function(event, cb) {
    if(this._events[event]) {
        this._events[event].push(cb);
    }
    else {
        this._events[event] = [cb];
    }
    return this;
}
Game.prototype.emit = function(event, args) {
    var events = this._events[event];
    if(events) {
        for(var i = 0, len = events.length; i < len; i++) {
            events[i].apply(this, args);
        }
    }
    return this;
}
Game.prototype.removeListener = function(event, cb) {
    var events = this._events[event];
    if(events) {
        events.splice(events.indexOf(cb), 1);
    }
    return this;
}
Game.prototype.removeEvent = function(event) {
    this._events[event] = undefined;
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
Draw.prototype.drawSprite = function(sprite, dx, dy, dw, dh){
    this.drawImage(sprite.img, sprite.x, sprite.y, sprite.w, sprite.h, dx, dy, dw, dh);
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
 
 
 
 
/* ADD SAT
 * ======= */
Game.prototype.SAT = SAT;
Game.SAT = SAT;











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
