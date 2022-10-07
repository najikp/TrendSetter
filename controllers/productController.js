const { reject } = require('bcrypt/promises');
const { ObjectID, ObjectId } = require('bson');
const async = require('hbs/lib/async');
const productModel=require('../model/product-model');


module.exports={

    AddProduct:(productData)=>{
        return new Promise(async(resolve,reject)=>{
            const products=await productModel.findOne({productname:productData.productname}).lean();
            const response={
                exist:false
            };
            if(!products){
                productModel.create(productData).then((response)=>{
                    response.exist=false;
                    response.products=productData;
                    resolve(response);
 
                }).catch((error)=>{
                    console.log('error at products creation',error);
                    resolve(error);
                })
            }else{
                response.exist=true;
                response.products=productData;
                console.log('idh aaan tttoo');
                resolve(response);
            }
        })
    },

    getProduct:(productData)=>{
        return new Promise((async (resolve,reject)=>{
            const products= await productModel.find({}).populate('categoryname').lean();

            resolve(products);
        }))
    },


    deleteProduct:(productid)=>{
        return new Promise((resolve,reject)=>{
            productModel.findByIdAndDelete({_id:(productid)}).then((response)=>{
                resolve(response);
            })
        })
    },


    updateProduct:(productid,productdata)=>{
        console.log(productdata,'this is productdata');
        return new Promise((resolve,reject)=>{
            productModel.findByIdAndUpdate(productid,
                {  
                    productname:productdata.productname,
                    price:productdata.price,
                    image:productdata.image,
                    description:productdata.description,
                    categoryname:productdata.categoryname}).then((response)=>{
                resolve(response)
            })
        })
    },


    getProductData:(productid)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                let productdata= await productModel.findOne({_id:(productid)}).lean();
                    resolve(productdata);
            }catch(error){
                reject(error)
            }
        })
    },

    getByCategory:(categoryId)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                let products=await productModel.find({categoryname:categoryId}).lean();
                resolve(products);
            }catch(error){
                reject(error);
            }
        })
    },


    getLatest:()=>{
        return new Promise(async(resolve,reject)=>{
            try{
                const latest=await productModel.find().sort({createdAt:-1}).lean();
                console.log(latest,'these are the lateset products....');
                let newItem=[];
                for(let i=0;i<4;i++){
                    newItem[i]=latest[i];
                }
                resolve(newItem)
            }catch(error){
                reject(error);
            }
        })
    }


}