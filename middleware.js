const Listening = require("./models/listening.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listeningSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()) {
      req.session.redirectUrl = req.originalUrl;
      req.flash("error","You must be logged in to create new listing");
      return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next) => {
      if(req.session.redirectUrl) {
           res.locals.redirectUrl = req.session.redirectUrl;
      }
      next();
}

module.exports.isOwner = async (req,res,next) => {
   let {id} = req.params;

    let listing = await Listening.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error","You are not Owner of this Listing");
       return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next) => {
    const {error} = listeningSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
         throw new ExpressError(400,errMsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
         throw new ExpressError(400,errMsg);
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req,res,next) => {
   let {id,reviewId} = req.params;

    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error","You are not author of this review");
       return res.redirect(`/listings/${id}`);
    }
    next();
}