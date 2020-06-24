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
      database = firebase.database();

      var login = document.getElementById("Login");

      login.addEventListener("click",function(){
        email = document.getElementById("email").value;
        pass = document.getElementById("pass").value;
        firebase.auth().signInWithEmailAndPassword(email,pass)
        .then(function(){
          alert("user sussufuly loged in");
          location.replace("messenger");
        })
        .catch(function(error){
            alert(error.message);
        })
      });
      //var username,useremail;
      function signin_fb(){
        var provider = new firebase.auth.FacebookAuthProvider();
        provider.addScope('user_birthday');
        firebase.auth().useDeviceLanguage();
        firebase.auth().signInWithPopup(provider).then(function(result) {
          // This gives you a Facebook Access Token. You can use it to access the Facebook API.
          var token = result.credential.accessToken;
          // The signed-in user info.
          var user = result.user;
          // ...
          var ref = database.ref('users');
          ref.child(user.uid).once('value', function(snapshot) {
            var exists = (snapshot.val() !== null);
            if (!exists) {
              location.replace("register");
            }else
            location.replace("messenger");
          });
        }).catch(function(error) {
          alert(error.message);
        });
      }

      function signin_gmail(){
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().useDeviceLanguage();
        firebase.auth().signInWithPopup(provider).then(function(result) {
          // This gives you a Facebook Access Token. You can use it to access the Facebook API.
          var token = result.credential.accessToken;
          // The signed-in user info.
          var user = result.user;
          // ...
          var ref = database.ref('users');
          ref.child(user.uid).once('value', function(snapshot) {
            var exists = (snapshot.val() !== null);
            if (!exists) {
              location.replace("register");
            }else
            location.replace("messenger");
          });
        }).catch(function(error) {
          alert(error.message);
        });
      }
      function signin_microsoft(){
        alert('microsoft connection');
      }