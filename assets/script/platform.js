cc.Class({
    extends: cc.Component,

    properties: {
        player: cc.Node,
    },


    onBeginContact(contact, selfCollider, otherCollider) {
        if (!this.player) return;
        if (otherCollider.node !== this.player) return;

        let plpos =  this.player.convertToWorldSpaceAR(cc.v2(0, -this.player.height / 2));
        let worldpos = this.node.convertToWorldSpaceAR(cc.v2(0, this.node.height / 2));
        if (plpos.y < worldpos.y) {
            contact.disabled = true;
        }
    },
});
