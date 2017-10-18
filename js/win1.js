//constructor. A function constructor, no less!
let win1 = function() {};

//when Phaser creates an instance of this state, we want it to
win1.prototype.preload = function() {
    game.load.image('background', 'assets/TitleBack_new.png');
    game.load.image('exitButton', 'assets/Exit_Button_new.png');
    game.load.image('instructionsButton', 'assets/Instruction_Button_new.png');
    game.load.image('startButton', 'assets/Start_Button_new.png');
    game.load.image('endlessButton', 'assets/Endless_Button_new.png');
    game.load.image('win1', 'assets/win1.png');
};

win1.prototype.create = function() {
    this.background = game.add.sprite(0, 0, 'win1');
    button1 = game.add.button(game.world.width/2-5, game.world.height/2 + 350, 'startButton', this.startGame, this, 2, 1, 0);
    button1.anchor.set(0.5, 0.5);
};

win1.prototype.update = function() {};

win1.prototype.startGame = function() {
    game.gamemode = "game2";
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