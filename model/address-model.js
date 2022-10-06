const mongoose=require('mongoose');
const addressSchema=mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:'users'
    },

    address:{
        name:String,
        house:String,
        apartment:String,
        landmark:String,
        district:String,
        pin:Number,
        state:String,
        mobile:Number
    }

})

const addressModel=mongoose.model('addresses',addressSchema);
module.exports=addressModel;