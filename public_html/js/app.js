var app = angular.module("cg-unit3-project",["firebase"]);

/**
 * Create a connection to the database
 * @returns {undefined}
 */
app.initFirebase = function (){
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
};