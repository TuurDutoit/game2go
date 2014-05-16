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