/** @constructor */
let win3 = function() {};

win3.prototype.preload = function() {
    // load assets needed for the preloader here 
    game.load.image('cutscene1', 'assets/cutscenes/Ending-Good-1.png');
    game.load.image('cutscene2', 'assets/cutscenes/Ending-Good-2.png');
};

win3.prototype.create = function() { 
    this.cutscene1 = game.add.sprite(0,0,'cutscene1');
    this.cutscene1.visible = true;
    this.cutscene2 = game.add.sprite(0,0,'cutscene2');
    this.cutscene2.visible = false;
    
    this.timer = 0;
    this.cooldown = 30;
};

win3.prototype.update = function() {
    if (game.input.activePointer.isDown && this.timer > this.cooldown) {
        if (this.cutscene1.visible) {
            this.cutscene1.visible = false;
            this.cutscene2.visible = true;
        }
        else if (this.cutscene2.visible) {
            this.cutscene2.visible = false;
            game.state.start('Menu');
        }
        this.timer = 0;
    }
    this.timer += 1;
};