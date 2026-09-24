// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        level2: cc.Node,     
    },

    // LIFE-CYCLE CALLBACKS:
onLoad() {
        this.level2.on('click', this.changeScene, this);
    },

    changeScene() {
        cc.director.loadScene("Game2");
    },

});
