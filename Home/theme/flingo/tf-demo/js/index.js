
user_avatar = document.getElementById('avatar-image');
user_avatar_model = document.getElementById('user-avatar-model');
currenusername = document.getElementById('curren-username');
contacts_list = document.getElementById('contacts-list');
see_img_contact = document.getElementById('see-img-contact');
see_name_contact = document.getElementById('see-name-cantact');
Create_msg = document.getElementById('Create-msg');
messaging = document.getElementById('messaging');
chat_cantainer = document.getElementById('chat-cantainer');
chater_avatar = document.getElementById('chater-avatar');
chater_name = document.getElementById('chater-name');
send_msg_btn = document.getElementById('send-msg');
message_input = document.getElementById('message-to-send');
var sms_pop = new Audio('sms_pop.mp3');



database = firebase.database();




var loaded = false;


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
            ref.off();
        });
        
        var ref = database.ref("users");

        ref.orderByChild("username").on("value", function(snapX) {
            snapX.forEach(element => {
                load_Cantact(element);
            });
            ref.off();
        });

        ref.orderByChild("username").on("child_changed", function(snapX) {
            contacts_list.innerHTML = '';
            snapX.forEach(element => {
                load_Cantact(element);
            });
        });

        var chatteref = database.ref("chats");
        chatteref.on("child_added", function(snapC) {
            chatboxid = snapC.child('id').val()+'';
            if(chatboxid.includes(Userid))
            {
                chatid = chatboxid.replace(Userid,'');
                chatid = chatid.replace(' ','');
                var chatInfoRef = database.ref("users/"+chatid);
                chatInfoRef.once("value")
                .then(function(snapchat) {
                    cantmsg = `<li onclick="loadMessages('${snapC.key}','${snapchat.child('username').val()}','${snapchat.child("photoUrl").val()}')">`;
                    cantmsg = cantmsg+'<div class="conversation unread" id="clickedchat"><div class="user-avatar user-avatar-rounded online"><img src="'+snapchat.child("photoUrl").val()+'" alt=""></div><div class="conversation__details"><div class="conversation__name"><div class="conversation__name--title">'+snapchat.child("username").val()+'</div></div><div class="conversation__message"><div id="lastmsg'+snapC.key+'" class="conversation__message-preview"></div><span id="notif'+snapC.key+'" class="badge badge-primary badge-rounded"></span></div></div></div></li>';
                    messaging.insertAdjacentHTML('afterbegin', cantmsg);
                    chatInfoRef.off();
                });                
            }
        });
    }
} 

/*






                    add chat

        idCnt = snapshot.child("id").val();
        var refchatmsg = database.ref('chats');
        refchatmsg.orderByChild(Userid+' '+idCnt).equalTo(0).on('value', function(element) {
            exists = (element.val() !== null);
            if(exists)
            {
                msgsref = element.val()['msg'];
                cantmsg = `<li onclick="loadMessages('${element['key']}','${snapshot.child("username").val()}','${snapshot.child("photoUrl").val()}')">`;
                cantmsg = cantmsg+'<div class="conversation unread" id="clickedchat"><div class="user-avatar user-avatar-rounded online"><img src="'+snapshot.child("photoUrl").val()+'" alt=""></div><div class="conversation__details"><div class="conversation__name"><div class="conversation__name--title">'+snapshot.child("username").val()+'</div></div></div></div></li>';
                messaging.insertAdjacentHTML('afterbegin', cantmsg);
            }
            refchatmsg.off();
        });
*/




function load_Cantact(snapshot)
{
    if(snapshot.child("id").val() != Userid)
    {
        contactUser = "<li onclick='seecontact(";
        contactUser = contactUser+'"'+snapshot.child("id").val()+'","'+snapshot.child("photoUrl").val()+'","'+snapshot.child("username").val()+'")';
        contactUser = contactUser+"'>";
        contactUser = contactUser+'<div class="contactlist"><div class="user-avatar user-avatar-rounded online"><img src="'+snapshot.child("photoUrl").val()+'?height=250" alt=""></div><div class="contactlist__details"><div class="contactlist__details--name">'+snapshot.child("username").val()+'</div><div class="calllist__details--info"><span><i class="mdi mdi-tag-outline"></i></span></div></div></div></li>';
        contacts_list.insertAdjacentHTML('afterbegin', contactUser);
    }    
}




function seecontact(idU,photo,name)
{
  see_img_contact.src = photo+"?height=500";
  see_name_contact.innerHTML = name;
  Create_msg.onclick = function(){
    refchatsadd = database.ref('chats');
    refchatsadd.once("value", function(snapshot) {
        chatexist = false ;
        snapshot.forEach(element => {
            idchaters = element.child('id').val();
            if( ( idchaters == Userid+' '+idU ) || ( idchaters == idU+' '+Userid ) )
                chatexist = true;
        });
        if(chatexist == false)
        {
            refchat = database.ref('chats');
            key = refchat.push().key;
            database.ref('chats/'+key+'/id').set(Userid+' '+idU);
        }else
        alert('you already have chat with this user');
    });

  };

}

OpenedChatRef = null;

function loadMessages(msgrep,name,photoprof)
{
    document.getElementById('notif'+msgrep).innerHTML = '';
    document.getElementById('lastmsg'+msgrep).innerHTML = '';
    OpenedChat = msgrep ;
    chater_name.innerHTML = name;
    chater_avatar.src = photoprof+"?height=250";
    var refcmsg = database.ref('chats/'+msgrep+'/msg');
    OpenedChatRef = refcmsg;
    chat_cantainer.innerHTML = '';
    refcmsg.on('value', function(snap) {
        exists = (snap.val() !== null);
        if(exists)
        {
            if(OpenedChatRef == refcmsg)
            {
                document.getElementById('notif'+msgrep).innerHTML = '';
                document.getElementById('lastmsg'+msgrep).innerHTML = '';
                chat_cantainer.innerHTML = '';
                snap.forEach(element => {
                    us = element.val()['id'];
                    msg = element.val()['val'];
                    msgtocant = '';
                    if(us == Userid){
                        msgtocant = `<div class="ca-send"><div class="ca-send__msg-group"><div class="ca-send__msgwrapper"><div class="ca-send__msg">${msg}</div></div><div class="metadata"><span class="time">10:10 AM</span><span class="tick"><img src="./assets/images/tick/tick-read.svg" alt=""></span></div></div></div>`;
                    }else{
                        msgtocant = `<div class="ca-received"><div class="ca-received__msg-group"><div class="ca-received__msgwrapper"><div class="ca-received__msg">${msg}😀</div></div><div class="metadata"><span class="time">10:10 AM</span></div></div></div>`;
                    }
                    chat_cantainer.insertAdjacentHTML('beforeend', msgtocant);
                });
                sms_pop.play();
            }else
            {
                document.getElementById('notif'+msgrep).innerHTML = '!!!';
                snap.forEach(element => {
                    document.getElementById('lastmsg'+msgrep).innerHTML = element.val()['val'];
                });
            }
        }
    });
    send_msg_btn.onclick = function(){
        msg_to_send = message_input.value;
        if (msg_to_send!='')
        {
            
            key = Date.now();
            var newData={
                id:Userid,
                val:msg_to_send
             }
            database.ref('chats/'+msgrep+'/msg/'+key).set(newData);
        }
        message_input.value = '';
    };
}

function setfree()
{
    OpenedChatRef='';
}











