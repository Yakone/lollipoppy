var Main = function(game) {

};

Main.prototype = {

	create: function() {
		this.game.stage.backgroundColor = '#aeecf3';
		this.realWorldHeight = 700;
		this.game.world.setBounds(0, 0, 7000, this.realWorldHeight + 100); // real height + 100 for player sprite

		this.game.physics.arcade.TILE_BIAS = 40;

		this.map = this.game.add.tilemap('tilemap');
		this.map.addTilesetImage('sheet', 'tiles');
		this.backgroundLayer = this.map.createLayer('backgroundLayer');
		this.blockedLayer = this.map.createLayer('blockedLayer');
		this.map.setCollisionBetween(1, 1000, true, 'blockedLayer');

		this.createCandy();
		this.addObstacles();
		this.addDoor();

		this.player = this.game.add.sprite(70, 300, 'player');
		this.player.bringToTop();
		this.player.scale.setTo(1.5, 1.5);

		this.game.physics.arcade.enable(this.player);
		this.game.camera.follow(this.player);

		// Need to figure out how to let the player drop off
		// the screen instead of just sitting at the bottom
		// (if possible?); otherwise just add a check for
		// the x-axis bounds when moving left/right
		this.player.body.collideWorldBounds = true;

		this.player.body.gravity.y = 2600;

		this.player.animations.add('idle', [0]);
		this.player.animations.add('walk', [0, 1, 2]);

		this.score = 0;
		this.life = 100;
		this.movementModifier = 1.0;

		this.cursors = this.game.input.keyboard.createCursorKeys();

		this.bindKeys();
		this.addScore();

		this.lifeTickEvent = this.game.time.events.loop(Phaser.Timer.SECOND, this.lifeTick, this);
	},

	bindKeys: function() {
		var leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		var rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

		leftKey.onDown.add(this.changeToWalking, this);
		leftKey.onUp.add(this.changeToIdle, this);

		rightKey.onDown.add(this.changeToWalking, this);
		rightKey.onUp.add(this.changeToIdle, this);
	},

	addScore: function() {
		var style = {font: "65px Cheri Liney", fill: "#fff", align: "center"};
		// spacing prevents text from being cut off (NEED FIX)
		this.scoreText = this.game.add.text(this.game.camera.width - 300, 50, " Score: 0 ", style);
		this.scoreText.fixedToCamera = true;
		this.scoreText.anchor.set(0.5);

		this.lifeText = this.game.add.text(this.game.camera.width - 300, 80, " Life: 100 ", style);
		this.lifeText.fixedToCamera = true;
	},

	updateLife: function() {
		this.lifeText.setText(' Life: ' + this.life + ' ');
	},

	lifeTick: function() {
		this.life--;
		this.updateLife();
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
		this.createLollipops();
		this.createLollipopSticks();
	},

	createIcecream: function() {
		this.icecream = this.game.add.group();
		this.icecream.enableBody = true;

		result = this.findObjectsByType('icecream', this.map, 'objectLayer');

		result.forEach(function(element) {
			this.createFromTiledObject(element, this.icecream);
		}, this);
	},

	createLollipops: function() {
		this.lollipops = this.game.add.group();
		this.lollipops.enableBody = true;

		result = this.findObjectsByType('lollipop', this.map, 'objectLayer');

		result.forEach(function(element) {
			var lollipop = this.createFromTiledObject(element, this.lollipops);
			lollipop.originalX = lollipop.x;
			lollipop.originalY = lollipop.y;
			lollipop.anchor.setTo(0.5, 0.5);
		}, this);
	},

	createLollipopSticks: function() {
		this.lollipopSticks = this.game.add.group();
		this.lollipopSticks.enableBody = true;

		result = this.findObjectsByType('lollipopStick', this.map, 'objectLayer');

		result.forEach(function(element) {
			this.createFromTiledObject(element, this.lollipopSticks);
		}, this);
	},

	addDoor: function() {
		this.door = this.game.add.group();
		this.door.enableBody = true;

		result = this.findObjectsByType('door', this.map, 'objectLayer');

		result.forEach(function(element) {
			this.createFromTiledObject(element, this.door);
		}, this);
	},

	collect: function(player, collectable) {
		this.score += 1;
		collectable.destroy();
		// spacing prevents text from being cut off (NEED FIX)
		this.scoreText.setText(' Score: ' + this.score + ' ');
	},

	slow: function() {
		this.movementModifier = 0.01;
		this.game.time.events.add(Phaser.Timer.SECOND * 2, function() { this.movementModifier = 1.0; }, this);
	},

	suckIn: function(player, lollipop) {
		this.game.physics.arcade.accelerateToObject(this.player, {x: lollipop.originalX, y: lollipop.originalY}, 2000, 3000);
	},

	checkLollipopStickDamage: function() {
		// This is true if the player collides from the top (i.e. jumping down onto it)
		if (!this.player.body.touching.any) {
			this.doDamage(20);
		}
	},

	doDamage: function(damage) {
		var resultingLife = this.life - damage;

		if (resultingLife >= 0) {
			this.life = resultingLife;
		} else {
			this.life = 0;
		}
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
 		
 		// Only jump if the player is on the ground
	    if (this.cursors.up.isDown && this.player.body.blocked.down) {
	  		this.player.body.velocity.y = -900 * this.movementModifier;
	    }

	    else if (this.cursors.down.isDown) {
			this.player.body.velocity.y += 150 * this.movementModifier;
	    }

	    if (this.cursors.left.isDown) {
			this.player.body.velocity.x -= 500 * this.movementModifier;
	    }

	    else if (this.cursors.right.isDown) {
			this.player.body.velocity.x += 500 * this.movementModifier;
	    }
	    
	    this.lollipops.forEach(function(lollipop) {
	    	lollipop.angle += 2;
	    	lollipop.x = lollipop.originalX + 35;
	    	lollipop.y = lollipop.originalY + 35;
	    });

	    this.game.physics.arcade.overlap(this.player, this.candy, this.collect, null, this);
	    this.game.physics.arcade.overlap(this.player, this.icecream, this.slow, null, this);
	    this.game.physics.arcade.overlap(this.player, this.lollipops, this.suckIn, null, this);
	    this.game.physics.arcade.collide(this.player, this.lollipopSticks, this.checkLollipopStickDamage, null, this);
	    this.game.physics.arcade.overlap(this.player, this.door, this.completeLevel, null, this);

	    if (this.player.y >= this.realWorldHeight || this.life === 0) {
    		this.gameOver();
		}
	},

	completeLevel: function() {
		this.game.state.start('Win');
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