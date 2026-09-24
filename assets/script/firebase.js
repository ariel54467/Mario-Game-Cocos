    cc.Class({
        extends: cc.Component,

        onLoad() {
            if (!cc.game.firebaseInitialized) {
                cc.game.addPersistRootNode(this.node);
                cc.game.firebaseInitialized = true;
                cc.game.firebase = this;
                console.log("✅ FirebaseManager made persistent");
            } else {
                this.node.destroy();
            }
        },

    
        login(email, password, callback) {
            window.firebase.auth().signInWithEmailAndPassword(email, password)
                .then(userCredential => callback(true, userCredential.user))
                .catch(error => callback(false, error));
        },

        
        signup(email, password, callback) {
            window.firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(userCredential => callback(true, userCredential.user))
                .catch(error => callback(false, error));
        },

        
        saveHighScore(score, callback) {
            const user = window.firebase.auth().currentUser;
            if (!user) return callback(false, { message: "User not logged in" });

            const dbRef = window.firebase.database().ref("highscores/" + user.uid);
            dbRef.set({
                uid: user.uid,
                email: user.email,
                score: score,
                timestamp: Date.now()
            })
            .then(() => callback(true))
            .catch(error => callback(false, error));
        },


        getGlobalHighScores(limit, callback) {
            const dbRef = window.firebase.database().ref("highscores");

            dbRef.orderByChild("score").limitToLast(limit).once("value")
                .then(snapshot => {
                    const scores = [];
                    snapshot.forEach(child => {
                        scores.push(child.val());
                    });

                    scores.reverse();
                    callback(true, scores);
                })
                .catch(error => callback(false, error));
        },

        saveUserProfile(name, user, callback) {
            if (!user) return callback(false, { message: "User not provided" });

            const dbRef = window.firebase.database().ref("users/" + user.uid);
            dbRef.set({
                uid: user.uid,
                email: user.email,
                name: name,
                highscore: 0
            })
            .then(() => callback(true))
            .catch(error => callback(false, error));
        },

        getUserProfile(uid, callback){
            const dbRef = window.firebase.database().ref("users/" + uid);
            dbRef.once("value").
            then(snapshot=>{
                if(snapshot.exists()){
                    callback(true, snapshot.val());
                }else{
                    callback(false, { message: "User profile not found"});
                }
            })
            .catch((error)=>{
                callback(false, error);
            })
        },

        updateHighScoreIfBetter(score, callback) {
            const user = window.firebase.auth().currentUser;
            if (!user) return callback(false, { message: "User not logged in" });

            const dbRef = window.firebase.database().ref("users/" + user.uid);

            dbRef.once("value")
                .then(snapshot => {
                    const data = snapshot.val();
                    if (!data || score > (data.highscore || 0)) {
                        return dbRef.update({ highscore: score });
                    }
                })
                .then(() => callback(true))
                .catch(error => callback(false, error));
        }



    });
