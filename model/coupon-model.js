const mongoose=require('mongoose');
const couponSchema=mongoose.Schema({
    userId:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    }],
    couponName:String,
    couponCode:String,
    discount:Number
})

const couponModel=mongoose.model('coupons',couponSchema);
module.exports=couponModel;