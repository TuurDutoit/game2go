var Block = {
Test: function(d) {
	d.drawImage(document.getElementById("image"),0,0,d.standardSize,d.standardSize);
},
Empty: function(d) {
},
TestB: function(d) {
	d.fillStyle("#00FF00").fillRect(0, 0, d.standardSize, d.standardSize);
},
TestA: function(d) {
	d.fillStyle("#FF0000").fillRect(0, 0, d.standardSize, d.standardSize);
}
}