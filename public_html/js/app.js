var app = angular.module("cg-unit3-project", ["firebase", "ngAnimate", "ui.bootstrap"]);
/**
 * routing configurations
 */

/**
 * Home Controller 
 */
app.controller("homeCtrl", function ($scope, $firebaseArray, $firebaseAuth, $firebaseObject) {
    app.initFirebase();      
    
    $scope.posts = $firebaseArray(app.firebaseRef.child("posts"));
    
    //create auth obj
    $scope.authObj = $firebaseAuth();
    
    // store logeed in user
    $scope.authUser = null;
    $scope.user = null;
//    $scope.posts = [];
       
    // called on login and logout and page load
    $scope.authObj.$onAuthStateChanged(function(firebaseUser){
        if(firebaseUser){
            $scope.authUser = firebaseUser;
            $scope.user = $firebaseObject(app.firebaseRef.child('users').child($scope.authUser.uid));
//            $scope.posts = $firebaseArray(app.firebaseRef.child('posts'));
        }else{
            $scope.authUser = null;
            $scope.user = null;
//            $scope.posts = [];
        }
    }); 
    
    $scope.like = function () {
        
    };
    
});

app.controller("postCtrl", function($scope, $firebaseObject, $firebaseAuth, $firebaseArray){

    //initialize firebase
    app.initFirebase();
    
    //create auth obj
    $scope.authObj = $firebaseAuth();
    
    // store logeed in user
    $scope.authUser = null;
    $scope.user = null;
    $scope.posts = [];
       
    // called on login and logout and page load
    $scope.authObj.$onAuthStateChanged(function(firebaseUser){
        if(firebaseUser){
            $scope.authUser = firebaseUser;
            $scope.user = $firebaseObject(app.firebaseRef.child('users').child($scope.authUser.uid));
            $scope.posts = $firebaseArray(app.firebaseRef.child('posts'));
        }else{
            $scope.authUser = null;
            $scope.user = null;
            $scope.posts = [];
        }
    });    
    
    $scope.makePost = function(){
        var title = $scope.post.title;
        var content = $scope.post.content;               
        var uid = $scope.authUser.uid;
        var author = $scope.user.firstName + " " + $scope.user.lastName; 
        if(author === " "){
            author = "Anonymous User";
        }
        var d = new Date();
        
        // create object of data to update
        var data = {
            title: title, 
            author: author,
            content: content,
            likes: [],
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
    };
    
    $scope.deletePost = function(){
        
    };
    
    $scope.hide = function (){
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
app.controller("authCtrl", function ($scope, $firebaseAuth, $firebaseObject, $window) {
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

    // called on login and logout and page load
    $scope.authObj.$onAuthStateChanged(function (firebaseUser) {
        if (firebaseUser) {
            $scope.authUser = firebaseUser;
            $scope.user = $firebaseObject(app.firebaseRef.child('users').child($scope.authUser.uid));
            $scope.authFlag = true;

        } else {
            $scope.authUser = null;
            $scope.user = null;
        }
//        console.log($scope.authUser);
//        console.log($scope.user);
    });

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
    /*Hide profile info on profile page*/
    $scope.hide = function () {
        $scope.profileInfo = false;
        var successBtn = angular.element(document.querySelector('#update-btn'));
        successBtn.removeClass('btn-success');
        successBtn.html("&nbsp;Update&nbsp;");
    };

    $scope.update = function () {
        // get values from the form
        var firstName = $scope.user.firstName;
        var lastName = $scope.user.lastName;
        // validate

        // create object of data to update
        var data = {firstName: firstName, lastName: lastName};

        app.firebaseRef.child('users').child($scope.authUser.uid).update(data);
        // same as
//        app.firebaseRef.child('users/' + $scope.authUser.uid).update(data);
        console.log("...updated...");

        /*Show user update has been completed successfully...*/
        var successBtn = angular.element(document.querySelector('#update-btn'));
        successBtn.addClass('btn-success');
        successBtn.html("Updated");
    };

    $scope.logout = function () {
        $scope.authObj.$signOut();

        /*Go to home page;*/
        var host = $window.location.host;
        var landingUrl = "http://" + host + "/cg-unit3-project/index.html";

        $window.location.href = landingUrl; //Redirect to given URLs.
    };        

}); //end controller

app.controller('profileCtrl', function($scope, $firebaseArray, $firebaseAuth, $firebaseObject){
    
});

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
