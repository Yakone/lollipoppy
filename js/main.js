var Main = function(game) {

};

Main.prototype = {

	create: function() {
		this.game.stage.backgroundColor = '#aeecf3';
		this.map = this.game.add.tilemap('tilemap');
		this.map.addTilesetImage('sheet', 'tiles');

		this.backgroundLayer = this.map.createLayer('backgroundLayer');

		this.createCandy();
	},

	createCandy: function() {
		this.candy = this.game.add.group();
		this.candy.enableBody = true;

		var candy;
		result = this.findObjectsByType('candy', this.map, 'objectLayer');
		result.forEach(function(element) {
			this.createFromTiledObject(element, this.candy);
		}, this);
	},

	update: function() {

	},

	gameOver: function() {
		this.game.state.start('GameOver');
	},

	/* 	find objects in a Tiled layer that containt a property called "type" equal to a certain value
		https://gamedevacademy.org/html5-phaser-tutorial-top-down-games-with-tiled/
	*/
	findObjectsByType: function(type, map, layer) {
		var result = new Array();
		map.objects[layer].forEach(function(element) {
			if (element.properties.type === type) {
		    // Phaser uses top left, Tiled bottom left so we have to adjust the y position
		    	element.y -= map.tileHeight;
		    	result.push(element);
		  	}      
		});
		return result;
	},

	/* 	create a sprite from an object
		https://gamedevacademy.org/html5-phaser-tutorial-top-down-games-with-tiled/
	*/
	createFromTiledObject: function(element, group) {
		var sprite = group.create(element.x, element.y, element.properties.sprite);

		// copy all properties to the sprite
		Object.keys(element.properties).forEach(function(key) {
			sprite[key] = element.properties[key];
		});
	},
};