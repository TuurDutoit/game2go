var Blocks = {
    Bricks: {
        Draw: function(d) {
            d.drawImage(Textures.bricks, 0, 0, d.blockSize, d.blockSize);
        }
    },
    Empty: {
        hasCollider: false,
        Draw: function(d) {}
    },
    Red: {
        Draw: function(d) {
            d.fillStyle("#FF0000").fillRect(0, 0, d.blockSize, d.blockSize);
        }
    },
    Blue: {
        Draw: function(d) {
            d.fillStyle("#0000FF").fillRect(0, 0, d.blockSize, d.blockSize);
        }
    },
    Green: {
        Draw: function(d) {
            d.fillStyle("#00FF00").fillRect(0, 0, d.blockSize, d.blockSize);
        }
    }
}