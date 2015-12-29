var Main = function(game) {

};

Main.prototype = {

	create: function() {
		this.game.stage.backgroundColor = '#aeecf3';
		this.map = this.game.add.tilemap('tilemap');
		this.map.addTilesetImage('sheet', 'tiles');

		this.backgroundLayer = this.map.createLayer('backgroundLayer');
	},

	update: function() {

	},

	gameOver: function() {
		this.game.state.start('GameOver');
	}
};