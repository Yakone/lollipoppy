var Preload = function(game) {

};

Preload.prototype = {

	preload: function() { 
		this.game.load.tilemap('tilemap', 'assets/level1.json', null, Phaser.Tilemap.TILED_JSON);
		this.game.load.image('tiles', 'assets/art-candy/sheet.png');
		//this.game.load.image('player', 'assets/Poppy.png');
		this.game.load.spritesheet('player', 'assets/Poppy-sheet.png', 32, 32, 3);
		this.game.load.image('cherry', 'assets/art-candy/Tiles/cherry.png');
		this.game.load.image('candyBlue', 'assets/art-candy/Tiles/candyBlue.png');
		this.game.load.image('candyGreen', 'assets/art-candy/Tiles/candyGreen.png');
	},

	create: function() {
		this.game.state.start("Main");
	}
}