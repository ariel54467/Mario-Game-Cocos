// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        lifeLabel: cc.Label,
        scoreLabel: cc.Label,
        timerLabel: cc.Label,
        coinLabel: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        if (cc.gameManager) {
            cc.gameManager.rebindLabels(this.lifeLabel, this.scoreLabel, this.timerLabel, this.coinLabel);
        }
    },


    // update (dt) {},
});
