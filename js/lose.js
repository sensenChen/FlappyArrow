//constructor. A function constructor, no less!
let lose= function() {};

//when Phaser creates an instance of this state, we want it to
lose.prototype.preload = function() {
    game.load.image('background', 'assets/TitleBack_new.png');
    game.load.image('exitButton', 'assets/Exit_Button_new.png');
    game.load.image('instructionsButton', 'assets/Instruction_Button_new.png');
    game.load.image('startButton', 'assets/Start_Button_new.png');
    game.load.image('endlessButton', 'assets/Endless_Button_new.png');
    game.load.image('lose', 'assets/lose.png');
};

lose.prototype.create = function() {
    this.background = game.add.sprite(0, 0, 'win1');
    button1 = game.add.button(game.world.width/2-5, game.world.height/2 + 350, 'startButton', startGame, this, 2, 1, 0);
    button1.anchor.set(0.5, 0.5);
};

lose.prototype.update = function() {};

function startGame() {
    game.gamemode = "menu";
    game.state.start("Preload");
}

//
//function instructions() {
//    game.state.start("Instructions");
//}
//
//function endlessMode() {
//    game.gamemode = "endless";
//    game.state.start("Preload");
//}