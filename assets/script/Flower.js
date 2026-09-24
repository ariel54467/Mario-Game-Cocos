// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        anim:{
            default: null,
            type: cc.Animation
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if(this.anim){
            this.anim.play('Flower');
        }
    },

    // update (dt) {},
});
