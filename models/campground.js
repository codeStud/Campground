var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
   name: String,
   price: String,
   image: String,
   description: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   
   // Object reference ASSOCIATION
   // associtaing comments to a specific campground
   comments: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"       // comments model
         }
      ],
      
   reviews: [
     {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Review"
      }
    ],
    rating: {
        type: Number,
        default: 0
    }
    
});

module.exports = mongoose.model("Campground", campgroundSchema);
