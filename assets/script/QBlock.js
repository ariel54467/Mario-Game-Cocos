cc.Class({
    extends: cc.Component,

    properties: {
        bump: {
            default: 10
        },
        notActive: {
            default: null,
            type: cc.SpriteFrame
        },
        anim: {
            default: null,
            type: cc.Animation
        },
        score :{
            default : null,
            type : cc.Node
        },
        coin :{
            default :null,
            type: cc.Prefab
        },
        powerUp: {
            default :null,
            type: cc.Prefab
        },
        powerSoundAppear:{
            default: null,
            type: cc.AudioClip
        },
        coinSound:{
            default: null,
            type:cc.AudioClip
        }
        
    },

    onLoad() {
        this.hit = false;
        if (this.anim) {
            this.anim.play('QBlockActive'); 
        }
    },

    Hit() {
        if (this.hit) return;
        this.hit = true;

        let up = cc.moveBy(0.1, cc.v2(0, this.bump));
        let down = cc.moveBy(0.1, cc.v2(0, -this.bump));
        this.node.runAction(cc.sequence(up, down));
        if (this.anim) {
            this.anim.play('QBlockNActive'); 
        }

        const ran = Math.random() < 0.5;

        if (ran && this.coin) {
            if(cc.gameManager){
                cc.gameManager.addScore(100);
                cc.gameManager.addCoin();
            }
            if (this.coinSound){
                cc.audioEngine.playEffect(this.coinSound, false);
            }
            const coin = cc.instantiate(this.coin);
            this.node.parent.addChild(coin);
            coin.setPosition(this.node.x, this.node.y + 30);
            const jumpUp = cc.moveBy(0.15, cc.v2(0, 20));
            const jumpDown = cc.moveBy(0.15, cc.v2(0, -20));
            const destroy = cc.callFunc(() => coin.destroy());
            coin.runAction(cc.sequence(jumpUp, jumpDown, destroy));
        } else if (this.powerUp) {
            if(this.powerSoundAppear){
                cc.audioEngine.playEffect(this.powerSoundAppear, false);
            }
            const item = cc.instantiate(this.powerUp);
            this.node.parent.addChild(item);
            item.setPosition(this.node.x, this.node.y + 30);
            const popUp = cc.moveBy(0.2, cc.v2(0, 20));
            const activatePhysics = cc.callFunc(() => {
                const body = item.getComponent(cc.RigidBody2D);
                if (body) {
                    body.awake = true;
                }
            });
            item.runAction(cc.sequence(popUp, activatePhysics));
        }
            if (ran && this.score) {
                this.score.active = true;
                this.score.opacity = 255;
                this.score.setPosition(cc.v2(0, 30)); 

                const moveUp = cc.moveBy(1, cc.v2(0, 30));
                const fadeOut = cc.fadeOut(1);
                const seq = cc.sequence(
                    cc.spawn(moveUp, fadeOut),
                    cc.callFunc(() => {
                        this.score.active = false;
                        this.score.opacity = 0;
                    })
                );
                this.score.runAction(seq);
            }
    }
});
