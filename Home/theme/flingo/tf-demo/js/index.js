
user_avatar = document.getElementById('avatar-image');
user_avatar_model = document.getElementById('user-avatar-model');
currenusername = document.getElementById('curren-username');
contacts_list = document.getElementById('contacts-list');
see_img_contact = document.getElementById('see-img-contact');
see_name_contact = document.getElementById('see-name-cantact');








const setupUser = (user) => {
    if(user)
    {
        Userid=user.uid;
        var ref = firebase.database().ref("users/"+Userid);
        ref.once("value")
        .then(function(snapshot) {
            user_avatar.src = snapshot.child("photoUrl").val()+"?height=250"; 
            user_avatar_model.src = snapshot.child("photoUrl").val()+"?height=250";
            currenusername.innerHTML = snapshot.child("username").val();
        });
        var ref = firebase.database().ref("users");
        ref.orderByChild("username").on("child_added", function(snapshot) {             
            if(snapshot.child("id").val() != Userid)
            {
                contactUser = "<li onclick='seecontact(";
                contactUser = contactUser+'"'+snapshot.child("photoUrl").val()+'","'+snapshot.child("username").val()+'")';
                contactUser = contactUser+"'>";
                contactUser = contactUser+'<div class="contactlist"><div class="user-avatar user-avatar-rounded online"><img src="'+snapshot.child("photoUrl").val()+'?height=250" alt=""></div><div class="contactlist__details"><div class="contactlist__details--name">'+snapshot.child("username").val()+'</div><div class="calllist__details--info"><span><i class="mdi mdi-tag-outline"></i></span></div></div></div></li>';
                contacts_list.insertAdjacentHTML('afterbegin', contactUser);
            }
        });
    }
} 

function seecontact(photo,name)
{
  see_img_contact.src = photo+"?height=500";
  see_name_contact.innerHTML = name;
}

