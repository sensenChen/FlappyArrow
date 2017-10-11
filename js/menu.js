//constructor. A function constructor, no less!
let menuState = function()
{

};

//when Phaser creates an instance of this state, we want it to
menuState.prototype.preload = function()
{
    game.load.image('button', 'assets/button.png');

};

menuState.prototype.create = function()
{
	this.title = game.add.text(game.world.width/2, game.world.centerY - 300,
		'Title', { fontSize: '32px', fill: '#ffffff' });
	this.title.anchor.set(0.5,0);
		
	button1 = game.add.button(game.world.width/2, game.world.height/2 + 100,
		'button', startGame, this, 2, 1, 0);
	button1.anchor.set(0.5,0.5);
	this.startGameText = game.add.text(game.world.width/2, game.world.height/2 + 100,
		'Start Game', { fontSize: '32px', fill: '#000000' });
	this.startGameText.anchor.set(0.5,0.5);
		
	button2 = game.add.button(game.world.width/2, game.world.height/2 + 350,
		'button', instructions, this, 2, 1, 0);
	button2.anchor.set(0.5,0.5);
	this.instructionsText = game.add.text(game.world.width/2, game.world.height/2 + 350,
		'Instructions', { fontSize: '32px', fill: '#000000' });
	this.instructionsText.anchor.set(0.5,0.5);
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