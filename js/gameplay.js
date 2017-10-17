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
	this.pauseGame = true;
};

gameplayState.prototype.preload = function()
{
  // load assets needed for the preloader here 
};
//
//gameplayState.prototype.generateMap = function() {
//  let range = 50;
//  let stride = 20;
//  let distance = 255;
//  
//  for(var i=1;i<range/2;i++) {
//    let wall = this.walls.create(i*stride+10, -1*i*100+100,'wall');
//    wall.body.velocity.y = 600;
//    wall.width = 600;
//    wall.x -=600;
//    
//    let wall2 = this.walls.create(i*stride+distance+10, -1*i*100+100,'wall');
//    wall2.body.velocity.y = 600;
//    wall2.width = 600;
//  }
//  
//  for(var i=range-1;i>=range/2;i--) {
//    let wall = this.walls.create((range-1-i)*stride+10, -1*i*100+100,'wall');
//    wall.body.velocity.y = 600;
//    wall.width = 600;
//    wall.x -=600;
//    
//    let wall2 = this.walls.create((range-1-i)*stride+distance+10, -1*i*100+100,'wall');
//    wall2.body.velocity.y = 600;
//    wall2.width = 600;
//  }
//}

function sincurve(i,curve) {
  return (curve*Math.sin(i*Math.PI/180.0)+curve)/(curve*.25);
}

function coscurve(i,curve) {
  return (curve*Math.cos(i*Math.PI/180.0)+curve)/(curve*.25);
}

function line(i,curve) {
  return i/10.0;
}


gameplayState.prototype.generateMap2 = function(curveFun) {
  let range = 60;
  let slice = 360/range;
  let theta = Math.PI/2;
  let distance = 375;
  let curve = 12;
  
  
//  let range = 20;
//  let slice = 360/range;
//  let theta = Math.PI/2;
//  let distance = 225;
//  let curve = 12;
    
//   for(var i=0;i<360;i+=slice) {
//    var y = curveFun(i,curve);
//    var x = i/slice;
//    
//    let lwall = this.leftwall.create(y*5+i/2,-1*x*100-100,'wall');
//    lwall.body.velocity.y = 600;
//    lwall.width = 1000;
//    lwall.x -=1000;
//    lwall.x -=1000;
//    
//    
//    let rwall = this.rightwall.create(y*5+distance, -1*x*100-100,'wall');
//    rwall.body.velocity.y = 600;
//    rwall.width = 1000;
//    rwall.x +=1000;
//  }
//  
  for(var i=0;i<360;i+=slice) {
    var y = curveFun(i,curve);
    var x = i/slice;
    
    let lwall = this.leftwall.create(y*50,-1*x*100-100,'wall');
    lwall.body.velocity.y = 600;
    lwall.width = 600;
    lwall.x -=600;
    lwall.x -=1000;
    
    
    let rwall = this.rightwall.create(y*50+distance, -1*x*100-100,'wall');
    rwall.body.velocity.y = 600;
    rwall.width = 600;
    rwall.x +=1000;
  }
}

gameplayState.prototype.create = function()
{ 	
    this.wallit = 0;
    
    
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
	
    //walls
    this.leftwall = game.add.group();
    this.leftwall.enableBody = true;
    
    this.rightwall = game.add.group();
    this.rightwall.enableBody = true;
    this.generateMap2(sincurve);
    
	//score
	this.deerScoreText = game.add.text(600, 16, 'Score: 0', { fontSize: '24px', fill: '#ffffff' });
	this.livesScoreText = game.add.text(600, 48, 'Lives: 3', { fontSize: '24px', fill: '#ffffff' });
	
	//pause button
	pauseButton = game.add.button(0, game.world.height-64,
		'pauseButton', pauseGame, this, 2, 1, 0);
		
	this.unpauseButton = game.add.button(game.world.width/2+200, game.world.height/2,
		'unpauseButton', unpauseGame, this, 2, 1, 0);
	this.unpauseButton.kill();
};

gameplayState.prototype.update = function()
{ 
	//while we have one or more lives
	if (this.lives > 0 && !game.pause){
		//arrow movement
		if (game.input.mousePointer.isDown && (game.input.mousePointer.x > 64 || game.input.mousePointer.y < game.world.height-64)) {
			if (!this.isSlowed){
				let mouseX = game.input.mousePointer.x;
				let dist = mouseX - this.arrow.body.x - this.arrow.body.width/2;
				let speed = this.arrowSpeed * Math.abs(dist)/70 * Math.sign(dist);
				this.arrow.body.x += speed;
			}
			else if (this.isSlowed){
				let mouseX = game.input.mousePointer.x;
				let dist = mouseX - this.arrow.body.x - this.arrow.body.width/2;
				let speed = this.arrowSpeed/4 * Math.abs(dist)/70 * Math.sign(dist);
				this.arrow.body.x += speed;
			}
		}
		
		//create a deer every 5 seconds
		if (this.deerTimer >= Math.random() * 2000 + 6000){
			let deer = this.deers.create(Math.random() * game.width/2 + game.width/4,100,'deer');
			deer.body.velocity.y = 600;
			this.deerTimer = 0;
		}
		this.deerTimer = this.deerTimer + game.time.elapsed;
		
		if (this.rockTimer >= Math.random() * 2000 + 3000){
			let rock = this.rocks.create(Math.random() * game.width/2 + game.width/4,100,'rock');
			rock.body.velocity.y = 600;
			this.rockTimer = 0;
		}
		this.rockTimer = this.rockTimer + game.time.elapsed;
		
		if (this.cowTimer >= Math.random() * 2000 + 5000){
			let cow = this.cows.create(Math.random() * game.width/2 + game.width/4,100,'cow');
			cow.body.velocity.y = 600;
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
		 
      
        if(this.wallit<this.leftwall.children.length && this.leftwall.children[this.wallit].y>500) {
          this.leftwall.children[this.wallit].x+=1000;
//          this.wallit++;
        }
      
        if(this.wallit<this.rightwall.children.length && this.rightwall.children[this.wallit].y>500) {
          this.rightwall.children[this.wallit].x-=1000;
          this.wallit++;
        }
      
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

      
        if(this.leftwall.children.length>0 && 
           this.leftwall.children[this.leftwall.children.length-1].body.y>game.world.height &&  
           this.wallit==this.leftwall.children.length) {
          
          this.leftwall.forEach(function(item) {
              if (item.body.y > game.world.height){
                  item.destroy();
              }
          }, this);

          this.rightwall.forEach(function(item) {
              if (item.body.y > game.world.height){
                  item.destroy();
              }
          }, this);
          this.wallit = 0;
        }
	}
	
	//when you lose
	if (this.lives == 0){
		this.deers.forEach(function(item){
			item.destroy();
		},this);
		
		this.rocks.forEach(function(item){
			item.destroy();
		},this);
		
		this.cows.forEach(function(item){
			item.destroy();
		},this);
		
		button1 = game.add.button(game.world.width/2, game.world.height/2 + 100,
		'button', restartLevel, this, 2, 1, 0);
		button1.anchor.set(0.5,0.5);
		this.startGameText = game.add.text(game.world.width/2, game.world.height/2 + 100,
		'Restart Level', { fontSize: '32px', fill: '#000000' });
		this.startGameText.anchor.set(0.5,0.5);
	}
	
	if (game.pause && this.pauseGame){
		this.unpauseButton.reset(game.world.width/2+200, game.world.height/2);
		this.deers.forEach(function(item){
			item.body.velocity.y = 0;
		},this);
		
		this.rocks.forEach(function(item){
			item.body.velocity.y = 0;
		},this);
		
		this.cows.forEach(function(item){
			item.body.velocity.y = 0;
		},this);
	}
	else if(!game.pause){
		this.deers.forEach(function(item){
			item.body.velocity.y = 300;
		},this);
		
		this.rocks.forEach(function(item){
			item.body.velocity.y = 300;
		},this);
		
		this.cows.forEach(function(item){
			item.body.velocity.y = 300;
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

function restartLevel(){
	this.lives = 3;
	this.score = 0;
	game.state.start("Game");
}

function pauseGame(){
	game.pause = true;
	this.pauseGame = true;
}

function unpauseGame(){
	this.unpauseButton.kill();
	game.pause = false;
	this.pauseGame = false;
}

