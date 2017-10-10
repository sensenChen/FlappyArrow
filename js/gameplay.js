/** @constructor */
let gameplayState = function()
{
	this.deerScore = 0;
	this.lives = 3;
	this.deerTimer = 0;
	this.rockTimer = 2300; // offset rocks from deer
	this.currentTime = 0;
};

gameplayState.prototype.preload = function()
{
  // load assets needed for the preloader here 
};

gameplayState.prototype.create = function()
{ 	
	//arrow create stuff
	this.arrow = game.add.sprite(32, game.world.height - 64, "arrow");
	game.physics.enable(this.arrow, Phaser.Physics.ARCADE);
	this.arrow.body.gravity.y = 0;
	
	//deer stuff
	this.deers = game.add.group();
	this.deers.enableBody = true;
	
	//rock stuff
	this.rocks = game.add.group();
	this.rocks.enableBody = true;
	
	//score
	this.deerScoreText = game.add.text(600, 16, 'Score: 0', { fontSize: '24px', fill: '#ffffff' });
	this.livesScoreText = game.add.text(600, 48, 'Lives: 3', { fontSize: '24px', fill: '#ffffff' });
};

gameplayState.prototype.update = function()
{ 
	//while we have one or more lives
	if (this.lives > 0){
		//arrow movement
		if (game.input.mousePointer.isDown) {
			mx = game.input.mousePointer.x;
			this.arrow.body.x += (Math.abs(mx-this.arrow.body.x) < 7 ? 
				mx-this.arrow.body.x : Math.sign(mx-this.arrow.body.x) * 7);	
		}
		
		
		//create a deer every 5 seconds
		if (this.deerTimer >= 5000){
			let deer = this.deers.create(Math.random() * game.width/2 + game.width/4,100,'deer');
			deer.body.velocity.y = 300;
			this.deerTimer = 0;
		}
		this.deerTimer = this.deerTimer + game.time.elapsed;
		
		
		if (this.rockTimer >= 5000){
			let rock = this.rocks.create(Math.random() * game.width/2 + game.width/4,100,'rock');
			rock.body.velocity.y = 300;
			this.rockTimer = 0;
		}
		this.rockTimer = this.rockTimer + game.time.elapsed;
		
		
		//update score
		game.physics.arcade.overlap(this.arrow, this.deers, this.updateScore, null, this);
		game.physics.arcade.overlap(this.arrow, this.rocks, this.updateLife, null, this);
	}
};


gameplayState.prototype.updateScore = function(arrow, deer) {
    
    // Removes the star from the screen
    deer.kill();

    //  Add and update the score
    this.deerScore += 1;
    this.deerScoreText.text = 'Score: ' + this.deerScore;

}

gameplayState.prototype.updateLife = function(arrow, rock) {
    
    // Removes the star from the screen
    rock.kill();

    //  Add and update the score
    this.lives -= 1;
    this.livesScoreText.text = 'Score: ' + this.lives;

}
