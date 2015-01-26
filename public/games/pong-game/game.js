var theGame = function(game){
	var ball;
	var paddle1;
	var paddle2;
	var paddleSpeed;
	var height;

	var p1Score;
	var p2Score;
	var p1ScoreText;
	var p2ScoreText;

	var startGameText;

	var log_once = false;
	var beep;
	var point_sound;

	var playing;
}
 
theGame.prototype = {
  	create: function(){
		// Game rules
		this.paddleSpeed = 10;
		this.p1Score = 0;
		this.p2Score = 0; 
		this.playing = false;

		// add audio
		this.beep = game.add.audio('beep');
		this.beep.allowMultiple = true;

		// add audio
		this.point_sound = game.add.audio('point');
		this.point_sound.allowMultiple = true;

		//  We're going to be using physics, so enable the Arcade Physics system
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		// Add middle line
		this.bg = game.add.sprite((this.game.width / 2), (this.game.height / 2), 'bg');
		this.bg.anchor.set(0.5, 0.5);

		// Add ball to game
		this.ball = game.add.sprite((this.game.width / 2), (this.game.height / 2), 'ball');
		this.ball.anchor.set(0.5);

		//  We need to enable physics on the player
		this.game.physics.arcade.enable(this.ball);
		this.game.physics.arcade.checkCollision.left = false;
		this.game.physics.arcade.checkCollision.right = false;
		this.ball.body.collideWorldBounds = true;
		this.ball.checkWorldBounds = true;
		this.ball.body.bounce.set(1);

		this.ball.events.onOutOfBounds.add(this.ballLost, this);

		// Player 1
		this.paddle1 = game.add.sprite(30, (this.game.height / 2), 'paddle');
		this.paddle1.anchor.set(0.5);
		this.game.physics.enable(this.paddle1, Phaser.Physics.ARCADE);
		this.paddle1.body.collideWorldBounds = true;
		this.paddle1.body.bounce.set(1);
		this.paddle1.body.immovable = true;

		// Player 2
		this.paddle2 = game.add.sprite((this.game.width - 30), (this.game.height / 2), 'paddle');
		this.paddle2.anchor.set(0.5);
		this.game.physics.enable(this.paddle2, Phaser.Physics.ARCADE);
		this.paddle2.body.collideWorldBounds = true;
		this.paddle2.body.bounce.set(1);
		this.paddle2.body.immovable = true;

		//  Our controls.
		this.cursors = this.game.input.keyboard.createCursorKeys();
		
		this.P1upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
		this.P1downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);

		this.P2upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.O);
		this.P2downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.L);

		this.spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		// How far from border
		var from_border = 128;

		// Player 1 Score
		this.p1ScoreText = this.game.add.text(from_border, 64, String(this.p1Score), { font: '30px silkscreennormal', fill: '#fff' });
		this.p1ScoreText.anchor.set(0.5);

		// Player 2 Score
		this.p2ScoreText = game.add.text((this.game.width - from_border), 64, String(this.p2Score), { font: '30px silkscreennormal', fill: '#fff' });
		this.p2ScoreText.anchor.set(0.5);

		// Start game text
		this.startGameText = game.add.text(0, 0, 'Press SPACE to start game', { font: '20px silkscreennormal', fill: '#fff' });
		this.startGameText.x = (game.width / 2);
		this.startGameText.y = (game.height - 60);
		this.startGameText.anchor.set(0.5, 0.5);

		this.add.tween(this.startGameText.scale)
			.to({ x: 1.2, y: 1.2}, 600, Phaser.Easing.Quartic.In)
			.to({ x: 1, y: 1}, 600, Phaser.Easing.Quartic.Out)
			.loop()
			.start();



		// Particle effects
		this.emitter = this.game.add.emitter(0, 0, 100);

		this.emitter.makeParticles('particle');
		this.emitter.gravity = 0;

		//game.input.onDown.add(particleBurst, this);
	},
	update: function()
	{
	    this.game.physics.arcade.collide(this.ball, this.paddle1, this.ballHitPaddle, null, this);
	    this.game.physics.arcade.collide(this.ball, this.paddle2, this.ballHitPaddle, null, this);

	    if(this.p1Score == 3)
	    {
	    	game.global.winner = "Player 1";
	    	this.game.state.start("GameOver");
	    }

	    if(this.p2Score == 3)
	    {
	    	game.global.winner = "Player 2";
	    	this.game.state.start("GameOver");
	    }

	    // Start game
	    if (this.spaceBar.isDown)
	    {
	        this.startGame();
	    }

	    if(this.playing == true)
	    {
	    	// Move player 1 up and down
	    	if (this.P1upKey.isDown)
	    	{
	    	    this.paddle1.body.y -= this.paddleSpeed;
	    	}
	    	if (this.P1downKey.isDown)
	    	{
	    	    this.paddle1.body.y += this.paddleSpeed;
	    	}

	    	// Move player 2 up and down
	    	if (this.P2upKey.isDown)
	    	{
	    	   this. paddle2.body.y -= this.paddleSpeed;
	    	}
	    	if (this.P2downKey.isDown)
	    	{
	    	    this.paddle2.body.y += this.paddleSpeed;
	    	}
	    }
	    
	},
	resetBall: function()
	{
		this.ball.revive(1);
		this.ball.x = (this.game.width / 2);
		this.ball.y = (this.game.height / 2);
		this.ball.body.velocity.y = 0;
		this.ball.body.velocity.x = 0;

		// Not playing anymore
		this.playing = false;

		// Reset paddles
		this.paddle1.y = this.game.height / 2;
		this.paddle2.y = this.game.height / 2;

		this.startGameText.visible = true;
	},
	ballHitPaddle: function(_ball, _paddle)
	{
		var diff = 0;

		var angle = 10;

		if (_ball.y < _paddle.y)
		{
		    //  Ball is on the left-hand side of the paddle
		    diff = _paddle.y - _ball.y;
		    _ball.body.velocity.y = (-angle * diff);
		}
		else if (_ball.y > _paddle.y)
		{
		    //  Ball is on the right-hand side of the paddle
		    diff = _ball.y -_paddle.y;
		    _ball.body.velocity.y = (angle * diff);
		}
		else
		{
		    //  Ball is perfectly in the middle
		    //  Add a little random X to stop it bouncing straight up!
		    _ball.body.velocity.y = 2 + Math.random() * 8;
		}

		this.particleBurst(_ball);

		this.beep.play();
	},
	ballLost: function(_ball)
	{
		this.ball.kill();
		

	   	if (_ball.x < 0) 
	   	{
	   		console.log("Player 1 lost");
	   		this.p2Score++;
	   		this.particleBurst(this.p2ScoreText);
	   		this.p2ScoreText.setText(String(this.p2Score));
	   	}

	   	if (_ball.x > this.game.width)
	   	{
	   		console.log("Player 2 lost");
	   		this.p1Score++;
	   		this.particleBurst(this.p1ScoreText);
			this.p1ScoreText.setText(String(this.p1Score));
	   	}
	   	this.point_sound.play();
	   	this.resetBall();
	},
	particleBurst: function(pointer)
	{
		//  Position the emitter where the mouse/touch event was
		this.emitter.x = pointer.x;
		this.emitter.y = pointer.y;

		//  The first parameter sets the effect to "explode" which means all particles are emitted at once
		//  The second gives each particle a 2000ms lifespan
		//  The third is ignored when using burst/explode mode
		//  The final parameter (10) is how many particles will be emitted in this single burst
		this.emitter.start(true, 2000, null, 10);
	},
	startGame: function()
	{
        if(this.playing == false)
        {
        	var random = (Math.random() * 6);

        	this.startGameText.visible = false;

        	if(random >= 2)
        	{
        		//  Move to the ball
	        	this.ball.body.velocity.x = -350;
	        	this.playing = true;
        	}
        	if(random <= 2) 
        	{
        		//  Move to the ball
	        	this.ball.body.velocity.x = 350;
	        	this.playing = true;
        	}
        	
        }
	}
}