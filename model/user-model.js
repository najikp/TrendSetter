const bcrypt=require('bcrypt');
const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    phonenumber:Number,
    image:Array,
    status:{
        type:Boolean,
        default:false
    },
    password:String
});

// userSchema.pre('save',async function(next){
//     try{ 
//         const hash = await bcrypt.hash(this.password,10);
//         this.password=hash;
//         next();
//     }catch(error){
//         next(error);
//     }
// })
const userModel=mongoose.model('users',userSchema);

module.exports=userModel;