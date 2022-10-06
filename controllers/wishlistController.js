const async = require('hbs/lib/async');
const wishlistModel = require('../model/wishlist-model');


module.exports = {

    addToWishlist: (productid, userid) => {
        const response = {
            duplicate: false
        }

        return new Promise(async (resolve, reject) => {
            try { 
                let wishlist = await wishlistModel.findOne({ userId: userid });
                
                if (wishlist) {
                    let wishlistProduct = await wishlistModel.findOne({
                        userId: userid,
                        'wishList.productId': productid
                    });

                    if (wishlistProduct) {
                        // wishlistModel.updateOne({ userId: userid, 'wishList:productId': productid }).then((response) => {
                            response.duplicate = true;
                            resolve(response);
                        // });
                    } else {
                        let wishlistArray = { productId: productid };
                        await wishlistModel.updateOne(
                            { userId: userid },
                            {
                                $push: { wishList: wishlistArray }

                            }
                        ).then((response) => {
                            resolve(response)
                        });
                    }
                } else {
                    let body = new wishlistModel({
                        userId:userid,
                        wishList:[{
                            productId:productid
                        }]
                    })
                    body.save().then((response)=>{
                        resolve(response)
                    }).catch((err)=>{
                        console.log('error:',err);
                    })
                    
                }
            } catch (error) {
                reject(error)
            }
        })
    },



    addProductDetails:(userid)=>{
        try{
            return new Promise(async(resolve,reject)=>{
                const response={};
                wishlistModel.findOne({userId:userid})
                .populate('wishList.productId').lean().then((wishlist)=>{
                    if(wishlist){
                        if(wishlist.wishList.length>0){
                            response.wishlistempty=false;
                            response.wishlist=wishlist;
                            resolve(response);
                        }else{
                            response.wishlistempty=true;
                            response.wishlist=wishlist;
                            resolve(response)
                        }
                    }else{
                        response.wishlistempty=true;
                        resolve(response);
                    }
                })
            })
        }catch(error){
            reject(error);
        }
    },
    totalItem:(userid)=>{
        return new Promise(async(resolve,reject)=>{
          try{
      
            let wishlist=await wishlistModel.findOne({userId:userid})
            if(wishlist){

                let itemCount=0
                itemCount=wishlist.wishList.length;
                resolve(itemCount)   
            }else{
                itemCount=0;
                resolve(itemCount);
            }
          }
          catch(error){
            reject(error)
          }
      
        })
      },

      deleteWishlist:(userID,proId)=>{
        return new Promise((resolve,reject)=>{
          try{
           wishlistModel.findOneAndUpdate({ userId:userID},{
            $pull:{
              wishList:{productId:proId}
            }
           }).then((data)=>{
            resolve(data);
           })
          }
          catch(error){
            reject(error);
          }
        })
      }

}