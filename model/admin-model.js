const bcrypt=require('bcrypt');
const mongoose=require('mongoose');
const adminSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String
});

adminSchema.pre('save',async function(next){
    try{
        const hash = await bcrypt.hash(this.password,10);
        this.password=hash;
        next();
    }catch(error){
        next(error);
    }
})
const adminModel=mongoose.model('admin',adminSchema);

module.exports=adminModel;