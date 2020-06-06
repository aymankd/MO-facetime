      // Your web app's Firebase configuration
      var firebaseConfig = {
        apiKey: "AIzaSyDsiYw8slYB7tOyOOInuvcVMDRSmA5OH7Q",
        authDomain: "mo-facetime-db.firebaseapp.com",
        databaseURL: "https://mo-facetime-db.firebaseio.com",
        projectId: "mo-facetime-db",
        storageBucket: "mo-facetime-db.appspot.com",
        messagingSenderId: "296452795543",
        appId: "1:296452795543:web:9682e9730a669069020dd2",
        measurementId: "G-3X678568GR"
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
      firebase.auth().onAuthStateChanged(firebaseUser => {
        if(!firebaseUser)
            location.replace("../../../../login/themes.pixelstrap.com/chitchat/pages/login.html");
        else
        {

            setupUser(firebaseUser);
            console.log(firebaseUser);
        }
      });


