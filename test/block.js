var Block = {
    Test: {
        draw: function(d) {
            d.drawImage(document.getElementById("image"),0,0,d.blockSize,d.blockSize);
        }
    },
    Empty: {
        noCollider: true,
        draw: function(d) {}
    },
    TestB: {
        draw: function(d) {
            d.drawImage(document.getElementById("textureBrick"),0,0,d.blockSize,d.blockSize);
        }
    },
    TestA: {
        draw: function(d) {
            d.fillStyle("#FF0000").fillRect(0, 0, d.blockSize, d.blockSize);
        }
    }
}