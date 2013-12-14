enchant();

window.onload = function() {
    var game = new Game(640, 640);
    game.preload('./background.jpg');
    game.preload('./enchant.js-builds-0.8.0/images/monster/bigmonster1.gif');
    game.preload('./enchant.js-builds-0.8.0/images/icon0.png');
    game.preload('./enchant.js-builds-0.8.0/images/space0.png');
    game.preload('./enchant.js-builds-0.8.0/images/effect0.png');
    var DropFrequency = 15;
    var DropVelosity = 8;

    game.onload = function() {
        var background = new Sprite(game.rootScene.width, game.rootScene.height);
        background.image = game.assets['./background.jpg'];
        game.rootScene.addChild(background);

        // スコアを入れる変数を用意する
        game.score = 0;
        // スコアを表示するラベルを作成
        var scoreLabel = new Label("SCORE : 0");
        scoreLabel.font = "16px Tahoma";
        scoreLabel.color = "white";
        scoreLabel.x = 10;  // X座標
        scoreLabel.y = 5;   // Y座標
        game.rootScene.addChild(scoreLabel);

        var dragon = new Sprite(80, 80);
        dragon.image = game.assets['./enchant.js-builds-0.8.0/images/monster/bigmonster1.gif'];
        dragon.x = game.rootScene.width/2;
        dragon.y = game.rootScene.height - dragon.height - 10;

        console.log("" + dragon.x + dragon.y);
        dragon.frame = 3;
        game.rootScene.addChild(dragon);

        dragon.frameIndex = 0;
        var frameList = [2, 3, 4, 3];

        var gameFreezeTime = 0;

        dragon.onenterframe = function () {
            gameFreezeTime = Math.max(gameFreezeTime-1,0);
            if(gameFreezeTime > 0) {
                if (gameFreezeTime == 1) {
                    this.frame = frameList[this.frameIndex];
                }
                return;
            }
            //ドラゴンをアニメーションさせる
            if(game.frame %10 == 0){
                this.frameIndex ++;
                this.frameIndex %= frameList.length;
                this.frame = frameList[this.frameIndex];
            }
            if(game.input.right) {
                dragon.x += 10;
                dragon.x = Math.min(game.rootScene.width - dragon.width, dragon.x);
                dragon.scaleX = -1;
            }
            if(game.input.left) {
                dragon.x -= 10;
                dragon.x = Math.max(0, dragon.x);
                dragon.scaleX = 1;
            }
        }

        game.onenterframe = function () {
            if (gameFreezeTime > 0) {
                return;
            }
            if (game.frame % DropFrequency == 0) {
                var dropItem;
                if (game.frame % (DropFrequency * 10) == 0) {
                    dropItem = new Sprite(32,64);
                    dropItem.image = game.assets['./enchant.js-builds-0.8.0/images/space0.png'];
                    dropItem.scaleX = 1;
                    dropItem.scaleY = -1;
                    dropItem.isMissile = true;
                } else {
                    dropItem = new Sprite(16,16);
                    dropItem.image = game.assets['./enchant.js-builds-0.8.0/images/icon0.png'];
                    dropItem.scaleX = 2;
                    dropItem.scaleY = 2;
                    dropItem.isMissile = false;
                }

                dropItem.x = Math.random() * game.width;
                dropItem.y = 0;

                var rand = Math.floor(Math.random() * 10);
                console.log("rand: " + rand);
                dropItem.frame = rand;

                dropItem.onenterframe = function () {
                    if (gameFreezeTime > 0) {
                        return;
                    }
                    this.y += DropVelosity;

                    if(this.within(dragon, 40)) {
                        this.remove();

                        if(this.frame != 0) {
                            // 1以外をとった時
                            dragon.frame = 0;
                            gameFreezeTime = 30;
                            // ミサイルがぶつかった時
                             if(this.isMissile) {
                                game.score = 0;
                                scoreLabel.text = "SCORE : "+game.score;

                                var effect = new Sprite(16, 16);
                                effect.image = game.assets['./enchant.js-builds-0.8.0/images/effect0.png'];
                                effect.x = this.x;
                                effect.y = this.y;
                                effect.scaleX = 3;
                                effect.scaleY = 3;
                                effect.frameIndex = 0;
                                var frameList = [0, 1, 2, 3, 4];
                                game.rootScene.addChild(effect);

                                effect.onenterframe = function() {
                                    if(game.frame %3 == 0){
                                        this.frameIndex ++;
                                        if(this.frameIndex == 5) {
                                            this.remove();
                                            return;
                                        }
                                        this.frame = frameList[this.frameIndex];
                                    }
                                }
                            } else {
                               game.score -= 1;
                                game.score = Math.max(0, game.score);
                                scoreLabel.text = "SCORE : "+game.score;

                                var effect = new Sprite(16, 16);
                                effect.image = game.assets['./enchant.js-builds-0.8.0/images/icon0.png']
                                effect.x = this.x;
                                effect.y = this.y;
                                effect.scaleX = 3;
                                effect.scaleY = 3;
                                effect.frame = 11;
                                effect.lifeTime = 0;
                                game.rootScene.addChild(effect);
                                effect.onenterframe = function() {
                                    if (this.lifeTime % 3) {
                                        this.y -= 3;
                                    }
                                    if (this.lifeTime == 18) {
                                        this.remove();
                                    }
                                    this.lifeTime++;
                                }
                            }
                        } else {
                            // 1をとった時
                            game.score += 1;
                            scoreLabel.text = "SCORE : "+game.score;

                            var effect = new Sprite(16, 16);
                            effect.image = game.assets['./enchant.js-builds-0.8.0/images/icon0.png']
                            effect.x = this.x;
                            effect.y = this.y;
                            effect.scaleX = 3;
                            effect.scaleY = 3;
                            effect.frame = 10;
                            effect.lifeTime = 0;
                            game.rootScene.addChild(effect);
                            effect.onenterframe = function() {
                                if (this.lifeTime % 3) {
                                    this.y -= 3;
                                }
                                if (this.lifeTime == 18) {
                                    this.remove();
                                }
                                this.lifeTime++;
                            }
                        }
                    }

                    if(this.y > game.rootScene.height) {
                        this.remove();
                    }
                }
                game.rootScene.insertBefore(dropItem, dragon);


            }
        }
    }
    game.start();
}
