const mongoose=require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryname:{
        type:String

    },
    image:{
        type:Array
    }
},{timestamps:true})

const categoryModel = mongoose.model('categories',categorySchema);

module.exports = categoryModel;