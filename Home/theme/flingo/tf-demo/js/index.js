
user_avatar = document.getElementById('avatar-image');
user_avatar_model = document.getElementById('user-avatar-model');
currenusername = document.getElementById('curren-username');




const setupUser = (user) => {
    if(user)
    {
        if(user.photoURL)
        {
            user_avatar.src = user.photoURL+"?height=200" ;
            user_avatar_model.src = user.photoURL+"?height=500" ;
        }
        else
        {
            user_avatar_model.src = "https://www.pearsoncollege.ca/wp-content/uploads/2019/12/placeholder-profile.jpg" ;
            user_avatar.src = "https://www.pearsoncollege.ca/wp-content/uploads/2019/12/placeholder-profile.jpg" ;
        }
        currenusername.innerHTML = user.Displayname;
        
    }
} 


