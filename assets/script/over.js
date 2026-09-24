// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        overSound :{
            default:null,
            type: cc.AudioClip
        }
    },

    // LIFE-CYCLE CALLBACKS:


    start(){
         if (this.overSound){
            cc.audioEngine.playEffect(this.overSound, false);
        }
        this.scheduleOnce(() => {
            cc.director.loadScene("Menu"); 
        }, 3);
    }

    // update (dt) {},
});
