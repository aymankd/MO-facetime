user_avatar = $('.user-avatar img');

const setupUser = (user) => {
    if(user)
    {
        if(user_avatar)
        user_avatar.src = "https://graph.facebook.com/1672906972857877/picture";
    }
}