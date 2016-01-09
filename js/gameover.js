var GameOver = function(game) {
	
};

GameOver.prototype = {

  	create: function() {
  		var gameOverText = this.game.add.text(this.game.camera.width * .5 - 150, 300, " Game Over ", {
  			font: '65px Cheri Liney',
  			fill: '#fff',
  			align: 'center'
  		});
  		gameOverText.fixedToCamera = true;
  		
  		this.restartText = this.game.add.text(this.game.camera.width * .5 - 170, 400, " Press SPACE to Restart ", {
  			font: '35px Cheri Liney',
  			fill: '#fff',
  			align: 'center'
  		});

  		// Might want to change this to bouncing text instead of blinking
  		this.game.time.events.loop(Phaser.Timer.SECOND, this.blinkText, this);

  		var spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  		spaceBar.onDown.addOnce(this.restartGame, this);
	},

	blinkText: function() {
		this.restartText.visible = !this.restartText.visible;
	},

	restartGame: function() {
		this.game.state.start('Main');
	}
	
}