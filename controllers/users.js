const User = require("../models/user.js");

module.exports.renderSingUpForm = (req,res) => {
    res.render("users/signup.ejs");
}

module.exports.signUp = async (req,res) => {
    try {
    const {email,username,password} = req.body;
    const newUser = new User({email,username});
    const registeredUser =  await User.register(newUser,password);
    console.log(registeredUser);

    req.login(registeredUser,(err) => {
        if(err) {
            return next(err);
        }
        req.flash("success","Welcome to Wanderlust");
        res.redirect("/listings");
    })
    
    } catch (e) {
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req,res) => {
    res.render("users/login.ejs");
}

module.exports.login = async (req,res) => {
    req.flash("success","Welcome back to Wanderlust");
    if(res.locals.redirectUrl) {
        return res.redirect(res.locals.redirectUrl);
    }
    res.redirect("/listings");
}

module.exports.logout = (req,res,next) => {
    req.logOut((err) => {
        if(err) {
           return next(err);
        }
        req.flash("success","you are logged out now");
        res.redirect("/listings");
    })
}