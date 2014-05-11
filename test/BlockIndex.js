var Block = {
Test: function(d) {
	d.drawImage(document.getElementById("image"),0,0,35,35);
},
Empty: function(d) {
},
TestB: function(d) {
	d.fillStyle("#00FF00").fillRect(0, 0, 35, 35);
},
TestA: function(d) {
	d.fillStyle("#FF0000").fillRect(0, 0, 35, 35);
}
}