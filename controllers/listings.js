const Listening = require("../models/listening");

module.exports.index = async (req,res) => {
   const allListings = await Listening.find({});
   res.render("listenings/index.ejs",{allListings});
}

module.exports.renderNewForm = (req,res) => {
    res.render("listenings/new.ejs");
}

module.exports.showListing = async (req,res) => {
    let {id} = req.params;
    const listing = await Listening.findById(id).populate({path:"reviews",
        populate :{
            path:"author", 
            select:"username",
        },
    }).
    populate("owner");
    if(!listing) {
        req.flash("error","Listing not exist");
        return res.redirect("/listings");
    }
    
    res.render("listenings/show.ejs",{listing});
}

module.exports.createListing = async (req,res) => {

        const newListing = new Listening(req.body.listing);
        newListing.owner = req.user._id;

        await newListing.save();
        req.flash("success","New Listing Created");
        res.redirect("/listings");
}

module.exports.editRenderForm = async(req,res) => {
    let {id} = req.params;
    const listing = await Listening.findById(id);
     if(!listing) {
        req.flash("error","Listing not exist");
        res.redirect("/listings");
    }
    res.render("listenings/edit.ejs",{listing});
}

module.exports.updateListing = async (req,res) => {
    let {id} = req.params;

    await Listening.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req,res) => {
    let {id} = req.params;
    await Listening.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}
