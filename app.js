if(process.env.NODE_ENV != "production") {
    require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const {listeningSchema , reviewSchema } = require("./schema.js");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");

const dbUrl = process.env.ATLASDB_URL;

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto: {
        secret:"mysupersecreatecode"
    },
    touchAfter: 24 * 3600,
});

store.on("error",() => {
    console.log("ERROR in MONGO SESSION STORE ",err);
});

const sessionOption = {
    store:store,
    secret : "mysupersecreatecode",
    resave:false,
    saveUninitialized:true,
    cookie : {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge :  7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    },
}


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
const port = 8080;
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));
app.engine('ejs',ejsMate);


main()
.then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// demo user
// app.get("/demouser",async (req,res) => {
//     const fakeUser = new User({
//         email:"student@gmail.com",
//         username:"sigma-student"
//     });

//     // register is a static method
//     let registerUser = await User.register(fakeUser,"helloworld");
    
//     res.send(registerUser);
//     console.log(registerUser);
// })

const listingRouter = require("./route/listing.js");
const reviewRouter = require("./route/review.js");
const userRouter = require("./route/user.js");

let validateListing = (req,res,next) => {
    const {error} = listeningSchema.validate(req.body);
    // console.log(result);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
  
         throw new ExpressError(400,errMsg);
    } else {
        next();
    }
};

let validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
         throw new ExpressError(400,errMsg);
    } else {
        next();
    }
};


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


// Error
app.all("/{*any}",(req,res,next) => {
    next(new ExpressError(404,"Page Not Found"));
});

app.use((err,req,res,next) => {
    const{status=500,message="Something went wrong"} = err;
    res.status(status).render("error.ejs",{err});
});

app.listen(port,() => {
    console.log(`Server listening on port ${port}`);
});
