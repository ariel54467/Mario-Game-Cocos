cc.Class({
    extends: cc.Component,

    properties: {
        life: 3,
        score: 0,
        timer: 300,
        coin: 0,

        lifeLabel: cc.Label,
        scoreLabel: cc.Label,
        timerLabel: cc.Label,
        coinLabel: cc.Label,
    },

    onLoad () {
        if (!cc.gameManager) {
            cc.gameManager = this;
            cc.game.addPersistRootNode(this.node); 
        } else {
            this.node.destroy();
            return;
        }
        this.enabled = true;
    },

    start () {
        this.scheduleOnce(() => {
            this.tryAssignLabels();
        }, 0.1);
    },

    update (dt) {
        if (!this.lifeLabel || !this.scoreLabel || !this.timerLabel || !this.coinLabel) return;

        this.lifeLabel.string = this.life;
        this.scoreLabel.string = this.score;
        this.timerLabel.string = Math.ceil(this.timer);
        this.coinLabel.string = this.coin;

        if (this.life < 0) {
            cc.director.loadScene("GameOver");
        }
    },

    updateTimer(dt) {
        if (this.timer > 0) {
            this.timer -= dt;
        } else {
            this.timer = 0;
            this.life = -1;
        }
        this.updateUI();
    },

    addScore (points) {
        this.score += points;
        this.updateUI();
    },

    addCoin() {
        this.coin++;
        this.updateUI();
    },

    loseLife () {
        this.life -= 1;

        if (this.life >= 0) {
            this.timer = 300;
        }

        this.updateUI();
    },

    resetGame () {
        this.life = 3;
        this.score = 0;
        this.timer = 300;
        this.coin = 0;
        this.updateUI();
    },

    rebindLabels (lifeLabel, scoreLabel, timerLabel, coinLabel) {
        this.lifeLabel = lifeLabel;
        this.scoreLabel = scoreLabel;
        this.timerLabel = timerLabel;
        this.coinLabel = coinLabel;
        this.updateUI();
    },

    tryAssignLabels () {
        const canvas = cc.find("Canvas");
        if (!canvas) return;

        const lifeLabelNode = canvas.getChildByName("LifeLabel");
        const scoreLabelNode = canvas.getChildByName("ScoreLabel");
        const timerLabelNode = canvas.getChildByName("TimerLabel");
        const coinLabelNode = canvas.getChildByName("coinLabel");

        if (lifeLabelNode) this.lifeLabel = lifeLabelNode.getComponent(cc.Label);
        if (scoreLabelNode) this.scoreLabel = scoreLabelNode.getComponent(cc.Label);
        if (timerLabelNode) this.timerLabel = timerLabelNode.getComponent(cc.Label);
        if (coinLabelNode) this.coinLabel = coinLabelNode.getComponent(cc.Label);
    },

    updateUI () {
        if (this.lifeLabel) this.lifeLabel.string = this.life;
        if (this.scoreLabel) this.scoreLabel.string = this.score;
        if (this.timerLabel) this.timerLabel.string = Math.ceil(this.timer);
        if (this.coinLabel) this.coinLabel.string = this.coin;
    },
    totalScore(){
        return Math.ceil(this.timer) * 100 + this.score + this.coin * 50 + this.life * 200;
    }
});
