const { response } = require('express');
const async = require('hbs/lib/async');
const addressModel=require('../model/address-model');




module.exports={

    addAddress:(addressData,userid)=>{
       return new Promise(async(resolve,reject)=>{  
        console.log(userid,'this is userid');
        try{

            let address=await new addressModel({
                address:{ 
                    name:addressData.name,
                    mobile:addressData.mobile,
                    house:addressData.house,
                    apartment:addressData.apartment,
                    landmark:addressData.landmark,
                    district:addressData.district,
                    state:addressData.state,
                    pin:addressData.pin
                },
                userId:userid
            })
            address.save().then((response)=>{
                resolve(response);
            })
        }catch(err){
            reject(err);
        }
       })
    },

    getAddress:(userid)=>{
        return new Promise((resolve,reject)=>{
            try{
                addressModel.find({userId:userid}).lean().then((response)=>{
                    resolve(response)
                }).catch((err)=>{
                    reject(err);
                })

            }catch(error){
                reject(error)
            }
        })
    },


   deleteAddress:(addressId)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            await addressModel.findByIdAndDelete({_id:addressId}).then((response)=>{
                resolve(response)
            })
        }catch(error){
                reject(error)
        }
    })
   },

   updateAddress:(addressId,addressData)=>{
    console.log(addressId,'is the addressId////////');
    console.log(addressData,'this is addressData');
    return new Promise(async(resolve,reject)=>{
        try{
            await addressModel.findByIdAndUpdate(addressId,{
                name:addressData.name,
                mobile:addressData.mobile,
                house:addressData.house,
                apartment:addressData.apartment,
                landmark:addressData.landmark,
                district:addressData.district,
                pin:addressData.pin,
                state:addressData.state}).then((response)=>{
                console.log(response,'is the response from the address////');
                resolve(response);
            })
    }catch(error){
        console.log(error,'error founded at updateAddress.....')
        reject(error);
    }
    })
   },


   getAddressData:(addressId)=>{
    console.log(addressId,'this is address id ');
    return new Promise((resolve,reject)=>{
        try{
            addressModel.find({_id:addressId}).lean().then((response)=>{
                console.log(response,'this is the single adderss by person');
                resolve(response);
            })
        }catch(error){
            reject(error)
        }
    })
   }

}











// module.exports={

//     addAddress:(addressData,userid)=>{
//         return new Promise(async(resolve,reject)=>{
//             try{
//                 let address=await addressModel.findOne({userId:userid});

//                 if(address){
//                     let addresses=await addressModel.findOne({
//                         userId:userid,
//                         address:addressData
//                     });

//                     if(addresses){
//                         resolve(response)
//                     }else{
//                         let addressArray={address:addressData};
//                         await addressModel.updateOne(
//                             {userId:userid},
//                             {
//                                 $push:{address:addressArray}
//                             }
//                         ).then((response)=>{
//                             resolve(response)
//                         });
//                     }
//                 }else{
//                     let body=new addressModel({
//                         userId:userid,
//                         address:{addressData}
//                     })
//                     body.save().then((response)=>{
//                         resolve(response)
//                     }).catch((err)=>{
//                         reject(err)
//                     })
//                 }
//             }catch(error){
//                 reject(error)
//             }
//         })
//     }

// }





