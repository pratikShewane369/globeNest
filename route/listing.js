const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");


const listingControllers = require("../controllers/listings.js"); // replace all callback 

// Index Route
router.get("/",wrapAsync(listingControllers.index));

// Create Route / new Route
router.get("/new",isLoggedIn, listingControllers.renderNewForm);

// Show Route
router.get("/:id", wrapAsync( listingControllers.showListing ));

// Create/Add Route 
router.post("/",isLoggedIn, 
    validateListing, // this validateListing is an middleware
    wrapAsync( listingControllers.createListing ));

// Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync( listingControllers.editRenderForm ));

// Update Route
router.put("/:id",
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync( listingControllers.updateListing ));

// Delete Route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync( listingControllers.destroyListing ));

module.exports = router;