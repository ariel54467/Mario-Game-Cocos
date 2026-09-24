cc.Class({
    extends: cc.Component,

    properties: {
        target : cc.Node,
        bg_back : cc.Node,
        bg_mid : cc.Node,
        ui : cc.Node
    },

   update(dt){
        let targetpos = this.target.getPosition();
        targetpos.x = cc.misc.clampf(targetpos.x,-200, 1880)
        targetpos.y = cc.misc.clampf(targetpos.y, -100, 320)
        let curr = this.node.getPosition();
        curr.lerp(targetpos, 0.1, curr);
        this.node.setPosition(curr);
        this.ui.setPosition(curr);
        this.bg_back.setPosition(curr.x/2, curr.y/2);
        this.bg_mid.setPosition(curr.x/4, curr.y /4);
   }
}); 