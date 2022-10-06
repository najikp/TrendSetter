const mongoose=require('mongoose');

const wishlistSchema= new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },

    wishList:[{
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'products'
        }
    }]

},{timestamps:true});

const wishlistModel=mongoose.model('wishlists',wishlistSchema);

module.exports=wishlistModel;