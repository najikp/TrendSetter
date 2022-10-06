const { Timestamp } = require('bson');
const mongoose=require('mongoose');

const productSchema= new mongoose.Schema({

    productname:{
        type:String
    },

    price:{
        type:Number
    },

    categoryname:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'categories'
    },

    description:{
        type:String
    },

    image:{
        type:Array
    }
},{timestamps:true})


const productModel=mongoose.model('products',productSchema)

module.exports=productModel;