//constructor. A function constructor, no less!
let preloadState = function()
{

};

//when Phaser creates an instance of this state, we want it to
preloadState.prototype.preload = function()
{
    game.load.image('arrow', 'assets/arrow.png');
	game.load.image('deer', 'assets/deer.png');
	game.load.image('rock', 'assets/rock.png');
	game.load.image('cow', 'assets/cow.png');

};

preloadState.prototype.create = function()
{
	game.state.start("Game");
};

preloadState.prototype.update = function()
{

};

