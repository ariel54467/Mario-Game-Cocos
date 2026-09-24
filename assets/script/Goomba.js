// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        speed: {
            default : 30
        },
        anim:{
            default:null,
            type: cc.Animation
        },
        score:{
            default:null,
            type: cc.Node
        }
    },


    onLoad () {
        this.body = this.getComponent(cc.RigidBody);
        this.dir = Math.random() < 0.5 ? -1 : 1;
        this.death = false;
        this.body.linearVelocity = cc.v2(this.speed * this.dir, 0);
         if (this.anim) {
            this.anim.play('Goomba');
        }
    },

    die(){
        if(this.death) return;
        this.death = true;
        
        if(this.anim){
            this.anim.play('Goomba_death')
            this.anim.once('finished', () => {
            this.node.destroy();
            });
        }else{
            this.node.destroy();
        }
        if (this.score) {
                const clone = cc.instantiate(this.score);
                this.node.parent.addChild(clone);

                const worldPos = this.node.convertToWorldSpaceAR(cc.v2(0, 30));
                clone.setPosition(this.node.parent.convertToNodeSpaceAR(worldPos));
                clone.active = true;
                clone.opacity = 255;

                const moveUp = cc.moveBy(1, cc.v2(0, 30));
                const fadeOut = cc.fadeOut(1);
                const seq = cc.sequence(
                    cc.spawn(moveUp, fadeOut),
                    cc.callFunc(() => {
                        clone.destroy();
                    })
                );
                clone.runAction(seq);
        }
    },

    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.name === "Player") return;
        let normal = contact.getWorldManifold().normal;
        
        if (Math.abs(normal.x) > 0.5) {
            this.dir *= -1; 
        }
    },

    update(dt) {
        if(this.death) return;
        this.body.linearVelocity = cc.v2(this.speed * this.dir, this.body.linearVelocity.y);
        if (!this.anim.getAnimationState('Goomba').isPlaying) {
            this.anim.play('Goomba');
        }
    }
});
