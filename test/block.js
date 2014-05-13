var Block = {
    Test: function(d) {
        d.drawImage(document.getElementById("image"),0,0,d.blockSize,d.blockSize);
    },
    Empty: function(d) {
    },
    TestB: function(d) {
        d.fillStyle("#00FF00").fillRect(0, 0, d.blockSize, d.blockSize);
    },
    TestA: function(d) {
        d.fillStyle("#FF0000").fillRect(0, 0, d.blockSize, d.blockSize);
    }
}