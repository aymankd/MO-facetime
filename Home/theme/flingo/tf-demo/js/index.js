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
start_videocall = document.getElementById('start-videocall');
caller_profile = document.getElementById('caller-profile');
caller_name = document.getElementById('caller-name');
video_call_hangup = document.getElementById('video-call-hangup');
video_call_pickup = document.getElementById('video-call-pickup');

video_user = document.getElementById('video-user');
video_called_user = document.getElementById('video-called-user');


reciver_call_profile = document.getElementById('reciver-call-profile');


database = firebase.database();
var loaded = false;
let peer = new Peer();
peer.on('open',id => {
    peerId = id;
    alert(peerId);
});

const setupUser = (user) => {
    if(user)
    {
        Userid = user.uid;
        var ref = database.ref("users/"+Userid);
        ref.once("value")
        .then(function(snapshot) {
            user_avatar.src = snapshot.child("photoUrl").val()+"?height=250"; 
            user_avatar_model.src = snapshot.child("photoUrl").val()+"?height=250";
            currenusername.innerHTML = snapshot.child("username").val();
        send("login",{
            name: snapshot.child("username").val(),
            userid:Userid
        });
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
                    cantmsg = `<li onclick="loadMessages('${snapC.key}','${snapchat.child('username').val()}','${snapchat.child("photoUrl").val()}','${snapchat.child("id").val()}')">`;
                    cantmsg = cantmsg+'<div class="conversation unread" id="clickedchat"><div class="user-avatar user-avatar-rounded online"><img src="'+snapchat.child("photoUrl").val()+'" alt=""></div><div class="conversation__details"><div class="conversation__name"><div class="conversation__name--title">'+snapchat.child("username").val()+'</div></div><div class="conversation__message"><div id="lastmsg'+snapC.key+'" class="conversation__message-preview"></div><span id="notif'+snapC.key+'" class="badge badge-primary badge-rounded"></span></div></div></div></li>';
                    messaging.insertAdjacentHTML('afterbegin', cantmsg);
                    chatInfoRef.off();
                });                
            }
        });
    }
} 




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




    function sendCall(idCaller,idRiciver,phURL)
    {
        reciver_call_profile.src = phURL+"?height=250";
        send("calling",{
            caller: idCaller,
            reciver: idRiciver
        });
    }









OpenedChatRef = null;

function loadMessages(msgrep,name,photoprof,idTocall)
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
                        msgtocant = `<div class="ca-received"><div class="ca-received__msg-group"><div class="ca-received__msgwrapper"><div class="ca-received__msg">${msg}</div></div><div class="metadata"><span class="time">10:10 AM</span></div></div></div>`;
                    }
                    chat_cantainer.insertAdjacentHTML('beforeend', msgtocant);
                });
                sms_pop.play();
                updateScroll();
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
    start_videocall.onclick = function(){
        sendCall(Userid,idTocall,photoprof);
    };
}

function setfree()
{
    OpenedChatRef='';
}
function updateScroll()
{
  //scrollcant = document.querySelector('.conversation-panel__body');
  //scrollcant.scrollTop = 0;
  $('#chat-panel__body_').scrollTop($('#chat-panel__body_').prop("scrollHeight"));
}




message_input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      send_msg_btn.click();
    }
});




const reciveCall = (datacall) => {
    if(datacall)
    {
        callerid = datacall.caller;
        var ref = database.ref("users/"+callerid);
        ref.once("value")
        .then(function(snapshot) {
            caller_profile.src = snapshot.child("photoUrl").val()+"?height=250"; 
            caller_name.innerHTML = snapshot.child("username").val();
        ref.off();
        });

        video_call_hangup.onclick = function(){
            closeCall(callerid);
        };
        video_call_pickup.onclick = function(){
            accepteCall(callerid,peerId)
        };

        console.log(callerid+' is calling me');

        setTimeout(function () {
            $('#incomingVoiceCall').modal( {
            backdrop: 'static',
            keyboard: false,
            show:true
            });
        }, 1300);
    }
}

function closeCall(caId)
{
    send("hangup",{to: caId});
}
function accepteCall(caId,Pid)
{
    send("Callanwser",{to: caId,PeeId:Pid});
    $('#incomingVoiceCall').modal("hide");
}



function recivehangup(){
    console.log('close call');
    $('#incomingVoiceCallwait').modal("hide");
};


function StartCall(Data){
    console.log('Staring call');
    $('#incomingVoiceCallwait').modal("hide");
    $('#incomingVideoStart').modal( {
        backdrop: 'static',
        keyboard: false,
        show:true
        });
    reciverId = Data.peeId;



    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia ;
    getUserMedia({video: true}, function(stream) {
      var call = peer.call(reciverId, stream);
      video_user.srcObject = stream;
      video_user.play();
      console.log('loading video ...');
      call.on('stream', function(remoteStream) {
        video_called_user.srcObject = remoteStream;
        video_called_user.play(); 
        console.log('my video loaded');
      });
    }, function(err) {
      console.log('Failed to get local stream' ,err);
    });
    console.log('other user peerid'+reciverId);
};


var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia ;
peer.on('call', function(call) {
  getUserMedia({video: true}, function(stream) {
    call.answer(stream); // Answer the call with an A/V stream.
    video_user.srcObject = stream;
    video_user.play();
    call.on('stream', function(remoteStream) {
        video_called_user.srcObject = remoteStream;
        video_called_user.play();
    });
  }, function(err) {
    console.log('Failed to get local stream' ,err);
  });
});
