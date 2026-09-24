cc.Class({
    extends: cc.Component,

    properties: {
        speed: {
            default: 200,
        },
        jumpForce: {
            default: 2000,
        },
        anim: {
            default: null,
            type: cc.Animation
        },
        sprite: {
            default: null,
            type: cc.Node
        },
        gravityScale: {
            default: 1,
        },
        jumpSound: {
            default : null,
            type:cc.AudioClip
        },
        deathSound : {
            default : null,
            type : cc.AudioClip
        },
        powerSound:{
            default: null,
            type: cc.AudioClip
        },
        stompSound :{
            default: null,
            type: cc.AudioClip
        },
        powerDownSound :{
            default: null,
            type: cc.AudioClip
        },
        winSound:{
            default: null,
            type:cc.AudioClip
        },
        totalNotif:{
            default:null,
            type:cc.Node
        },
        backButton: {
            default: null,
            type: cc.Node
        }
    },

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().enabledContactListener = true;
        this.body = this.node.getComponent(cc.RigidBody);
        this.collider = this.node.getComponent(cc.PhysicsBoxCollider);
        if (this.body) {
            this.body.gravityScale = this.gravityScale;
            this.body.linearDamping = 0;
        }
        this.invincible = false;
        this.power = false;
        this.powerdown = false;
        this.mul = 1;
        this.die = false;
        this.dirtemp = 0;
        this.stoptimer = 0;
        this.stop = false;
        this.moving = false;
        this.dir = 0;
        this.isJumping = false;
        this.grounded = false;
        this.fall = false;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    onKeyDown(event) {
        if (this.die) return;
        switch (event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                this.dir = -1;
                this.moving = true;
                this.dirtemp = -1;
                break;

            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this.dir = 1;
                this.moving = true;
                this.dirtemp = 1;
                break;

            case cc.macro.KEY.space:
                if(this.isJumping) break;
                this.isJumping = true;
                this.jump();
                break;
        }
    },

    onKeyUp(event) {
        if (this.die) return;
        switch (event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                if (this.dir === -1) {
                    this.dir = 0;
                    this.moving = false;
                    if (this.isJumping) break;
                    if(!this.power)this.anim.play('move_stop');
                    else this.anim.play('move_stop_big');
                    this.stoptimer = 0.2;
                    this.stop = true;
                }
                break;

            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                if (this.dir === 1) {
                    this.dir = 0;
                    this.moving = false;
                    if (this.isJumping) break;
                    if(!this.power)this.anim.play('move_stop');
                    else this.anim.play('move_stop_big');
                    this.stoptimer = 0.2;
                    this.stop = true;
                }
                break;
            
        }
    },

    jump() {
        if (this.die) return;
        if (!this.isJumping) return;
        this.body.linearVelocity = cc.v2(this.body.linearVelocity.x, 0);
        this.body.applyLinearImpulse(cc.v2(0, this.jumpForce * this.mul),this.body.getWorldCenter(),true);
        this.isJumping = true;

        if (this.jumpSound) {
            cc.audioEngine.playEffect(this.jumpSound, false);
        }

        if (this.anim) {
            this.anim.play('move_jump');
        }
    },

    update(dt) {
        if(cc.gameManager){
            cc.gameManager.updateTimer(dt);
        }
        if (this.die) return;
        if (this.node.y < -200){
            this.fall = true;
            this.death();
        }
        if (this.stop){
            if (this.dirtemp !== 0){
                this.sprite.scaleX = this.dirtemp;
            }
            this.stoptimer -= dt;
            if (this.stoptimer <= 0){
                this.stop = false;
            }else{
                return;
            }
        }
        if (this.dir !== 0) {
            this.sprite.scaleX = this.dir;
        }
        if (!this.die){
        const nvel = cc.v2(this.dir * this.speed,this.body.linearVelocity.y);
        this.body.linearVelocity = nvel;
        }
        if (!this.die && this.anim) {
            let currentState = '';

            if (this.isJumping) {
                currentState = this.power ? 'move_jump_big' : 'move_jump';
            } else if (this.moving) {
                currentState = this.power ? 'move_run_big' : 'move_run';
            } else {
                currentState = this.power ? 'move_powerup' : 'move_idle';
            }

            if (!this.anim.getAnimationState(currentState).isPlaying) {
                this.anim.play(currentState);
            }
        }
        
    },

    onBeginContact(contact, selfCollider, otherCollider) {
    
    if (this.die) return;
    this.isJumping = false;
    if (this.invincible && (otherCollider.node.name === "Monster" || otherCollider.node.name === "Spike")) {
        return;
    }
    if (otherCollider.node.name === "Spike") {
        this.death();
    }
    if (otherCollider.node.name === "WIN") {
        cc.audioEngine.stopMusic();

        if (this.winSound) {
            cc.audioEngine.playEffect(this.winSound, false);
        }
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        this.totalNotif.active = true;
        const scoreLabel = this.totalNotif.getChildByName("score").getComponent(cc.Label);
        const finalScore = cc.gameManager.totalScore();
        scoreLabel.string = finalScore;
        const firebaseScript = cc.game.firebase;
        firebaseScript.updateHighScoreIfBetter(finalScore, (success, error) => {
            if (success) {
                console.log("Highscore updated if better");
            } else {
                console.warn("Failed to update highscore:", error.message);
            }
        });

        if (this.backButton) {
        this.backButton.active = true;
        this.backButton.once('click', () => {
            cc.gameManager.resetGame();
            cc.director.loadScene("Menu");
        }, this);
    }
    }
    if (otherCollider.node.name === "Monster"){
        const marioBottom = this.node.y - this.collider.size.height / 2;
        const monsterTop = otherCollider.node.y + otherCollider.size.height / 2;
            if (marioBottom > monsterTop - 5) {
                if (this.stompSound){
                    cc.audioEngine.playEffect(this.stompSound, false);
                }
                let monsterScript = otherCollider.node.getComponent("Goomba");
                if (monsterScript && monsterScript.die) {
                    monsterScript.die();
                }
                this.body.linearVelocity = cc.v2(this.body.linearVelocity.x, 100); 
            } else {
                this.mul = 1;
                this.death();
            }
    }
},


    onEndContact(contact, selfCollider, otherCollider) {

    },

    death() {
        if (this.power && !this.powerdown && !this.invincible && !this.fall) {
            if (this.powerDownSound){
                cc.audioEngine.playEffect(this.powerDownSound, false);
            }

            this.powerdown = true;
            this.invincible = true;

            let blink = cc.repeat(
                cc.sequence(
                    cc.callFunc(() => { this.sprite.opacity = 0; }),
                    cc.delayTime(0.05),
                    cc.callFunc(() => { this.sprite.opacity = 255; }),
                    cc.delayTime(0.05)
                ),
                20
            );

            let aBlink = cc.callFunc(() => {
                this.power = false;
                this.mul = 1;

                if (this.anim) {
                    const animState = this.anim.getAnimationState('move_idle');
                    if (animState) {
                        this.anim.play('move_idle');
                    } else {
                        this.anim.play('move_powerup');
                    }
                }

                if (this.collider) {
                    this.collider.size.width = 16;
                    this.collider.size.height = 16; 
                    this.collider.offset = cc.v2(0, 0); 
                    this.collider.apply();
                }

                this.enabled = true;

                this.scheduleOnce(() => {
                    this.invincible = false;
                }, 1);

                this.powerdown = false;
            });

            this.sprite.runAction(cc.sequence(blink, aBlink));
            return;
        }

        if (this.die) return;

        this.die = true;
        this.enabled = false;

        if (this.getComponent(cc.PhysicsBoxCollider)){
            this.getComponent(cc.PhysicsBoxCollider).enabled = false;
        }

        let body = this.getComponent(cc.RigidBody);
        body.linearVelocity = cc.v2(0, 0);
        body.linearVelocity = cc.v2(0, 100);

        if (this.anim) {
            this.anim.play('move_death');
        }

        cc.audioEngine.stopMusic();
        if (this.deathSound){
            cc.audioEngine.playEffect(this.deathSound, false);
        }

        this.node.runAction(cc.rotateBy(1, 720));

         this.scheduleOnce(() => {
        if (cc.gameManager) {
            cc.gameManager.loseLife();
            if (cc.gameManager.life >= 0) {
                cc.director.loadScene("GameStart"); 
            } else {
                if(cc.gameManager){
                 cc.gameManager.resetGame();
                }
                cc.director.loadScene("GameOver");
            }
        } else {
            cc.director.loadScene("GameOver"); 
        }
    }, 2.5);
    },


    powerup() {
        if (this.power) return;

        if (this.powerSound) {
            cc.audioEngine.playEffect(this.powerSound, false);
        }
        this.enabled = false;
        this.body.linearVelocity = cc.v2(0, this.body.linearVelocity.y);
        let blink = cc.repeat(cc.sequence(cc.callFunc(() => { this.sprite.opacity = 0; }),cc.delayTime(0.1),cc.callFunc(() => { this.sprite.opacity = 255; }),cc.delayTime(0.1)),3);

        let aBlink = cc.callFunc(() => {
            this.power = true;
            this.mul = 1.5;

            if (this.anim) {
                const animState = this.anim.getAnimationState('move_powerup');
                if (animState) {
                    this.anim.play('move_powerup');
                } else {
                    this.anim.play('move_idle');
                }
            }
            if (this.collider) {
                this.collider.size.width = 16;
                this.collider.size.height = 24; 
                this.collider.offset = cc.v2(0, 0); 
                this.collider.apply();
            }
            this.enabled = true;
        });
        this.sprite.runAction(cc.sequence(blink, aBlink));
    },
    onPreSolve(contact, selfCollider, otherCollider) {
        if (!this.invincible) return;

        const Enemies = ["Monster", "Spike"];

        if (Enemies.includes(otherCollider.node.name)) {
            contact.disabled = true; 
        }
    }
});
