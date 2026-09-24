cc.Class({
    extends: cc.Component,

    properties: {
        hsLabel: cc.Label,
        userLabel: cc.Label
    },

    onLoad() {
        const firebaseScript = cc.game.firebase;

        if (!firebaseScript) {
            console.error("❌ Firebase script not found.");
            this.userLabel.string = "FIREBASE ERROR";
            this.hsLabel.string = "-";
            return;
        }

        const user = window.firebase.auth().currentUser;

        if (!user) {
            this.userLabel.string = "NOT LOGGED IN";
            this.hsLabel.string = "-";
            return;
        }

        firebaseScript.getUserProfile(user.uid, (success, profile) => {
            if (success) {
                this.userLabel.string = (profile.name || "UNKNOWN").toUpperCase();
                this.hsLabel.string = (profile.highscore != null ? profile.highscore : 0).toString();
            } else {
                this.userLabel.string = "ERROR";
                this.hsLabel.string = "-";
                console.warn("Failed to load profile:", profile.message);
            }
        });
    }
});
