//constructor. A function constructor, no less!
let instructionsState = function()
{

};

//when Phaser creates an instance of this state, we want it to
instructionsState.prototype.preload = function()
{

};

instructionsState.prototype.create = function()
{
	this.text1 = game.add.text(game.world.width/2, game.world.height/2-300,
	'Click and drag mouse to move\nthe arrow left and right',
	{ fontSize: '32px', fill: '#ffffff' });
	this.text1.anchor.set(0.5,0);
	
	this.text2 = game.add.text(game.world.width/2, game.world.height/2-100, 
	'Hit as many deer as possible\nwhile avoiding everything else',
	{ fontSize: '32px', fill: '#ffffff' });
	this.text2.anchor.set(0.5,0);
	
	
	button1 = game.add.button(game.world.width/2, game.world.height/2 + 350,
		'button', goBack, this, 2, 1, 0);
	button1.anchor.set(0.5,0.5)
	this.goBackText = game.add.text(game.world.width/2, game.world.height/2+ 350,
		'Go Back', { fontSize: '32px', fill: '#000000' });
	this.goBackText.anchor.set(0.5,0.5);
};

instructionsState.prototype.update = function()
{

};

function goBack(){
	game.state.start("Menu");
}