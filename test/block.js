var Blocks = {
    Bricks: {
        draw: function(d) {
            d.drawImage(Textures.bricks, 0, 0, d.blockSize, d.blockSize);
        }
    },
    Empty: {
        noCollider: true,
        draw: function(d) {}
    },
    Red: {
        draw: function(d) {
            d.fillStyle("#FF0000").fillRect(0, 0, d.blockSize, d.blockSize);
        }
    },
    Blue: {
        draw: function(d) {
            d.fillStyle("#0000FF").fillRect(0, 0, d.blockSize, d.blockSize);
        }
    },
    Green: {
        draw: function(d) {
            d.fillStyle("#00FF00").fillRect(0, 0, d.blockSize, d.blockSize);
        }
    }
}