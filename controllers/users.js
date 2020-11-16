const User = require('../models/user');


module.exports.renderRegister = (req, res) =>{
    res.render('users/register');
}


module.exports.register = async(req, res) =>{
    try{
        const { email, username, password } = req.body;
        const user = new User({email, username});
        // for password, it hash the salt and password and combines it together and stores it in DB
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err =>{
            if(err) console.log(err)
            req.flash('success', `Welcome, ${req.user.username}`);
            res.redirect('/blogs');
        })
       
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }    
}

module.exports.renderLogin = (req, res) =>{
    res.render('users/login');
}


module.exports.login = (req, res) =>{
    req.flash('success', `Welcome Back, ${req.user.username}`);
    const redirectUrl = req.session.returnTo || '/blogs';
    delete req.session.returnTo;
    res.redirect(redirectUrl); 
}


module.exports.logout = (req, res) =>{
    req.logOut();
    req.flash('success', "Logged you out");
    res.redirect('/blogs');
}