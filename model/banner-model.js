const mongoose=require('mongoose');
const bannerSchema=new mongoose.Schema({
    bannername:{
        type:String,
        require:true
    },
    image:{
        type:Array,
        require:true
    },
    content:{
        type:String,
        require:true
    }
},{timestamps:true})

bannerModel=mongoose.model('banner',bannerSchema);

module.exports=bannerModel;