const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Review = require("./review.js");

const listeningSchema = new Schema( {
    title: {
        type:String,
        required:true
    },
    description:String,
    image:{
        type:String,
        default:"https://images.unsplash.com/photo-1746150361891-a61a9f6703c9?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set : (v) =>
         v===""? link ="https://images.unsplash.com/photo-1746150361891-a61a9f6703c9?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        : v,
    },
    price:Number,
    location:String,
    country:String,
    reviews : [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review"
     }],
     owner : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
     }
});

listeningSchema.post("findOneAndDelete", async (listing) => {
    if(listing) {
        await Review.deleteMany({ _id : { $in : listing.reviews } });
    }
})

const Listening = mongoose.model("Listening",listeningSchema);

module.exports = Listening;