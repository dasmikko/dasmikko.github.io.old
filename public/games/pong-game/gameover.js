var gameOver = function(game){
	console.log("%cStarting my awesome game", "color:white; background:red");
	var spaceBar;

};
  
gameOver.prototype = {
	preload: function(){
          
	},
  	create: function(){
		var winnerText = game.add.text((this.game.width / 2), 64, 'Winner is: ' + game.global.winner, { font: '20px silkscreennormal', fill: '#fff' });
		winnerText.anchor.set(0.5, 0.5);
		winnerText.y = (game.height / 2);

		this.spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		// Start game text
		this.startGameText = game.add.text(0, 0, 'Press SPACE to restart game', { font: '20px silkscreennormal', fill: '#fff' });
		this.startGameText.x = (game.width / 2);
		this.startGameText.y = (game.height - 60);
		this.startGameText.anchor.set(0.5, 0.5);
	},
	update: function(){
		// Start game
	    if (this.spaceBar.isDown)
	    {
	        this.game.state.start("TheGame");
	    }
	}
}