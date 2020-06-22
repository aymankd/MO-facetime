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
            location.replace("./..");
        else
        {
            setupUser(firebaseUser);
        }
      });

      var name, connectedUser;
      var ringtone = new Audio('/soud/duo_outgoing.mp3');

      var connection = 'https://localhost:8888';
      var socket = io.connect(connection);


      socket.on('connect', () => {
        console.log('Socket connecté'); // true
      });

      socket.on('RecieverCall', (message) => {
        data = JSON.parse(message);
        reciveCall(data);
      });

      socket.on('closeCall', (message) => {
        data = JSON.parse(message);
        recivehangup();
      });
      socket.on('accepteCall', (message) => {
        data = JSON.parse(message);
        StartCall(data);
      });


      function send(event,message) 
      {
          socket.emit(event,JSON.stringify(message));
      };

