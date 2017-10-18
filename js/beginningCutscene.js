/** @constructor */
let beginningState = function()
{
	
};

beginningState.prototype.preload = function()
{
  // load assets needed for the preloader here 
  game.load.image('cutscene1','assets/cutscenes/Intro-1.png');
  game.load.image('cutscene2','assets/cutscenes/Intro-2.png');
  game.load.image('cutscene3','assets/cutscenes/Intro-3.png');
  game.load.image('cutscene4','assets/cutscenes/Intro-4.png');
  game.load.image('cutscene5','assets/cutscenes/Intro-5.png');
  game.load.image('cutscene6','assets/cutscenes/Intro-6.png');
  
};

beginningState.prototype.create = function()
{ 
	this.cutscene1 = game.add.sprite(0,0,'cutscene1');
	this.cutscene1.visible = true;
	this.cutscene2 = game.add.sprite(0,0,'cutscene2');
	this.cutscene2.visible = false;
	this.cutscene3 = game.add.sprite(0,0,'cutscene3');
	this.cutscene3.visible = false;
	this.cutscene4 = game.add.sprite(0,0,'cutscene4');
	this.cutscene4.visible = false;
	this.cutscene5 = game.add.sprite(0,0,'cutscene5');
	this.cutscene5.visible = false;
	this.cutscene6 = game.add.sprite(0,0,'cutscene6');
	this.cutscene6.visible = false;
};

beginningState.prototype.update = function()
{ 
	if (this.cutscene1.visible && game.input.mousePointer.isDown){
		this.cutscene1.visible = false;
		this.cutscene2.visible = true;
	}
	else if (this.cutscene2.visible && game.input.mousePointer.isDown){
		this.cutscene2.visible = false;
		this.cutscene3.visible = true;
	}
	else if (this.cutscene3.visible && game.input.mousePointer.isDown){
		this.cutscene3.visible = false;
		this.cutscene4.visible = true;
	}
	else if (this.cutscene4.visible && game.input.mousePointer.isDown){
		this.cutscene4.visible = false;
		this.cutscene5.visible = true;
	}
	else if (this.cutscene5.visible && game.input.mousePointer.isDown){
		this.cutscene5.visible = false;
		this.cutscene6.visible = true;
	}
	else if (this.cutscene6.visible && game.input.mousePointer.isDown){
		this.cutscene6.visible = false;
        game.gamemode = "story";
		game.state.start('Preload');
	}
	
 
};
