//constructor. A function constructor, no less!
let preloadState = function()
{

};

//when Phaser creates an instance of this state, we want it to
preloadState.prototype.preload = function()
{
    game.load.image('arrow', 'assets/arro.png');
	game.load.image('deer', 'assets/deer.png');
	game.load.image('rock', 'assets/rock.png');
	game.load.image('cow', 'assets/cow.png');
    game.load.image('wall', 'assets/wall.png');
	game.load.image('pauseButton', 'assets/Pause_Button.png');
	game.load.image('resumeButton','assets/Resume_Button.png');
	game.load.image('mainMenuButton','assets/MainMenu_Button.png');
	game.load.image('restartButton','/assets/Restart_Button.png');
    game.load.image('tm1','assets/tm1.png');
    game.load.image('tm2','assets/tm2.png');
    game.load.image('tm3','assets/tm2.png');
	
};  

preloadState.prototype.create = function()
{
	game.state.start("Game");
};

preloadState.prototype.update = function()
{

};

