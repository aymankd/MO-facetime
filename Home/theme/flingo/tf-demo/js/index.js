
user_avatar = document.getElementById('avatar-image');
user_avatar_model = document.getElementById('user-avatar-model');
currenusername = document.getElementById('curren-username');
contacts_list = document.getElementById('contacts-list');
see_img_contact = document.getElementById('see-img-contact');
see_name_contact = document.getElementById('see-name-cantact');
Create_msg = document.getElementById('Create-msg');
messaging = document.getElementById('messaging');



database = firebase.database();



const setupUser = (user) => {
    if(user)
    {
        Userid=user.uid;
        var ref = database.ref("users/"+Userid);
        ref.once("value")
        .then(function(snapshot) {
            user_avatar.src = snapshot.child("photoUrl").val()+"?height=250"; 
            user_avatar_model.src = snapshot.child("photoUrl").val()+"?height=250";
            currenusername.innerHTML = snapshot.child("username").val();
        });





        var ref = database.ref("users");
        ref.orderByChild("username").on("child_added", function(snapshot) {             
            if(snapshot.child("id").val() != Userid)
            {

                idCnt = snapshot.child("id").val();

                var refchatmsg = database.ref('chats');
                refchatmsg.orderByChild(Userid+' '+idCnt).equalTo(0).once('child_added', function(snap) {
                    exists = (snap.val() !== null);
                    if(exists)
                    {
                        cantmsg = '<li><div class="conversation unread" id="clickedchat"><div class="user-avatar user-avatar-rounded online"><img src="'+snapshot.child("photoUrl").val()+'" alt=""></div><div class="conversation__details"><div class="conversation__name"><div class="conversation__name--title">'+snapshot.child("username").val()+'</div></div></div></div></li>';
                        messaging.insertAdjacentHTML('afterbegin', cantmsg);
                    }
                });
                contactUser = "<li onclick='seecontact(";
                contactUser = contactUser+'"'+snapshot.child("id").val()+'","'+snapshot.child("photoUrl").val()+'","'+snapshot.child("username").val()+'")';
                contactUser = contactUser+"'>";
                contactUser = contactUser+'<div class="contactlist"><div class="user-avatar user-avatar-rounded online"><img src="'+snapshot.child("photoUrl").val()+'?height=250" alt=""></div><div class="contactlist__details"><div class="contactlist__details--name">'+snapshot.child("username").val()+'</div><div class="calllist__details--info"><span><i class="mdi mdi-tag-outline"></i></span></div></div></div></li>';
                contacts_list.insertAdjacentHTML('afterbegin', contactUser);
            }
        });




        




    }
} 

function seecontact(idU,photo,name)
{
  see_img_contact.src = photo+"?height=500";
  see_name_contact.innerHTML = name;
  Create_msg.onclick = function(){

    var ref = database.ref('chats');
    ref.orderByChild(Userid+' '+idU).equalTo(0).once('value', function(snapshot) {
        exists = (snapshot.val() !== null);
        if(!exists)
        {
            refchat = firebase.database().ref('chats');
            key = refchat.push().key;
            refchat.child(key+'/'+Userid+' '+idU).set(0);
            refchat.child(key+'/'+idU+' '+Userid).set(0);
        }
        else
        alert('you alredy have chat with this person');
    });
  };

}


/*



                refchat = firebase.database().ref('chats');
                key = refchat.push().key;
                //refchat.child(key).child(idU).set(true);
                //refchat.child(key).child(Userid).set(true);
                alert(snapshot.key+'\nme :'+me+'   \nhe'+he);







        refchat = firebase.database().ref('chats');
        key = refchat.push().key;
        var newData={
            sender : key,
            reciver : this.web_name.value,
            Username: this.username.value,
            Password : this.password.value,
            website_link : this.web_link.value
         }
         myRef.push(newData);

*/


