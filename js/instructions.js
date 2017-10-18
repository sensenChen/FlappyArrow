//constructor. A function constructor, no less!
let instructionsState = function() {};

//when Phaser creates an instance of this state, we want it to
instructionsState.prototype.preload = function() {
    game.load.image('backButton', 'assets/X_Button_new.png');
};

instructionsState.prototype.create = function() {
    this.text1 = game.add.text(game.world.width/2, 100, "Guide the arrow to hit as many deer as you can\nby dragging across the screen.\n\nHitting deer will award score and won't break your arrow,\nso hit as many as you can.\n\nDon't think too much about why your arrows\ncan pierce multiple deer just fine\n\nHitting trees and rocks will break your arrow,\nand you only have a limited number of arrows.\n\nThere are some leftover arrows scattered about.\nHitting them will give you an extra arrow.\n\nHitting grazing cattle won't break your arrow,\nbut will slow your arrow down for a bit.\nYou're here to hunt deer, not murder cattle, after all.\n\nYou will reach checkpoints as you progress.\nBreaking an arrow will take you back to the last checkpoint.", { fontSize: '24px', fill: '#ffffff', align: 'center' });
    this.text1.anchor.set(0.5,0);
    
    button1 = game.add.button(game.world.width/2, game.world.height/2 + 350, 'backButton', goBack, this, 2, 1, 0);
    button1.anchor.set(0.5,0.5)
};

instructionsState.prototype.update = function() {};

function goBack() {
    game.state.start("Menu");
}