const couponModel=require('../model/coupon-model');
const cartController=require('../controllers/cartController');
const { response } = require('../app');

module.exports={

    addCoupon:(userid,couponData)=>{
        return new Promise(async(resolve,reject)=>{
            console.log(couponData,'this is coupon data');
            try{
                const coupon=await couponModel.findOne({couponName:couponData.couponName}).lean();
                const response={
                    exist:false
                };
                if(!coupon){
                    couponModel.create(couponData).then((response)=>{
                        response.exist=false;
                        response.couponData=couponData;
                        resolve(response);
                    })
                }else{
                    response.exist=true;
                    response.couponData=couponData;
                    resolve(response);
                }
            }catch(error){
                reject(error);
            }
        })
    },

    getAllCoupons:()=>{
        return new Promise((resolve,reject)=>{
            try{
                couponModel.find().lean().then((response)=>{
                    resolve(response);
                })
            }catch(error){
                reject(error);

            }
        })
    },

    deleteCoupon:(couponId)=>{
        return new Promise((resolve,reject)=>{
            try{
                couponModel.findByIdAndDelete({_id:couponId}).then((response)=>{
                    resolve(response)
                })
            }catch(error){
                reject(error);
            }
        })
    },

    getcoupon:(couponId)=>{
        return new Promise((resolve,reject)=>{
            try{
                couponModel.findById({_id:couponId}).lean().then((response)=>{
                    resolve(response)
                })
            }catch(error){
                reject(error)
            }
        })
    },


    editCoupons:(couponId,couponData)=>{
        return new Promise((resolve,reject)=>{
            try{
                couponModel.findByIdAndUpdate(couponId,{couponName:couponData.couponName,
                couponCode:couponData.couponCode,
                discount:couponData.discount}).then((response)=>{
                    resolve(response)
                })
            }catch(error){
                reject(error)
            }
        })
    },

    applyCoupon:(userid,couponData)=>{
        console.log(couponData,'this is couopondata');
        return new Promise(async(resolve,reject)=>{
            try{
                const response={};
                response.discount=0;
                const coupon=await couponModel.findOne({couponCode:couponData.couponCode});
                console.log(coupon,'this is coupon....');

                if(coupon){
                    response.coupon=coupon;
                    let couponUser=await couponModel.findOne({
                        couponCode:couponData.couponCode,
                        userId:{$in:[userid]},
                    })
                    if(couponUser){
                        response.status=false;
                        resolve(response);
                        console.log('this is working first');
                    }else{
                        response.status=true;
                        response.coupon=response;
                        await cartController.addProductDetails(userid).then((cartProduct)=>{

                            cart=cartProduct.cart;
                            let grandTotal;
                            if(cart){
                                let cartlength=cart.Cartdata.length;
                                if(cartlength>=0){
                                    grandTotal=cart.Cartdata.reduce((acc,curr)=>{
                                        acc+=curr.productId.price*curr.quantity
                                        return acc
                                    },0)
                                    response.discount=(grandTotal*coupon.discount)/100;
                                    grandTotal=grandTotal-response.discount;
                                    console.log(grandTotal,'this is grand total');
                                    response.grandTotal=grandTotal;
                                    response.coupon=coupon;
                                    resolve(response);
                                }else{
                                    resolve(response);
                                }
                            }else{
                                resolve(response)
                            }
                        })
                    }
                }else{  
                    response.status=false;
                    resolve(response)
                }
            }catch(error){
                reject(error)
            }
        })
    },

    couponUser:(userid,coupon)=>{
        console.log(coupon,'thsi is coupon from cokuon ');
        return new Promise(async(resolve,reject)=>{
            try{
                const coupons=await couponModel.findOne({couponCode:coupon.couponCode});
                if(coupons){
                console.log(coupons,'thsi is all coupons');
                await couponModel.findByIdAndUpdate(coupons._id,{$push:{userId:userid}}).then((response)=>{
                    console.log(response,'this is response from couopon user,,,,');
                    resolve(response)
                })
            }else{
                cartController.getTotalAmount(userid).then((response)=>{
                    resolve(response);
                })
            }
            }catch(error){
                reject(error)
            }
        })
    }

}