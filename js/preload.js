//constructor. A function constructor, no less!
let preloadState = function() {};

//when Phaser creates an instance of this state, we want it to
preloadState.prototype.preload = function() {
    game.load.spritesheet('arrow', 'assets/Arrow-Flashing.png',64,64,2);
    game.load.image('deer', 'assets/Deer.png');
    game.load.image('rock', 'assets/Rock.png');
    game.load.image('cow', 'assets/Cow.png');
    game.load.image('wall', 'assets/wall.png');
    game.load.image('pauseButton', 'assets/Pause_Button_new.png');
    game.load.image('resumeButton', 'assets/Resume_Button_new.png');
    game.load.image('mainMenuButton', 'assets/MainMenu_Button_new.png');
    game.load.image('restartButton', 'assets/Restart_Button_new.png');
    game.load.image('tm1', 'UI_elements/bg1.png');
    game.load.image('tm2', 'UI_elements/bg2.png');
    game.load.image('tm3', 'UI_elements/bg3.png');
    game.load.image('tm4', 'UI_elements/bg4.png');    
    game.load.image('pb', 'assets/Bar_Holder.png');
    game.load.image('pauseBoard', 'assets/Pause&info_board.png');
    game.load.image('pauseBoardText', 'assets/Text-2.png');
    game.load.image('oneUp', 'assets/FeatherAndArrow.png');
    game.load.image('tree', 'assets/Tree.png');
};  

preloadState.prototype.create = function() {
    console.log(game.gamemode);
  
    if (game.gamemode == "menu") {
        game.state.start("Game");
    }
    
    if(game.gamemode == "game2") {
      game.state.start("Game2");
    }
    
    if(game.gamemode == "game3") {
      game.state.start("Game3");
    }
  
    if (game.gamemode == "endless") {
        game.state.start("Endless");
    }
};

preloadState.prototype.update = function()
{

};

