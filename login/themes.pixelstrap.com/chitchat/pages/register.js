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
      var SignUp = document.getElementById("SignUp");
      
      SignUp.addEventListener("click",function(){
        tusername = document.getElementById("username").value;
        temail = document.getElementById("email").value;
        tpass = document.getElementById("pass").value;        
        firebase.auth().createUserWithEmailAndPassword(temail, tpass)
        .then(function(autodata){
          currn = autodata.user;
          var newData={
            id: currn.uid,
            username:tusername,
            email:temail,
            photoUrl:'',
            friends: {}
        }
        database.ref('users/'+currn.uid).set(newData);
          alert("user sussufuly created");
          location.replace("../../../../Home/theme/flingo/tf-demo/messenger.html");
        })
        .catch(function(error) {
          alert(error.message);
        });
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
              add_user(user,database);
            }else{
              firebase.auth().signOut();
              alert('user already created an accoutn');
            }
          });
        }).catch(function(error) {
          alert(error.message);
        });      
      }


      function signin_gmail(){
        alert('gmail connection');
      }
      function signin_twitter(){
        alert('twitter connection');
      }



      
      function add_user(Us,db)
      {
        var newData={
            id: Us.uid,
            username:Us.displayName,
            email:Us.email,
            photoUrl:Us.photoURL,
            friends: {}
        }
        db.ref('users/'+Us.uid).set(newData);
        alert('user sussufuly created an account by Facebook');
        location.replace("../../../../Home/theme/flingo/tf-demo/messenger.html");
      }

