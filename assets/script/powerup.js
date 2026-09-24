cc.Class({
    extends: cc.Component,

    properties: {
        speed: {
            default : 30
        },
        score :{
            default: null,
            type: cc.Node
        }
    },

    onLoad () {
        this.body = this.getComponent(cc.RigidBody);
        this.dir = Math.random() < 0.5 ? -1 : 1;
        this.body.linearVelocity = cc.v2(this.speed * this.dir, 0);
    },

    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.name === "Player") {
            if(cc.gameManager){
                cc.gameManager.addScore(200);
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
            this.node.destroy();
            let plscript = otherCollider.node.getComponent("Player");
            if (plscript && plscript.powerup){
                plscript.powerup();
            }
            return;
        }
        let normal = contact.getWorldManifold().normal;
        if (Math.abs(normal.x) > 0.5) {
            this.dir *= -1; 
        }

    },

    update(dt) {
        this.body.linearVelocity = cc.v2(this.speed * this.dir, this.body.linearVelocity.y);
    }
});
