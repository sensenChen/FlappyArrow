/** @constructor */
let gameplayState = function() {
    //ui variables
    this.deerScore = 0;
    this.lives = 3;
    
    //timer variables
    this.deerTimer = 0;
    this.rockTimer = 2300;
    this.cowTimer = 1200;
    this.oneUpTimer = 0;
    
    //tree and checkpoint variables
    this.treeInterval = 500; //interval in between tree generation
    this.numTreesPerInterval = 0; //number of trees at each generation
    this.treespercheckpoint = 10; //number of tree generations to reach the next checkpoint
    this.checkpointsperlevel = 4; //number of checkpoints to complete the level
    this.levellength = 100; //basically the total number of tree generations in the level
    
    //counters
    this.treeTimer = 0;
    this.treecounter = 0;
    this.checkpointcounter = 0;
    this.levelprogress = 0;
    this.difficulty = 20;
    
    //variables for slowing down arrow
    this.isSlowed = false;
    this.slowDownTimer = 0;
    this.arrowSpeed = 7;
    this.playDeathSound = true;
};

gameplayState.prototype.preload = function() {
    //load assets needed for the preloader here 
    game.load.audio('deerHit', 'assets/Music&sound/Hit_deer.wav');
    game.load.audio('loseLife', 'assets/Music&sound/Lose_life.wav');
    game.load.audio('loseGame', 'assets/Music&sound/Die.wav');
    game.load.audio('cowHit', 'assets/Music&sound/Hit_cow.wav');
    game.load.audio('backgroundSong', 'assets/Music&sound/Music-2.wav');
    game.load.audio('gotOneUp', 'assets/Music&sound/Pickup_life.wav');
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

//adds background...?
gameplayState.prototype.addbackground = function() {
    let bg = this.background.create(0, 1000, 'tm4');
    bg.body.velocity.y = this.vel;
    //bg.width = game.world.width;
    
    let bg1 = this.background.create(0, 500, 'tm1');
    bg1.body.velocity.y = this.vel;
    //bg1.width = game.world.width;
    
    let bg2 = this.background.create(0, 0, 'tm2');
    bg2.body.velocity.y = this.vel;
    //bg2.width = game.world.width;
    
    let bg3 = this.background.create(0, -500, 'tm3');
    bg3.body.velocity.y = this.vel;
    //bg3.width = game.world.width;
    
    //let bg4 = this.background.create(0, -1000, 'tm4');
    //bg4.body.velocity.y = this.vel; 
}

//generates a set of walls
gameplayState.prototype.generateMap = function(curveFun, type) {
    let range = 60;
    let slice = 360/range;
    let theta = Math.PI/2;
    let distance = 375;
    let curve = 24;
    let length = 1;
    let stride = 10;
    let offset = 200;
    let coef = Math.sign(Math.random()*2-1);
    
    //console.log(coef);
    let numtimes = 10;
    
    if (type == 0) {
        for (var i = 0; i < 360*length; i += slice) {
            var y = curveFun(i,curve);
            var x = i/slice;
            
            let lwall = this.leftwall.create(y*stride+offset, -1*x*100-100, 'wall');
            lwall.body.velocity.y = this.vel;
            lwall.width = 1000;
            lwall.x -= 1000;
            lwall.x -= 1000;
            
            let rwall = this.rightwall.create(y*stride+distance+offset, -1*x*100-100, 'wall');
            rwall.body.velocity.y = this.vel;
            rwall.width = 1000;
            rwall.x += 1000;
        }
    }
    else {
        let val = Math.random();
        let curr = 0; 
        
        offset = distance - this.it * 50;
        if (offset < 200) {
            offset = 200;
        }
        
        for (var j = 0; j < numtimes; j++) {
            val = Math.random();
            coef = Math.sign(Math.random()*2-1);
            for (var i = 0; i < 5; i++) {
                var y = coef * curveFun(i, range/2, val) + 50;
                var x = curr;
                
                let lwall = this.leftwall.create(y*5, -1*x*100-100, 'wall');
                lwall.body.velocity.y = this.vel;
                lwall.width = 1000;
                lwall.x -= 1000;
                lwall.x -= 1000;
                
                let rwall = this.rightwall.create(y*5+offset, -1*x*100-100, 'wall');
                rwall.body.velocity.y = this.vel;
                rwall.width = 1000;
                rwall.x += 1000;
                curr++;
            } 
        curr += 2;
        }
    }
}

gameplayState.prototype.create = function() {
    //level progress
    /*
    this.mapspercheckpoint = 1;
    this.checkpointsperlevel = 4;
    this.mapcounter = 0;
    this.checkpointcounter = 0;
    this.levellength = 50 * this.mapspercheckpoint * this.checkpointsperlevel;
    this.levelprogress = 0;
    */
    
    //this.wallit = 0;
    this.bgit = 0;
    this.it = 0;  
    this.vel = 600;
    
    //background
    this.background = game.add.group();
    this.background.enableBody = true;
    this.addbackground();
    
    //a parent group to hold all the obstacles
    this.obstacles = game.add.group();
    
    //arrow create stuff
    this.arrow = game.add.sprite(game.world.width/2 -32, game.world.height - 128, "arrow");
    game.physics.enable(this.arrow, Phaser.Physics.ARCADE);
    this.arrow.body.gravity.y = 0;
    this.arrow.body.collideWorldBounds = true;
    this.arrow.body.setSize(20, 64, 20, 0);
    this.arrow.animations.add('flash');
    
    //deer stuff
    this.deers = game.add.group(this.obstacles);
    this.deers.enableBody = true;
    
    //rock stuff
    this.rocks = game.add.group(this.obstacles);
    this.rocks.enableBody = true;
    
    //cow stuff
    this.cows = game.add.group(this.obstacles);
    this.cows.enableBody = true;
    
    //oneUp stuff
    this.oneUps = game.add.group(this.obstacles);
    this.oneUps.enableBody = true;
    
    //trees stuff
    this.trees = game.add.group(this.obstacles);
    this.trees.enableBody = true;
    
    /*
    //walls stuff
    this.leftwall = game.add.group(this.obstacles);
    this.leftwall.enableBody = true;
    this.rightwall = game.add.group(this.obstacles);
    this.rightwall.enableBody = true;
    this.generateMap(line, 1);
    */
    
    //score text
    this.deerScoreText = game.add.text(600, 16, 'Score: 0', { fontSize: '24px', fill: '#ffffff' });
    this.livesScoreText = game.add.text(600, 48, 'Lives: 3', { fontSize: '24px', fill: '#ffffff' });
    
    //pause menu buttons
    pauseBoard = game.add.sprite(0, 0, 'pauseBoard');
    pauseBoard.anchor.set(0.5, 0.5);
    pauseBoard.kill();
    
    pauseBoardText = game.add.sprite(0, 0, 'pauseBoardText');
    pauseBoardText.anchor.set(0.5, 0,5);
    pauseBoardText.kill();
    
    pauseButton = game.add.button(0, game.world.height-64, 'pauseButton', pauseGame, this, 2, 1, 0);
    pauseButton.scale.setTo(.512, .481)
    
    restartLevelButton = game.add.button(game.world.width/2, game.world.height/2-300, 'restartButton', restartPause, this, 2, 1, 0);
    restartLevelButton.anchor.set(0.5, 0.5);
    restartLevelButton.kill();
    
    resumeButton = game.add.button(game.world.width/2, game.world.height/2-300, 'resumeButton', resumeGame, this, 2, 1, 0);
    resumeButton.anchor.set(0.5, 0.5);
    resumeButton.kill();
    
    mainMenuButton = game.add.button(game.world.width/2, game.world.height/2-300, 'mainMenuButton', goToMainMenu, this, 2, 1, 0);
    mainMenuButton.anchor.set(0.5, 0.5);
    mainMenuButton.kill();
    
    button1 = game.add.button(game.world.width/2, game.world.height/2 - 100, 'restartButton', restartThisLevel, this, 2, 1, 0);
    button1.anchor.set(0.5,0.5);
    button1.kill()
    
    mainMenuButtonFromDeath = game.add.button(game.world.width/2, game.world.height/2+100, 'mainMenuButton', goToMainMenuFromDeath, this, 2, 1, 0);
    mainMenuButtonFromDeath.anchor.set(0.5,0.5);
    mainMenuButtonFromDeath.kill();
    
    //sounds
    this.cowHit = game.add.audio('cowHit');
    this.deerHit = game.add.audio('deerHit');
    this.loseLife = game.add.audio('loseLife');
    this.loseLife.volume = 0.2;
    this.deerHit.volume = 0.2;
    this.cowHit.volume = 0.2;
    this.loseGame = game.add.audio('loseGame');
    this.gotOneUp = game.add.audio('gotOneUp');
    this.backgroundSong = game.add.audio('backgroundSong');
    this.backgroundSong.loop = true;
    this.backgroundSong.play()
    
    //progress bar initial draw
    this.progressbarleftpadding = 64;
    this.progressbarrightpadding = 16;
    this.progressbarbottompadding = 16;
    this.progressbarheight = 40;
    this.progressbarwidth = game.world.width - this.progressbarleftpadding - this.progressbarrightpadding;
    this.progressbarcolor = 0xD2A654;
    this.progressbar = game.add.graphics(0, 0);
    this.progressbar.lineStyle(2, this.progressbarcolor, 1);
    //this.progressbar.drawRect(this.progressbarleftpadding, game.world.height - this.progressbarheight - this.progressbarbottompadding, this.progressbarwidth, this.progressbarheight);
    this.pb = game.add.sprite(this.progressbarleftpadding - 10, game.world.height - this.progressbarheight - this.progressbarbottompadding - 10, 'pb');
    this.pb.width = this.progressbarwidth + 20;
    this.pb.height = this.progressbarheight + 20;
    
    //just so the saved values aren't null
    this.checkpointreached();
};

gameplayState.prototype.update = function() {
    //while player has lives remaining
    if (this.lives > 0 && !game.pause) {
        
        //arrow movement based on mouse down
        if (game.input.mousePointer.isDown && (game.input.mousePointer.x > 64 || game.input.mousePointer.y < game.world.height-64)) {
            //if slowdown is not active, move normally
            if (!this.isSlowed) {
                let mouseX = game.input.mousePointer.x;
                let dist = mouseX - this.arrow.body.x - this.arrow.body.width/2;
                let speed = this.arrowSpeed * Math.abs(dist)/70 * Math.sign(dist);
                this.arrow.body.x += speed;
            }
            //if slowdown is active, move slower
            else if (this.isSlowed) {
                let mouseX = game.input.mousePointer.x;
                let dist = mouseX - this.arrow.body.x - this.arrow.body.width/2;
                let speed = this.arrowSpeed/4 * Math.abs(dist)/70 * Math.sign(dist);
                this.arrow.body.x += speed;
            }
        }
        
        //create obstacles at random times
        if (this.deerTimer >= Math.random() * 2000 + 6000) {
            let deer = this.deers.create(Math.random() * game.width/2 + game.width/4, 100, 'deer');
            deer.body.velocity.y = this.vel;
            this.deerTimer = 0;
        }
        this.deerTimer = this.deerTimer + game.time.elapsed;
        
        if (this.rockTimer >= Math.random() * 2000 + 3000) {
            let rock = this.rocks.create(Math.random() * game.width/2 + game.width/4, 100, 'rock');
            rock.body.velocity.y = this.vel;
            this.rockTimer = 0;
        }
        this.rockTimer = this.rockTimer + game.time.elapsed;
        
        if (this.cowTimer >= Math.random() * 2000 + 5000) {
            let cow = this.cows.create(Math.random() * game.width/2 + game.width/4, 100, 'cow');
            cow.body.velocity.y = this.vel;
            this.cowTimer = 0;
        }
        this.cowTimer = this.cowTimer + game.time.elapsed;
        
        if (this.oneUpTimer >= Math.random() * 5000 + 12000) {
            let oneUp = this.oneUps.create(Math.random() * game.width/2 + game.width/4, 100, 'oneUp');
            oneUp.body.velocity.y = this.vel;
            this.oneUpTimer= 0;
        }
        this.oneUpTimer = this.oneUpTimer + game.time.elapsed;
        
        if (this.treeTimer >= this.treeInterval) {
            for (var i = 0; i < this.numTreesPerInterval; i++) {
                let min = game.world.width * i / this.numTreesPerInterval;
                let max = game.world.width * (i+1) / this.numTreesPerInterval;
                let range = max - min;
                let tree = this.trees.create(min + (Math.random() * range) ,100, 'tree');
                tree.body.velocity.y = this.vel;
            }
            this.treeTimer = 0;
            
            //increment level progress for each row of trees drawn
            this.treecounter += 1;
            this.levelprogress += 1;
            this.difficulty +=1;
            
            console.log(this.difficulty);
            if(this.difficulty%30==0 && this.numTreesPerInterval<4) {
              this.numTreesPerInterval++;
            }
            
            this.updateprogressbar();
        }
        this.treeTimer = this.treeTimer + game.time.elapsed;
        
        //turn off slowdown if timer is up
        if (this.slowDownTimer >= 3500) {
            this.isSlowed = 0;
            this.arrow.animations.stop(null, true);
            this.slowDownTimer = 0;
        }
        //otherwise, increment timer
        else {
            this.slowDownTimer += game.time.elapsed;
        }
        
        //update score
        game.physics.arcade.overlap(this.arrow, this.deers, this.updateScore, null, this);
        game.physics.arcade.overlap(this.arrow, this.rocks, this.updateLife, null, this);
        game.physics.arcade.overlap(this.arrow, this.cows, this.slowDown, null, this);
        game.physics.arcade.overlap(this.arrow, this.oneUps, this.increaseLife, null, this);
        game.physics.arcade.overlap(this.arrow, this.trees, this.updateLife, null, this);
		
		//check overlaps with other stuff
		game.physics.arcade.overlap(this.deers,this.rocks,this.moveSprites, null, this);
		game.physics.arcade.overlap(this.deers,this.cows,this.moveSprites, null, this);
		game.physics.arcade.overlap(this.deers,this.oneUps,this.moveSprites, null, this);
		game.physics.arcade.overlap(this.trees,this.deers,this.moveSprites, null, this);
		game.physics.arcade.overlap(this.rocks,this.cows,this.moveSprites, null, this);
		game.physics.arcade.overlap(this.rocks,this.oneUps,this.moveSprites, null, this);
		game.physics.arcade.overlap(this.cows,this.OneUps,this.moveSprites, null, this);
		game.physics.arcade.overlap(this.trees,this.cows,this.moveSprites, null, this);
		game.physics.arcade.overlap(this.trees,this.oneUps,this.moveSprites, null, this);
         
        /*
        //idk how else to do this without breaking the walls... increment level progress for each wall drawn
        if (this.wallit < this.rightwall.children.length && this.rightwall.children[this.wallit].y > 500 && this.rightwall.children[this.wallit].y < game.world.height) {
            this.levelprogress += 1;
            this.updateprogressbar();
        }
        */
        
        /*
        //I think these draw the walls at a certain height (they initially appear off screen)
        if (this.wallit < this.leftwall.children.length && this.leftwall.children[this.wallit].y > 500) {
            this.leftwall.children[this.wallit].x += 1000;
        }
        if (this.wallit < this.rightwall.children.length && this.rightwall.children[this.wallit].y > 500) {
            this.rightwall.children[this.wallit].x -= 1000;
            this.wallit++;
        }
        */
        
        //destroy obstacles when they run off the screen... except walls i guess. I don't get these walls at all
        this.obstacles.forEach(function(group) {
            /*
            if (group == this.leftwall || group == this.rightwall) {}
            else {
                group.forEach(function(item) {
                    if (item.body.y > game.world.height) {
                        item.destroy();
                    }
                }, this);
            }
            */
            group.forEach(function(item) {
                if (item.body.y > game.world.height) {
                    item.destroy();
                }
            }, this);
        }, this);
        
        //dunno what this does
        if (this.background.children[this.bgit].body.y >= 1500) {
            this.background.children[this.bgit].y = -500;
            this.bgit = (this.bgit + 1) % 4;
        }
        
        /*
        //when the map is finished, delete it and generate a new one
        if (this.leftwall.children.length > 0 && this.leftwall.children[this.leftwall.children.length-1].body.y > game.world.height && this.wallit == this.leftwall.children.length) {
            this.leftwall.forEach(function(item) {
                if (item.body.y > game.world.height) {
                    item.destroy();
                }
            }, this);

            this.rightwall.forEach(function(item) {
                if (item.body.y > game.world.height){
                    item.destroy();
                }
            }, this);
            
            this.wallit = 0;
            //this.generateMap(sincurve,0);
            this.it++;
            this.generateMap(line, 1, 5);
            this.mapcounter += 1;
        }
        */
        
        /*
        //checkpoint reached
        if (this.mapcounter >= this.mapspercheckpoint) {
            //update counters
            this.mapcounter = 0;
            this.checkpointcounter += 1;
            this.checkpointreached();
        }
        */
        
        //when number of tree generations reach the threshold, activate a checkpoint
        if (this.levelprogress%Math.floor(this.levellength*(1/this.checkpointsperlevel))==0) {
            //update counters
            this.treecounter = 0;
            this.checkpointcounter += 1;
            this.checkpointreached();
        }
    }
    
    //when level is finished, do something
    if (this.levelprogress >= this.levellength) {
        this.finishlevel();
    }
    
    //pause game
    if (game.pause) {
        //pauseBoard stuff
        pauseBoard.reset(game.world.width/2,game.world.height/2);
        pauseBoardText.reset(game.world.width/2, game.world.height/2-600)
        
        //resume button
        resumeButton.reset(game.world.width/2 - 5, game.world.height/2);
        
        //restart button
        restartLevelButton.reset(game.world.width/2 - 5, game.world.height/2+200);
		console.log(restartLevelButton);
        
        //main menu button
        mainMenuButton.reset(game.world.width/2 - 5, game.world.height/2+400);
        this.setVelocity(0);
    }
    
    //unpause game
    else if (!game.pause) {
        this.setVelocity(this.vel);
    }
    
    //if player has run out of lives
    if (this.lives == 0) {
        this.arrow.animations.stop(null, true);
        //play a sound
        if (this.playDeathSound) {
            this.loseGame.play();
        }
        this.playDeathSound = false;
        
        //kill everything!!
        this.obstacles.forEach(function(group) {
            group.callAll('kill');
        }, this);
        pauseButton.kill()
        
        this.background.forEach(function(item) {
            item.body.velocity.y = 0;
        }, this);
        
        //buttons
        button1.reset(game.world.width/2, game.world.height/2 - 100);
        mainMenuButtonFromDeath.reset(game.world.width/2, game.world.height/2 +100);
    }
};

//sets the velocity of everything except arrow
gameplayState.prototype.setVelocity = function(vel) {
    this.obstacles.forEach(function(group) {
        group.forEach(function(item) {
            item.body.velocity.y = vel;
        }, this);
    }, this);
    
    this.background.forEach(function(item) {
        item.body.velocity.y = vel;
    }, this);
}

//called when a deer is hit, removes deer and increments score
gameplayState.prototype.updateScore = function(arrow, deer) {
    deer.destroy();
    this.deerHit.play();
    
    this.deerScore += 1;
    this.deerScoreText.text = 'Score: ' + this.deerScore;
}

//called when a rock or tree is hit, decrements lives and restarts from last checkpoint
gameplayState.prototype.updateLife = function(arrow, rock) {
    this.lives -= 1;
    this.livesScoreText.text = 'Lives: ' + this.lives;
    this.loseLife.play();
    
    this.restartfromlastcheckpoint();
}

//called when a cow is hit, removes the cow, turns on slowdown, and flashes arrow
gameplayState.prototype.slowDown = function(arrow, cow){
    cow.destroy();
    this.cowHit.play();
    
    this.isSlowed = true;
    this.arrow.animations.play('flash', 6, true);
    this.slowDownTimer = 0;
}

//restart from the lastcheckpoint by removing all obstacles, regenerating the map, and resetting certain values to last saved values
gameplayState.prototype.restartfromlastcheckpoint = function() {
    //remove all the obstacles from the screen
    this.obstacles.forEach(function(group) {
        group.callAll('kill');
    }, this);
    
    /*
    //because walls are buggy
    this.leftwall.destroy();
    this.rightwall.destroy();
    this.leftwall = game.add.group(this.obstacles);
    this.leftwall.enableBody = true;
    this.rightwall = game.add.group(this.obstacles);
    this.rightwall.enableBody = true;
    this.generateMap(line, 1);
    this.wallit = 0;
    */
    
    this.treecounter = 0;
    
    //revert progress and score to last saved values
    this.levelprogress = this.lastprogress;
    this.updateprogressbar();
    this.deerScore = this.lastscore;
    this.deerScoreText.text = 'Score: ' + this.deerScore;
}

//called when a checkpoint is reached, updates saved values
gameplayState.prototype.checkpointreached = function() {
    this.lastprogress = this.levelprogress;
    this.lastscore = this.deerScore;
    console.log("checkpoint");
}

//called every time the level progress is updated, redraws the progress bar
gameplayState.prototype.updateprogressbar = function() {
    this.progressbar.destroy();
    this.progressbar = game.add.graphics(0,0);
    
    //old box drawing
    //this.progressbar.lineStyle(2, this.progressbarcolor, 1);
    //this.progressbar.drawRect(this.progressbarleftpadding, game.world.height - this.progressbarheight - this.progressbarbottompadding, this.progressbarwidth, this.progressbarheight);
    
    //fill bar
    this.progressbar.lineStyle(2, this.progressbarcolor, 1);
    this.progressbar.beginFill(this.progressbarcolor, 0.8);
    
//    let progress=0;
    if(this.levelprogress<this.levellength) {
      progress = (this.levelprogress%this.levellength/ this.levellength)
    } else {
      progress = 1;
    }

    progress*=this.levellength;  
//    progress=this.le
    progresswidth = (7*progress)-.29*progress;
    
//    console.log(progresswidth);
  
    this.progressbar.drawRect(this.progressbarleftpadding, game.world.height - this.progressbarheight - this.progressbarbottompadding, progresswidth, this.progressbarheight);
    
    //progress bar sprite replaces old box drawing
    this.pb.destroy();
    this.pb = game.add.sprite(this.progressbarleftpadding - 10, game.world.height - this.progressbarheight - this.progressbarbottompadding - 10, 'pb');
    this.pb.width = this.progressbarwidth + 20;
    this.pb.height = this.progressbarheight + 20;
    
    //console.log("Level progress: " + (progress * 100) + "%");
}

//called when the level is finished
gameplayState.prototype.finishlevel = function() {
    
}

//called when a oneup is hit, removes the oneup and increments lives with a cap of 3
gameplayState.prototype.increaseLife = function(arrow, oneUp){
    oneUp.destroy();
    
    if (this.lives < 3){
        this.gotOneUp.play();
        this.lives = this.lives + 1;
    }
    this.livesScoreText.text = 'Lives: ' + this.lives;
}

gameplayState.prototype.moveSprites = function(object1,object2){
	object2.body.x = object2.body.x + 64;
}

//called when restart button is clicked from game over menu, restarts the game state
//function restartLevel() {
//
//}

function restartThisLevel() {
    this.lives = 3;
    this.score = 0;
    this.deerTimer = 0;
    this.cowTimer = 1200;
    this.rockTimer = 2300;
    this.backgroundSong.stop();
    this.levelprogress = 0;
    game.state.start("Game");
}


function restartPause() {
    this.lives = 3;
    this.score = 0;
    game.pause = false;
    this.deerTimer = 0;
    this.cowTimer = 1200;
    this.rockTimer = 2300;
    this.pauseGame = false;
    this.levelprogress = 0;
    this.backgroundSong.stop();
    game.state.start("Game");
}
//
////called when restart button is clicked from pause menu, restarts the game state
//function restartLevelFromPause() {
////    this.lives = 3;
////    this.score = 0;
////    game.pause = false;
////    this.deerTimer = 0;
////    this.cowTimer = 1200;
////    this.rockTimer = 2300;
////    this.pauseGame = false;
////    this.backgroundSong.stop();
////    game.state.start("Game");
//}

//called when the pause button is clicked, pauses the game
function pauseGame() {
    game.pause = true;
}

//called when the resume button is clicked from the pause menu, removes the pause menu and resumes gameplay
function resumeGame() {
    pauseBoard.kill();
    pauseBoardText.kill();
    resumeButton.kill();
    restartLevelButton.kill();
    mainMenuButton.kill();
    this.deerTimer = 0;
    this.cowTimer = 1200;
    this.rockTimer = 2300;
    game.pause = false;
}

//called when menu button is clicked from the pause menu, switches to the menu state
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
    this.backgroundSong.stop();
    game.state.start("Menu");
}

//called when menu button is clicked from the game over menu, switches to the menu state
function goToMainMenuFromDeath(){
    this.lives = 3;
    this.score = 0;
    this.deerTimer = 0;
    this.cowTimer = 1200;
    this.rockTimer = 2300;
    mainMenuButtonFromDeath.kill();
    game.state.start("Menu");
}
