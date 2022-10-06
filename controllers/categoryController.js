const promise=require('bcrypt/promises');
const objectID=require('bson');
const response=require('expres');
const async=require('hbs/lib/async');
const categoryModel=require('../model/category-model');
const productModel = require('../model/product-model');



 module.exports={

    addcategoryData: (categorydata)=>{
 

        return new Promise(async (resolve, reject)=>{
            const category = await categoryModel.findOne({ categoryname: categorydata.categoryname }).lean();
            const response = {
                exist:false
            }
            if(!category){
                categoryModel.create(categorydata).then((data)=>{
                    response.exist = false;
                    response.category = categorydata;
                    resolve(response);

                }).catch((err)=>{
                    console.log('error at creating ',err);
                    resolve(err);
                })

            }else{
                response.exist= true;
                response.category= categorydata;
                resolve(response);
            }
        })
    },


    getcategory: ()=>{
        return new Promise(async (resolve,reject)=>{

            const category = await categoryModel.find({}).lean()
            resolve(category);
        })
    },


    deletecategory: (categoryid)=>{
        return new Promise((resolve,reject)=>{
            categoryModel.findByIdAndDelete({_id:objectID.ObjectID(categoryid)}).then((response)=>{
                resolve(response)
            })
        })
    },


    getcategorydata: (categoryid)=>{
        return new Promise(async(resolve,reject)=>{
            const category = await categoryModel.findOne({_id:objectID.ObjectID(categoryid)}).lean();

            resolve(category);
        })
    },


    updatecategory: (categoryid,categoryDetails)=>{
        console.log(categoryDetails,'this is details////')
        return new Promise((resolve,reject)=>{
            categoryModel.findByIdAndUpdate(categoryid,{categoryname:categoryDetails.categoryname,image:categoryDetails.image}).then((response)=>{
                resolve(response); 
            })
        })
    },

    categoryCheck:(categoryid)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                const category=await productModel.find({categoryname:categoryid});
                resolve(category);
            }catch(error){
                reject(error);
            }
        })
    }


}