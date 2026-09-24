// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        bgm : {
            default : null,
            type : cc.AudioClip,
        }
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        cc.audioEngine.playMusic(this.bgm, true);
     },

    // update (dt) {},
});
