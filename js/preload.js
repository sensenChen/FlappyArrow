//constructor. A function constructor, no less!
let preloadState = function()
{

};

//when Phaser creates an instance of this state, we want it to
preloadState.prototype.preload = function()
{
    game.load.spritesheet('arrow', 'assets/arro.png',64,64,2);
	game.load.spritesheet('deer', 'assets/Deer.png',64,64,2);
	game.load.image('rock', 'assets/rock.png');
	game.load.image('cow', 'assets/cow.png');
    game.load.image('wall', 'assets/wall.png');
	game.load.image('pauseButton', 'assets/Pause_Button.png');
	game.load.image('resumeButton','assets/Resume_Button.png');
	game.load.image('mainMenuButton','assets/MainMenu_Button.png');
	game.load.image('restartButton','/assets/Restart_Button.png');
    game.load.image('tm1','UI_elements/bg1.png');
    game.load.image('tm2','UI_elements/bg2.png');
    game.load.image('tm3','UI_elements/bg3.png');
    game.load.image('tm4','UI_elements/bg4.png');	
    game.load.image('pb','assets/Bar_Holder.png');
};  

preloadState.prototype.create = function()
{
	game.state.start("Game");
};

preloadState.prototype.update = function()
{

};

