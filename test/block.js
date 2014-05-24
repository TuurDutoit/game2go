var Blocks = {
    Bricks: function() {
        this.Draw = function(d) {
            d.drawImage(Textures.bricks, 0, 0, d.blockSize, d.blockSize);
        }
        return this;
    },
    Empty: function() {
        this.hasCollider = false,
        this.Draw = function(d) {}
        return this;
    },
    Red: function() {
        this.Draw = function(d) {
            d.fillStyle("#FF0000").fillRect(0, 0, d.blockSize, d.blockSize);
        }
        return this;
    },
    Blue: function() {
        this.Draw = function(d) {
            d.fillStyle("#0000FF").fillRect(0, 0, d.blockSize, d.blockSize);
        }
        return this;
    },
    Green: function() {
        this.Draw = function(d) {
            d.fillStyle("#00FF00").fillRect(0, 0, d.blockSize, d.blockSize);
        }
        return this;
    }
}