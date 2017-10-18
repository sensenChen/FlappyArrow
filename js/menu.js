//constructor. A function constructor, no less!
let menuState = function() {};

//when Phaser creates an instance of this state, we want it to
menuState.prototype.preload = function() {
    game.load.image('background', 'assets/TitleBack_new.png');
    game.load.image('exitButton', 'assets/Exit_Button_new.png');
    game.load.image('instructionsButton', 'assets/Instruction_Button_new.png');
    game.load.image('startButton', 'assets/Start_Button_new.png');
    game.load.image('endlessButton', 'assets/Endless_Button_new.png');
};

menuState.prototype.create = function() {
    this.background = game.add.sprite(0, 0, 'background');
    this.title = game.add.text(game.world.width/2, game.world.centerY - 300, 'Royal Hunter', { fontSize: '32px', fill: '#ffffff' });
    this.title.anchor.set(0.5, 0);
        
    button1 = game.add.button(game.world.width/2-5, game.world.height/2 + 100, 'startButton', startGame, this, 2, 1, 0);
    button1.anchor.set(0.5, 0.5);
    button2 = game.add.button(game.world.width/2-5, game.world.height/2 + 225, 'endlessButton', endlessMode, this, 2, 1, 0);
    button2.anchor.set(0.5, 0.5);
    button3 = game.add.button(game.world.width/2-5, game.world.height/2 + 350, 'instructionsButton', instructions, this, 2, 1, 0);
    button3.anchor.set(0.5, 0.5);
};

menuState.prototype.update = function() {};

function startGame() {
    game.gamemode = "story";
    game.state.start("Beginning");
}

function instructions() {
    game.state.start("Instructions");
}

function endlessMode() {
    game.gamemode = "endless";
    game.state.start("Preload");
}