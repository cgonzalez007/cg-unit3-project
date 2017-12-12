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
