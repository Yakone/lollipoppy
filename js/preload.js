var Preload = function(game) {

};

Preload.prototype = {

	preload: function() { 
		this.game.load.tilemap('tilemap', 'assets/level1.json', null, Phaser.Tilemap.TILED_JSON);
		this.game.load.image('tiles', 'assets/art-candy/sheet.png');
	},

	create: function() {
		this.game.state.start("Main");
	}
}