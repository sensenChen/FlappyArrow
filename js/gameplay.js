/** @constructor */
let gameplayState = function()
{
	//ui variables
	this.deerScore = 0;
	this.lives = 3;
	
	//timer variables
	this.deerTimer = 0;
	this.rockTimer = 2300;
	this.cowTimer = 1200;
	
	//variables for slowing down arrow
	this.isSlowed = false;
	this.slowDownTimer = 0;
	this.arrowSpeed = 7;
};

gameplayState.prototype.preload = function()
{
  // load assets needed for the preloader here 
};

gameplayState.prototype.create = function()
{ 	
	//arrow create stuff
	this.arrow = game.add.sprite(game.world.width/2 -32, game.world.height - 128, "arrow");
	game.physics.enable(this.arrow, Phaser.Physics.ARCADE);
	this.arrow.body.gravity.y = 0;
	this.arrow.body.collideWorldBounds = true;
	
	//deer stuff
	this.deers = game.add.group();
	this.deers.enableBody = true;
	
	//rock stuff
	this.rocks = game.add.group();
	this.rocks.enableBody = true;
	
	//cow stuff
	this.cows = game.add.group();
	this.cows.enableBody = true;
	
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
			if (!this.isSlowed){
				let mouseX = game.input.mousePointer.x;
				let dist = mouseX - this.arrow.body.x - this.arrow.body.width/2;
				let speed = this.arrowSpeed * Math.abs(dist)/70 * Math.sign(dist);
				this.arrow.body.x += speed;
				console.log(speed);
			}
			else if (this.isSlowed){
				let mouseX = game.input.mousePointer.x;
				let dist = mouseX - this.arrow.body.x - this.arrow.body.width/2;
				let speed = this.arrowSpeed/4 * Math.abs(dist)/70 * Math.sign(dist);
				this.arrow.body.x += speed;
				console.log(speed);
			}
		}
		
		
		//create a deer every 5 seconds
		if (this.deerTimer >= Math.random() * 2000 + 6000){
			let deer = this.deers.create(Math.random() * game.width/2 + game.width/4,100,'deer');
			deer.body.velocity.y = 300;
			this.deerTimer = 0;
		}
		this.deerTimer = this.deerTimer + game.time.elapsed;
		
		if (this.rockTimer >= Math.random() * 2000 + 3000){
			let rock = this.rocks.create(Math.random() * game.width/2 + game.width/4,100,'rock');
			rock.body.velocity.y = 300;
			this.rockTimer = 0;
		}
		this.rockTimer = this.rockTimer + game.time.elapsed;
		
		if (this.cowTimer >= Math.random() * 2000 + 5000){
			let cow = this.cows.create(Math.random() * game.width/2 + game.width/4,100,'cow');
			cow.body.velocity.y = 300;
			this.cowTimer = 0;
		}
		this.cowTimer = this.cowTimer + game.time.elapsed;
		
		if (this.slowDownTimer >= 3500) {
			this.isSlowed = 0;
			this.slowDownTimer = 0;
		}
		else {
			this.slowDownTimer += game.time.elapsed;
		}
		
		//update score
		game.physics.arcade.overlap(this.arrow, this.deers, this.updateScore, null, this);
		game.physics.arcade.overlap(this.arrow, this.rocks, this.updateLife, null, this);
		game.physics.arcade.overlap(this.arrow, this.cows, this.slowDown, null, this);
		
		//destroy when these things are off screen
		this.deers.forEach(function(item){
			if (item.body.y > game.world.height){
				item.destroy();
			}
		},this);
		
		this.rocks.forEach(function(item){
			if (item.body.y > game.world.height){
				item.destroy();
			}
		},this);
		
		this.cows.forEach(function(item){
			if (item.body.y > game.world.height){
				item.destroy();
			}
		},this);
	}
};


gameplayState.prototype.updateScore = function(arrow, deer) {
    
    // Removes the deer from the screen
    deer.destroy();

    //  Add and update the score
    this.deerScore += 1;
    this.deerScoreText.text = 'Score: ' + this.deerScore;

}

gameplayState.prototype.updateLife = function(arrow, rock) {
    
    // Removes the rock from the screen
    rock.destroy();

    //  Subtract and update the score
    this.lives -= 1;
    this.livesScoreText.text = 'Lives: ' + this.lives;

}

gameplayState.prototype.slowDown = function(arrow, cow){
	
	// Removes the cow from the screen
	cow.destroy();
		
	//Indicate that you are slowed
	this.isSlowed = true;
	this.slowDownTimer = 0;
	
}


