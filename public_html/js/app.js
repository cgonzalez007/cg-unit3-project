var app = angular.module("cg-unit3-project", ["firebase", "ngAnimate", "ui.bootstrap"]);
/**
 * routing configurations
 */

/**
 * Home Controlle
 */
app.controller("homeCtrl", function ($scope, $firebaseAuth, $firebaseObject) {
    app.initFirebase();
});

app.controller("followingCtrl", function ($scope, $firebaseAuth, $firebaseObject) {
    app.initFirebase();
});

app.controller("topPostsCtrl", function ($scope, $firebaseAuth, $firebaseObject) {
    app.initFirebase();
});

app.controller("topPostsCtrl", function ($scope, $firebaseAuth, $firebaseObject) {
    app.initFirebase();
});

app.controller("profileCtrl", function ($scope, $firebaseAuth, $firebaseObject) {
    app.initFirebase();
});

app.controller("authCtrl", function ($scope, $firebaseAuth, $firebaseObject) {
    //initialize firebase
    app.initFirebase();
    
    //create auth obj
    $scope.authObj = $firebaseAuth();
    
    // store logeed in user
    $scope.authUser = null;
    $scope.user = null;
    
    // called on login and logout and page load
    $scope.authObj.$onAuthStateChanged(function(firebaseUser){
        if(firebaseUser){
            $scope.authUser = firebaseUser;
            $scope.user = $firebaseObject(app.firebaseRef.child('users').child($scope.authUser.uid));
        }else{
            $scope.authUser = null;
            $scope.user = null;
        }
    });    

    $scope.register = function () {
        // get values from form

        // validate

        // pass values to this method

        $scope.authObj.$createUserWithEmailAndPassword("my@email.com", "mypassword")
                .then(function (firebaseUser) {
                    console.log("User " + firebaseUser.uid + " created successfully!");
                }).catch(function (error) {
            console.error("Error: ", error);
        });

    };

    $scope.login = function () {
        // get values from form

        // validate

        // pass values to this method

        $scope.authObj.$signInWithEmailAndPassword("my@email.com", "mypassword").then(function (firebaseUser) {
            console.log("Signed in as:", firebaseUser.uid);
        }).catch(function (error) {
            console.error("Authentication failed:", error);
        });
    };

    $scope.update = function () {
        // get values from the form
        
        // validate
        
        // create object of data to update
        var data = {firstname: 'Chris', lastname: 'Gonzalez'};
        
        app.firebaseRef.child('users').child($scope.authUser.uid).update(data);
        // same as
//        app.firebaseRef.child('users/' + $scope.authUser.uid).update(data);
        console.log("updated");
    };

    $scope.logout = function () {
        $scope.authObj.$signOut();
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
            storageBucket: "",
            messagingSenderId: "355893287161"
        };
        firebase.initializeApp(config);

// create reference to database
        app.firebaseRef = firebase.database().ref('/');
    }   

};
