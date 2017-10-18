/** @constructor */
let lose = function() {};

lose.prototype.preload = function() {
    // load assets needed for the preloader here 
    game.load.image('cutscene1', 'assets/cutscenes/Ending-1.png');
    game.load.image('cutscene2', 'assets/cutscenes/Ending-Bad-1.png');
    game.load.image('cutscene3', 'assets/cutscenes/Ending-Bad-2.png');
    game.load.image('cutscene4', 'assets/cutscenes/Ending-Worst-1.png');
    game.load.image('cutscene5', 'assets/cutscenes/Ending-Worst-2.png');
};

lose.prototype.create = function() { 
    this.cutscene1 = game.add.sprite(0,0,'cutscene1');
    this.cutscene1.visible = true;
    this.cutscene2 = game.add.sprite(0,0,'cutscene2');
    this.cutscene2.visible = false;
    this.cutscene3 = game.add.sprite(0,0,'cutscene3');
    this.cutscene3.visible = false;
    this.cutscene4 = game.add.sprite(0,0,'cutscene4');
    this.cutscene4.visible = false;
    this.cutscene5 = game.add.sprite(0,0,'cutscene5');
    this.cutscene5.visible = false;
    
    this.timer = 0;
    this.cooldown = 30;
};

lose.prototype.update = function() {
    if (game.input.activePointer.isDown && this.timer > this.cooldown) {
        if (this.cutscene1.visible) {
            this.cutscene1.visible = false;
            
            if (game.result == "Bad") {
                this.cutscene2.visible = true;
            }
            else if (game.result == "Worst") {
                this.cutscene4.visible = true;
            }
        }
        
        else if (this.cutscene2.visible) {
            this.cutscene2.visible = false;
            this.cutscene3.visible = true;
        }
        
        else if (this.cutscene3.visible) {
            this.cutscene3.visible = false;
            game.state.start('Menu');
        }
        
        else if (this.cutscene4.visible) {
            this.cutscene4.visible = false;
            this.cutscene5.visible = true;
        }
        
        else if (this.cutscene5.visible) {
            this.cutscene5.visible = false;
            game.state.start('Menu');
        }
        this.timer = 0;
    }
    this.timer += 1;
};