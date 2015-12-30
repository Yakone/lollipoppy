var Main = function(game) {

};

Main.prototype = {

	create: function() {
		this.game.stage.backgroundColor = '#aeecf3';
		this.game.world.setBounds(0, 0, 7000, 700);

		this.game.physics.arcade.TILE_BIAS = 40;

		this.map = this.game.add.tilemap('tilemap');
		this.map.addTilesetImage('sheet', 'tiles');

		this.player = this.game.add.sprite(70, 300, 'player');
		this.player.scale.setTo(1.5, 1.5);

		this.game.physics.arcade.enable(this.player);
		this.game.camera.follow(this.player);

		this.player.body.gravity.y = 2500;

		this.player.animations.add('idle', [0]);
		this.player.animations.add('walk', [0, 1, 2]);

		this.cursors = this.game.input.keyboard.createCursorKeys();

		this.backgroundLayer = this.map.createLayer('backgroundLayer');
		this.blockedLayer = this.map.createLayer('blockedLayer');
		this.map.setCollisionBetween(1, 1000, true, 'blockedLayer');

		this.createCandy();
		this.addObstacles();

		this.bindKeys();
	},

	bindKeys: function() {
		var upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
		var leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		var rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

		upKey.onDown.add(this.jump, this);

		leftKey.onDown.add(this.changeToWalking, this);
		leftKey.onUp.add(this.changeToIdle, this);

		rightKey.onDown.add(this.changeToWalking, this);
		rightKey.onUp.add(this.changeToIdle, this);
	},

	createCandy: function() {
		this.candy = this.game.add.group();
		this.candy.enableBody = true;

		result = this.findObjectsByType('candy', this.map, 'objectLayer');
		result.forEach(function(element) {
			this.createFromTiledObject(element, this.candy);
		}, this);
	},

	addObstacles: function() {
		this.createIcecream();
	},

	createIcecream: function() {
		this.icecream = this.game.add.group();
		this.icecream.enableBody = true;

		result = this.findObjectsByType('icecream', this.map, 'objectLayer');

		result.forEach(function(element) {
			this.createFromTiledObject(element, this.icecream);
		}, this);
	},

	collect: function(player, collectable) {
		collectable.destroy();
	},

	slow: function() {
		console.log('slowed');
	},

	jump: function() {
		this.player.body.velocity.y = -550;
	},

	changeToIdle: function() {
		this.player.animations.play('idle');
	},

	changeToWalking: function() {
		this.player.animations.play('walk', 10, true);
	},

	update: function() {
		this.game.physics.arcade.collide(this.player, this.blockedLayer);
	    this.player.body.velocity.x = 0;
 
	    if (this.cursors.up.isDown) {
			//this.player.body.velocity.y -= 150;
	    }

	    else if (this.cursors.down.isDown) {
			this.player.body.velocity.y += 150;
	    }

	    if (this.cursors.left.isDown) {
			this.player.body.velocity.x -= 500;
	    }

	    else if (this.cursors.right.isDown) {
			this.player.body.velocity.x += 500;
	    }

	    this.game.physics.arcade.overlap(this.player, this.candy, this.collect, null, this);
	    this.game.physics.arcade.overlap(this.player, this.icecream, this.slow, null, this);
	},

	gameOver: function() {
		this.game.state.start('GameOver');
	},

	/* 	find objects in a Tiled layer that contains a property called "type" equal to a certain value
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

		return sprite;
	},

	render: function() {
    	this.game.debug.cameraInfo(this.game.camera, 32, 32);
    	this.game.debug.spriteCoords(this.player, 32, 500);
	},
};