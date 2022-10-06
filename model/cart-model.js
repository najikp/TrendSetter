const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'users',
    require:true
},
Cartdata:[{
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'products'
        // required:true 
 }, 
     quantity:'number'
}]
},{timestamps:true})

const cartmodel = mongoose.model('carts',cartSchema)
module.exports = cartmodel;