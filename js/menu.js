//constructor. A function constructor, no less!
let menuState = function()
{

};

//when Phaser creates an instance of this state, we want it to
menuState.prototype.preload = function()
{
	game.load.image('background','assets/Title_background.png');
    game.load.image('exitButton','assets/Exit_Button.png');
	game.load.image('instructionsButton','assets/Instruction_Button.png');
	game.load.image('startButton','assets/Start_Button.png');

};

menuState.prototype.create = function()
{
	this.background = game.add.sprite(0,0,'background');
	this.title = game.add.text(game.world.width/2, game.world.centerY - 300,
		'Title', { fontSize: '32px', fill: '#ffffff' });
	this.title.anchor.set(0.5,0);
		
	button1 = game.add.button(game.world.width/2-5, game.world.height/2 + 100,
		'startButton', startGame, this, 2, 1, 0);
	button1.anchor.set(0.5,0.5);
	button2 = game.add.button(game.world.width/2-5, game.world.height/2 + 350,
		'instructionsButton', instructions, this, 2, 1, 0);
	button2.anchor.set(0.5,0.5);
};

menuState.prototype.update = function()
{

};

function startGame(){
	game.state.start("Preload");
}

function instructions(){
	game.state.start("Instructions");
}