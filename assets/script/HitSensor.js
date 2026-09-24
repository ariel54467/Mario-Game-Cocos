cc.Class({
    extends: cc.Component,

    onBeginContact(contact, selfCollider, otherCollider) {
        if (selfCollider.node.name === "Bottom" && otherCollider.node.name === "Player") {
            if (otherCollider.node.y < selfCollider.node.y) {
                const parentBlock = this.node.parent.getComponent("QBlock");
                if (parentBlock) {
                    parentBlock.Hit();
                }
            }
        }
    }
});
