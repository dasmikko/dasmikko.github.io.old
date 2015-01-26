var gameTitle = function(game){
	var bmpText;
}

gameTitle.prototype = 
{
  	create: function()
  	{

		var playButton = this.game.add.button((this.game.width / 2), (game.height / 2), "play", this.playTheGame, this);
		playButton.anchor.setTo(0.5, 0.5);
		playButton.input.useHandCursor = true;
		playButton.events.onInputOver.add(this.over, this);
		playButton.events.onInputOut.add(this.out, this);

		
		this.bmpText = game.add.bitmapText((this.game.width / 2), 64, 'myFont','Pong Game!', 64);
		this.bmpText.x = (this.game.width / 2) - (this.bmpText.width / 2);
	},
	playTheGame: function(){
		this.game.state.start("TheGame");
	},
	over: function(button)
	{
		this.add.tween(button.scale).to({ x: 1.3, y: 1.3}, 300, Phaser.Easing.Circular.Out, true, 0);
	},
	out: function(button)
	{
		this.add.tween(button.scale).to({ x: 1, y: 1}, 300, Phaser.Easing.Circular.Out, true, 0);
	}
}