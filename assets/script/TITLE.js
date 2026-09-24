cc.Class({
    extends: cc.Component,

    properties: {
        userSigninInput: cc.EditBox,
        userLoginInput: cc.EditBox,
        emailLoginInput: cc.EditBox,
        passLoginInput: cc.EditBox,
        emailSignupInput: cc.EditBox,
        passSignupInput: cc.EditBox,
        firebaseManager: cc.Node,

        loginButton: cc.Node,
        signupButton: cc.Node,
        login: cc.Node,
        signup: cc.Node,
    },

    openLogin() {
        if (this.signup.active === false) this.login.active = true;
    },

    closeLogin() {
        this.login.active = false;
    },

    openSignup() {
        if (this.login.active === false) this.signup.active = true;
    },

    closeSignup() {
        this.signup.active = false;
    },

    onLoginClick() {
        const name = this.userLoginInput.string;
        const email = this.emailLoginInput.string.trim();
        const pass = this.passLoginInput.string;

        if (!email || !pass) {
            console.log("❌ Email and password required");
            return;
        }

        this.firebaseManager.getComponent("firebase").login(email, pass, (success, userOrError) => {
            if (success) {
                const user = userOrError;
                this.firebaseManager.getComponent("firebase").getUserProfile(user.uid, (profileSuccess, dataOrError) => {
                if (profileSuccess) {
                    const storedName = dataOrError.name;

                    if (storedName === name) {
                        console.log("✅ Name match! Logging in...");
                        cc.sys.localStorage.setItem("playerName", storedName);
                        cc.sys.localStorage.setItem("playerScore", dataOrError.highscore);
                        cc.director.loadScene("Menu");
                    } else {
                        alert("❌ Wrong username for this account.");
                    }
                } else {
                    alert("❌ Failed to load profile: " + dataOrError.message);
                }
            });
        } else {
            alert("❌ Login failed: " + userOrError.message);
        }
    });
    },

    onSignupClick() {
        const name = this.userSigninInput.string;
        const email = this.emailSignupInput.string.trim();
        const pass = this.passSignupInput.string;

        if (!email || !pass || !name) {
            return;
        }
        console.log(this.firebaseManager.getComponent("firebase"));
        this.firebaseManager.getComponent("firebase").signup(email, pass, (success, userOrError) => {
            if (success) {
                const user = userOrError;
                this.firebaseManager.getComponent("firebase").saveUserProfile(name, user, (saveSuccess, error) => {
                    if (saveSuccess) {
                        console.log("✅ User profile saved!");
                        cc.director.loadScene("Menu");
                    } else {
                        alert("Failed to save user profile: " + error.message);
                    }
                });
            } else {
                alert("Signup failed: " + userOrError.message);
            }
        });
    }
});
