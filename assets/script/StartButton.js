cc.Class({
    extends: cc.Component,

    properties: {
      
    },

    start () {

        this.node.on('click', () => {
            cc.director.loadScene("GameStart"); 
        }, this);
    }
});
