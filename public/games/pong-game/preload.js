var preload = function(game){}
 
preload.prototype = {
	preload: function(){ 
          // Load sprites
          this.game.load.image('ball', 'assets/ball.png');
          this.game.load.image('paddle', 'assets/paddle1.png');
          this.game.load.image('particle', 'assets/particle.png');
          this.game.load.image('play', 'assets/play.png');
          this.game.load.image('bg', 'assets/bg.png');

          // Load audio
          this.game.load.audio('beep', 'assets/plop.ogg');
          this.game.load.audio('point', 'assets/long_beep.ogg');

          // Font
          this.game.load.bitmapFont('myFont', 'assets/font.png', 'assets/font.fnt');
	},
  	create: function(){
		this.game.state.start("GameTitle");
	}
}