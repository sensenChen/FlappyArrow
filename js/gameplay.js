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
	this.playDeathSound = true;
};

gameplayState.prototype.preload = function()
{
  // load assets needed for the preloader here 
  game.load.audio('deerHit','assets/Music&sound/Hit_deer.wav');
  game.load.audio('loseLife','assets/Music&sound/Lose_life.wav');
  game.load.audio('loseGame','assets/Music&sound/Die.wav');
};

function sincurve(i,curve) {
  return (curve*Math.sin(i*Math.PI/180.0));
}

function coscurve(i,curve) {
  return (curve*Math.cos(i*Math.PI/180.0));
}

function line(i,length, val) {
  let m = (val*150.0)/(0.5*length);
  return i*m;
}

gameplayState.prototype.addbackground = function(){
  let bg = this.background.create(0,1000,'tm1');
  bg.body.velocity.y = 600;
//  bg.width = game.world.width;
  
  let bg1 = this.background.create(0,500,'tm2');
  bg1.body.velocity.y = 600;
//  bg1.width = game.world.width;
  
  let bg2 = this.background.create(0,0,'tm3');
  bg2.body.velocity.y = 600;
//  bg2.width = game.world.width;
  
  let bg3 = this.background.create(0,-500,'tm4');
  bg3.body.velocity.y = 600;
//  bg3.width = game.world.width;
}


gameplayState.prototype.generateMap = function(curveFun,type)  {
  let range = 60;
  let slice = 360/range;
  let theta = Math.PI/2;
  let distance = 375;
  let curve = 24;
  let length = 1;
  let stride = 10;
  let offset = 200;
  let coef = Math.sign(Math.random()*2-1);
  
  console.log(coef);
  let numtimes = 10;
  
  if(type==0) {
    for(var i=0;i<360*length;i+=slice) {
      var y = curveFun(i,curve);
      var x = i/slice;

      let lwall = this.leftwall.create(y*stride+offset,-1*x*100-100,'wall');
      lwall.body.velocity.y = 600;
      lwall.width = 600;
      lwall.x -=600;
      lwall.x -=1000;

      let rwall = this.rightwall.create(y*stride+distance+offset, -1*x*100-100,'wall');
      rwall.body.velocity.y = 600;
      rwall.width = 600;
      rwall.x +=1000;
    }
  } else {
      let val = Math.random();
      let curr = 0;  
      for(var j=0;j<numtimes;j++) {
        val = Math.random();
        coef = Math.sign(Math.random()*2-1);
        for(var i=0;i<10;i++) {
          var y = coef* curveFun(i,range/2,val)+50;
          console.log(i,y);
          var x = curr;

          let lwall = this.leftwall.create(y*5,-1*x*100-100,'wall');
          lwall.body.velocity.y = 600;
          lwall.width = 600;
          lwall.x -=600;
          lwall.x -=1000;

          let rwall = this.rightwall.create(y*5+distance, -1*x*100-100,'wall');
          rwall.body.velocity.y = 600;
          rwall.width = 600;
          rwall.x +=1000;
          curr++;
        } 
        curr+=1;
      }
  }
}

gameplayState.prototype.create = function()
{ 	
    this.wallit = 0;
    this.bgit = 0;
    
    //background
    this.background = game.add.group();
    this.background.enableBody = true;
    this.addbackground();
    
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
    this.generateMap(line, 1);
  
	//score
	this.deerScoreText = game.add.text(600, 16, 'Score: 0', { fontSize: '24px', fill: '#ffffff' });
	this.livesScoreText = game.add.text(600, 48, 'Lives: 3', { fontSize: '24px', fill: '#ffffff' });
	
	//pause buttons
	pauseButton = game.add.button(0, game.world.height-64,
    'pauseButton', pauseGame, this, 2, 1, 0);
	pauseButton.scale.setTo(.255,.24)
	
	restartLevelButton = game.add.button(game.world.width/2, game.world.height/2-300,
	'restartButton', restartLevelFromPause, this, 2, 1, 0);
	restartLevelButton.anchor.set(0.5,0.5);
	restartLevelButton.kill();
	
	
	resumeButton = game.add.button(game.world.width/2, game.world.height/2-300,
	'resumeButton', resumeGame, this, 2, 1, 0);
	resumeButton.anchor.set(0.5,0.5);
	resumeButton.kill();
	
	mainMenuButton = game.add.button(game.world.width/2, game.world.height/2-300,
	'mainMenuButton', goToMainMenu, this, 2, 1, 0);
	mainMenuButton.anchor.set(0.5,0.5);
	mainMenuButton.kill();
	
	//sounds
	this.deerHit = game.add.audio('deerHit');
	this.loseLife = game.add.audio('loseLife');
	this.loseGame = game.add.audio('loseGame');
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

        if(this.background.children[this.bgit].body.y>=1500) {
          this.background.children[this.bgit].y = -500;
          this.bgit = (this.bgit + 1) % 4;
        }
        
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
          this.generateMap(sincurve,0);
        }
	}
	
	
	//pause game
	if (game.pause){
      //resume button
      resumeButton.reset(game.world.width/2 - 5, game.world.height/2-200);
      //restart button
      restartLevelButton.reset(game.world.width/2 - 5, game.world.height/2);
      //main menu button
      mainMenuButton.reset(game.world.width/2 - 5,game.world.height/2 + 200);	
      this.setVelocity(0);
	}
	else if(!game.pause){//unpause game
      this.setVelocity(600);
	}
  
    //when you lose
	if (this.lives == 0){
        
        this.setVelocity(0);
		if(this.playDeathSound){
			this.loseGame.play();
		}
		this.playDeathSound = false;
		pauseButton.kill()
		this.deers.forEach(function(item){
			item.destroy();
		},this);
		
		this.rocks.forEach(function(item){
			item.destroy();
		},this);
		
		this.cows.forEach(function(item){
			item.destroy();
		},this);
		
		this.rightwall.forEach(function(item) {
			item.destroy();
        }, this);
		this.leftwall.forEach(function(item) {
			item.destroy();
        }, this);
		this.arrow.destroy();
		
		button1 = game.add.button(game.world.width/2, game.world.height/2 - 100,
		'restartButton', restartLevel, this, 2, 1, 0);
		button1.anchor.set(0.5,0.5);
		
		mainMenuButtonFromDeath = game.add.button(game.world.width/2, game.world.height/2+100,
		'mainMenuButton', goToMainMenuFromDeath, this, 2, 1, 0);
		mainMenuButtonFromDeath.anchor.set(0.5,0.5);
	}
};

gameplayState.prototype.setVelocity = function(vel) {    
  this.deers.forEach(function(item){
      item.body.velocity.y = vel;
  },this);

  this.rocks.forEach(function(item){
      item.body.velocity.y = vel;
  },this);

  this.cows.forEach(function(item){
      item.body.velocity.y = vel;
  },this);

  this.leftwall.forEach(function(item){
      item.body.velocity.y = vel;
  },this);

  this.rightwall.forEach(function(item){
      item.body.velocity.y = vel;
  },this);

  this.background.forEach(function(item){
      item.body.velocity.y = vel;
  },this);
}

gameplayState.prototype.updateScore = function(arrow, deer) {    
    // Removes the deer from the screen
    deer.destroy();
    //  Add and update the score
    this.deerScore += 1;
    this.deerScoreText.text = 'Score: ' + this.deerScore;
	this.deerHit.play();
}

gameplayState.prototype.updateLife = function(arrow, rock) {
    // Removes the rock from the screen
    rock.destroy();
    //  Subtract and update the score
    this.lives -= 1;
    this.livesScoreText.text = 'Lives: ' + this.lives;
	this.loseLife.play();
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

function restartLevelFromPause(){
	this.lives = 3;
	this.score = 0;
	game.pause = false;
	this.deerTimer = 0;
	this.cowTimer = 1200;
	this.rockTimer = 2300;
	this.pauseGame = false;
	game.state.restart();
}

function pauseGame(){
	game.pause = true;
}

function resumeGame(){
	resumeButton.kill();
	restartLevelButton.kill();
	mainMenuButton.kill();
	this.deerTimer = 0;
	this.cowTimer = 1200;
	this.rockTimer = 2300;
	game.pause = false;
}

function goToMainMenu(){
	resumeButton.kill();
	restartLevelButton.kill();
	mainMenuButton.kill();
	this.deerTimer = 0;
	this.cowTimer = 1200;
	this.rockTimer = 2300;
	this.lives = 3;
	this.score = 0;
	game.pause = false;
	game.state.start("Menu");
}

function goToMainMenuFromDeath(){
	this.lives = 3;
	this.score = 0;
	this.deerTimer = 0;
	this.cowTimer = 1200;
	this.rockTimer = 2300;
	mainMenuButtonFromDeath.kill();
	game.state.start("Menu");
}

