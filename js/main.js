var Main = function(game) {

};

Main.prototype = {

	create: function() {
		this.game.stage.backgroundColor = '#aeecf3';
		this.map = this.game.add.tilemap('tilemap');
		this.map.addTilesetImage('sheet', 'tiles');

		this.player = this.game.add.sprite(70, 320, 'player');
		this.player.scale.setTo(1.5, 1.5);
		this.game.physics.arcade.enable(this.player);
		this.game.camera.follow(this.player);

		this.cursors = this.game.input.keyboard.createCursorKeys();

		this.backgroundLayer = this.map.createLayer('backgroundLayer');

		this.createCandy();
	},

	createCandy: function() {
		this.candy = this.game.add.group();
		this.candy.enableBody = true;

		result = this.findObjectsByType('candy', this.map, 'objectLayer');
		result.forEach(function(element) {
			this.createFromTiledObject(element, this.candy);
		}, this);
	},

	collect: function(player, collectable) {
		collectable.destroy();
	},

	update: function() {
		// player movement
	    this.player.body.velocity.y = 0;
	    this.player.body.velocity.x = 0;
 
	    if (this.cursors.up.isDown) {
			this.player.body.velocity.y -= 70;
	    }

	    else if (this.cursors.down.isDown) {
			this.player.body.velocity.y += 70;
	    }

	    if (this.cursors.left.isDown) {
			this.player.body.velocity.x -= 70;
	    }

	    else if (this.cursors.right.isDown) {
			this.player.body.velocity.x += 70;
	    }

	    this.game.physics.arcade.overlap(this.player, this.candy, this.collect, null, this);
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