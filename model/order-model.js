const mongoose=require('mongoose');

const orderSchema=new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        require:true
    },
    products:[{
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'products'
     }, 
         quantity:'number'
    }],
    deliveryAddress:Object,
    paymentMethod:String,
    totalAmount:Number,
    OrderStatus:Boolean,
    deliveryStatus:String,
    grandTotal:Number,
    productStatus:String,
    discount:Number,
    newdate:String



    
},{timestamps:true})

const orderModel=mongoose.model('orders',orderSchema);
module.exports=orderModel;