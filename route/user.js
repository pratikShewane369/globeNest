const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const usersController = require("../controllers/users.js")

router.get("/signup", usersController.renderSingUpForm );

router.post("/signup",wrapAsync( usersController.signUp ));

router.get("/login", usersController.renderLoginForm );

// To Authenticate user we use passport which do it as a middleware
// Passport provides an authenticate() function,
// which is used as route middleware to authenticate requests
// savaRedirectUrl used here as a proper path of url after it gets logged in

router.post("/login",saveRedirectUrl,passport.authenticate("local",
      { failureRedirect: "/login", failureFlash:true}) , usersController.login );

router.get("/logout", usersController.logout )

module.exports = router;
