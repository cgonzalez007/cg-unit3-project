var app = angular.module("cg-unit3-project", ["firebase", "ngAnimate", "ui.bootstrap"]);
/**
 * routing configurations
 */

/**
 * Home Controller 
 */
app.controller("homeCtrl", function ($scope, $firebaseArray, $firebaseAuth, $firebaseObject) {
    app.initFirebase();

    //posts
    $scope.posts = $firebaseArray(app.firebaseRef.child("posts"));

    //create auth obj
    $scope.authObj = $firebaseAuth();

    // store logeed in user
    $scope.authUser = null;
    $scope.user = null;
//    $scope.posts = [];

    // called on login and logout and page load
    $scope.authObj.$onAuthStateChanged(function (firebaseUser) {
        if (firebaseUser) {
            $scope.authUser = firebaseUser;
            $scope.user = $firebaseObject(app.firebaseRef.child('users').child($scope.authUser.uid));
//            $scope.posts = $firebaseArray(app.firebaseRef.child('posts'));
            $scope.likes = $firebaseObject(app.firebaseRef.child("likes").child($scope.authUser.uid));
        } else {
            $scope.authUser = null;
            $scope.user = null;
//            $scope.posts = [];
        }
    });
    /**
     * Like a post
     * @param {type} postId
     * @returns {undefined}
     */
    $scope.like = function (postId) {
        // create object of data to update
        console.log(postId);
//                
        var data = {liked: true};

        app.firebaseRef.child('likes').child($scope.authUser.uid).child(postId).update(data);

        var retrievedPost = $scope.posts.$getRecord(postId);
        //console.log(retrievedPost);
        var numLikes = parseInt(retrievedPost.numberLikes);
        //console.log(numLikes);
        retrievedPost.numberLikes = numLikes + 1;

        $scope.posts.$save(retrievedPost);

    };

});

app.controller("postCtrl", function ($scope, $firebaseObject, $firebaseAuth, $firebaseArray) {

    //initialize firebase
    app.initFirebase();

    //posts
    $scope.posts = $firebaseArray(app.firebaseRef.child('posts'));

    //create auth obj
    $scope.authObj = $firebaseAuth();

    // store logeed in user
    $scope.authUser = null;
    $scope.user = null;

    /**
     * called on login and logout and page load
     */
    $scope.authObj.$onAuthStateChanged(function (firebaseUser) {
        if (firebaseUser) {
            $scope.authUser = firebaseUser;
            $scope.user = $firebaseObject(app.firebaseRef.child('users').child($scope.authUser.uid));
        } else {
            $scope.authUser = null;
            $scope.user = null;
        }
    });
    /**
     * used for filtering posts by authorized user
     * @param {type} post
     * @returns {Boolean}
     */
    $scope.uidFilter = function (post) {
        return post.uid === $scope.authUser.uid;
    };

    /**
     * refresh number of likes on page as well as update in firebase db 
     * current work-around....
     * @returns {undefined}
     */
    $scope.refresh = function () {
//        var userPosts = [];
//        angular.forEach($scope.posts, function(value, key){
//            if($scope.posts[key].uid === $scope.authUser.uid){
//                userPosts.push($scope.posts[key]);
//            }
//        });
        var firstName = $scope.user.firstName;
        var lastName = $scope.user.lastName;

        var numberLikes = 0;
        angular.forEach($scope.posts, function (value, key) {
            if ($scope.posts[key].uid === $scope.authUser.uid) {
                numberLikes += $scope.posts[key].numberLikes;
            }
        });

        var data = {firstName: firstName, lastName: lastName, numberLikes: numberLikes};

        app.firebaseRef.child('users').child($scope.authUser.uid).update(data);

        console.log("refreshed!");
    };

    /**
     * Method for writing posts
     * @returns {undefined}
     */
    $scope.makePost = function () {
        var title = $scope.post.title;
        var content = $scope.post.content;
        var email = $scope.authUser.email;
        var uid = $scope.authUser.uid;
        var firstName = $scope.user.firstName === undefined ? "" : $scope.user.firstName;
        var lastName = $scope.user.lastName === undefined ? "" : $scope.user.lastName;

        var author = firstName + " " + lastName;

        if (author === " ") {
            author = "Anonymous User";
        }

        var d = new Date();

        // create object of data to update
        var data = {
            title: title,
            author: author,
            content: content,
            email: email,
            numberLikes: 0,
            uid: uid,
            exactDate: new Date().getTime(),
            date: (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear()
        };

        $scope.posts.$add(data);
        // clearing form
        $scope.post.title = "";
        $scope.post.content = "";

        var postBtn = angular.element(document.querySelector('#post-btn'));
        postBtn.addClass('btn-success');
        postBtn.html("Posted");

        // create record in firebase db if not created already (mainly for likes)
        if ($scope.user.numberLikes === null || $scope.user.numberLikes === undefined) {
            var data = {firstName: firstName, lastName: lastName, numberLikes: 0};

            app.firebaseRef.child('users').child($scope.authUser.uid).update(data);
        } else {
            $scope.refresh();
        }

    };
    /**
     * delete post by record
     * @param {type} uid
     * @returns {undefined}
     */
    $scope.delete = function (post) {
        $scope.posts.$remove(post);
    };
    /**
     * hide post form on homepage
     * @returns {undefined}
     */
    $scope.hide = function () {
        $scope.showNewPostForm = false;
        var postBtn = angular.element(document.querySelector('#post-btn'));
        postBtn.removeClass('btn-success');
        postBtn.html("Post");
    };
});

/**
 * Top Posts Controller
 */
app.controller("topPostsCtrl", function ($scope, $firebaseAuth, $firebaseObject) {
    app.initFirebase();
});

/**
 * Authorize Controller
 */
app.controller("authCtrl", function ($scope, $firebaseArray, $firebaseAuth, $firebaseObject, $window) {
    //initialize firebase
    app.initFirebase();

    /*toggle between showing login and register forms*/
    $scope.toggleLoginSignup = function () {
        $scope.showSignup = $scope.showSignup ? false : true;
        $scope.showLogin = $scope.showLogin ? false : true;
    };

    //create auth obj
    $scope.authObj = $firebaseAuth();

    // store logged in user
    $scope.authUser = null;
    $scope.user = null;

    /**
     * called on login and logout and page load
     */
    $scope.authObj.$onAuthStateChanged(function (firebaseUser) {
        if (firebaseUser) {
            $scope.authUser = firebaseUser;
            $scope.user = $firebaseObject(app.firebaseRef.child('users').child($scope.authUser.uid));
        } else {
            $scope.authUser = null;
            $scope.user = null;
        }
//        console.log($scope.authUser);
//        console.log($scope.user);
    });

    // posts
    $scope.posts = $firebaseArray(app.firebaseRef.child("posts"));

    /**
     * register new user (currently unable to save first name and last name right away)
     * @returns {undefined}
     */
    $scope.register = function () {
        // get values from form
        var email = $scope.signupEmail;
        var password = $scope.signupPassword;

        // console.log(email);

//        var firstName = $scope.firstName;
//        var lastName = $scope.lastName;

        // validate

        // create user

        // pass values to this method

        $scope.authObj.$createUserWithEmailAndPassword(email, password)
                .then(function (firebaseUser) {
                    console.log("User " + firebaseUser.uid + " created successfully!");
                    // create object of data in db                                     
//                    var data = {firstName: $scope.firstName, lastName: $scope.lastName};
//                    app.firebaseRef.child('users').child(firebaseUser.uid).update(data);
                    //        /*Go to home page;*/
                    var host = $window.location.host;
                    var landingUrl = "http://" + host + "/cg-unit3-project/index.html";

                    $window.location.href = landingUrl; //Redirect to given URLs.
                }).catch(function (error) {
            console.error("Error: ", error);
        });
    };
    /**
     * log in registered user
     * @returns {undefined}
     */
    $scope.login = function () {
        // get values from form
        // get values from form
        var email = $scope.loginEmail;
        var password = $scope.loginPassword;
        // validate

        // pass values to this method

        $scope.authObj.$signInWithEmailAndPassword(email, password).then(function (firebaseUser) {
            console.log("Signed in as:", firebaseUser.uid);
            /*Go to home page;*/
            var host = $window.location.host;
            var landingUrl = "http://" + host + "/cg-unit3-project/index.html";

            $window.location.href = landingUrl; //Redirect to given URLs.
        }).catch(function (error) {
            console.error("Authentication failed:", error);
        });

    };
    /**
     * Hide profile info on profile page
     * @returns {undefined}
     */
    $scope.hide = function () {
        $scope.profileInfo = false;
        var successBtn = angular.element(document.querySelector('#update-btn'));
        successBtn.removeClass('btn-success');
        successBtn.html("&nbsp;Update&nbsp;");
    };
    /**
     * update user info in firebase db
     * @returns {undefined}
     */
    $scope.update = function () {
        // get values from the form
        var firstName = $scope.user.firstName;
        var lastName = $scope.user.lastName;
        var newPassword = $scope.user.password;
        // validate

        var successBtn = angular.element(document.querySelector('#update-btn'));

        try {
            // create object of data to update
            var data = {firstName: firstName, lastName: lastName, numberLikes: 0};

            app.firebaseRef.child('users').child($scope.authUser.uid).update(data);

            /*Show user update has been completed successfully...*/
            successBtn.addClass('btn-success');
            successBtn.html("Updated");

        } catch (error) {
            console.log(error);
            // show there was an error
            successBtn.removeClass('btn-success').addClass('btn-danger');
            successBtn.html("Not Updated");
        }

        if ($scope.user.password !== undefined && $scope.user.password !== null
                && $scope.user.password !== "") {
            $scope.authObj.$updatePassword(newPassword).then(function () {
                console.log("Password changed successfully!");
                /*Show user update has been completed successfully...*/
                successBtn.addClass('btn-success');
                successBtn.html("Updated");

                /******TEMPORARY******/
                window.location.reload();

            }).catch(function (error) {
                console.error("Error: ", error);
                // show there was an error
                successBtn.removeClass('btn-success').addClass('btn-danger');
                successBtn.html("Not Updated");
            });
        }

        // same as
//        app.firebaseRef.child('users/' + $scope.authUser.uid).update(data);
        console.log("...updated...");
    };
    /**
     * logout as user
     * @returns {undefined}
     */
    $scope.logout = function () {
        $scope.authObj.$signOut();

        /*Go to home page;*/
        var host = $window.location.host;
        var landingUrl = "http://" + host + "/cg-unit3-project/index.html";

        $window.location.href = landingUrl; //Redirect to given URLs.
    };
    /**
     * refresh number of likes on page as well as update in firebase db 
     * current work-around....
     * @returns {undefined}
     */
    $scope.refresh = function () {
//        var userPosts = [];
//        angular.forEach($scope.posts, function(value, key){
//            if($scope.posts[key].uid === $scope.authUser.uid){
//                userPosts.push($scope.posts[key]);
//            }
//        });
        var firstName = $scope.user.firstName;
        var lastName = $scope.user.lastName;

        var numberLikes = 0;
        angular.forEach($scope.posts, function (value, key) {
            if ($scope.posts[key].uid === $scope.authUser.uid) {
                numberLikes += $scope.posts[key].numberLikes;
            }
        });

        var data = {firstName: firstName, lastName: lastName, numberLikes: numberLikes};

        app.firebaseRef.child('users').child($scope.authUser.uid).update(data);

        console.log("refreshed!");
    };

}); //end controller
/**
 * Create a connection to the database
 * @returns {undefined}
 */
app.initFirebase = function () {
    if (!app.firebaseRef) {
        // Initialize Firebase
        var config = {
            apiKey: "AIzaSyBjZdFe1zcdj63GMEyzCxcCKt1DrddOazo",
            authDomain: "cg-unit3-project.firebaseapp.com",
            databaseURL: "https://cg-unit3-project.firebaseio.com",
            projectId: "cg-unit3-project",
            storageBucket: "cg-unit3-project.appspot.com",
            messagingSenderId: "355893287161"
        };
        firebase.initializeApp(config);

// create reference to database
        app.firebaseRef = firebase.database().ref('/');
    }

};
