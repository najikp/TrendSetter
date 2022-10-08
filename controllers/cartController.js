 const { ObjectID } = require("bson");
const async = require("hbs/lib/async");
const { response } = require("../app");
const cartmodel = require("../model/cart-model");
const orderModel = require("../model/order-model");

Helpers = {
  addToCart: (productid, userid) => {
    console.log('product');
    const response = {
      duplicate: false,
    };

    return new Promise(async (resolve, reject) => {
      try {
        let usercart = await cartmodel.findOne({ userId: userid });
        console.log(usercart);
        if (usercart) {
          let cartproduct = await cartmodel.findOne({
            userId: userid,
            "Cartdata.productId": productid,
          });

          if (cartproduct) {
            console.log(cartproduct);
            cartmodel
              .updateOne(
                { userId: userid, "Cartdata.productId": productid },
                { $inc: { "Cartdata.$.quantity": 1 } }
              )
              .then((response) => {
                console.log("gujuuuu", response);
                response.duplicate = true;
                resolve(response);
              });
          } else {
            let cartArray = { productId: productid, quantity: 1 };
            cartmodel
              .findOneAndUpdate(
                { userId: userid },
                {
                  $push: { Cartdata: cartArray },
                }
              )
              .then((data) => {
                resolve(response);
              });
          }
        } else {
          let body = {
            userId: userid,
            Cartdata: [{ productId: productid, quantity: 1 }],
          };
          await cartmodel.create(body);
          resolve(response)
        }
      } catch (error) {
        console.log("errrorr");
        reject(error);
      }
    });
  },
 
  addProductDetails: (userid) => {
    try{
    return new Promise(async (resolve, reject) => {
      const response = {};
       await cartmodel
        .findOne({ userId: userid })
        .populate('Cartdata.productId')
        .lean().then((cart)=>{
      if (cart) {
        if (cart.Cartdata.length > 0) {
          response.cartempty = false;
          response.cart = cart;
          resolve(response);
        } else {
          response.cartempty = true;
          response.cart = cart;
          resolve(response);
        }
      } else {
        response.cartempty = true;
        resolve(response);
      }
        })
    })
  } catch(error){
    console.log("error");
    reject(error)
  }
},




deleteCart:(userID,proId)=>{
  console.log(userID,proId)
  return new Promise((resolve,reject)=>{
    try{
     cartmodel.findOneAndUpdate({ userId:userID},{
      $pull:{
        Cartdata:{productId:proId}
      }
     }).then((data)=>{
      console.log(data,'---------------------');
      resolve(data);
     })
    }
    catch(error){
      reject(error);


    }
  })
},



incQty:(proid,userid)=>{
  return new Promise(async(resolve,reject)=>{
    cartmodel.updateOne({userId:userid,'Cartdata.productId':proid},{$inc:{'Cartdata.$.quantity':1}}).then(async(response)=>{
      let cart =await cartmodel.findOne({userId:userid})
      let quantity;
      for(let i=0;i<cart.Cartdata.length;i++){
        if(cart.Cartdata[i].productId==proid){
          quantity=cart.Cartdata[i].quantity;
        }
      }

      response.quantity=quantity;
      resolve(response)

    })
  })
},


decQty:(proid,userid)=>{
  return new Promise(async(resolve,reject)=>{
    cartmodel.updateOne({userId:userid,'Cartdata.productId':proid},{$inc:{'Cartdata.$.quantity': -1}}).then(async(response)=>{
      let cart =await cartmodel.findOne({userId:userid})
      let quantity;
      for(let i=0;i<cart.Cartdata.length;i++){
        if(cart.Cartdata[i].productId==proid){
          quantity=cart.Cartdata[i].quantity;
        }
      }

      response.quantity=quantity;
      resolve(response)

    })
  })
},

totalItem:(userid)=>{
  return new Promise(async(resolve,reject)=>{
    try{

      let cart=await cartmodel.findOne({userId:userid})
      if(cart){

        let itemCount=0
        itemCount=cart.Cartdata.length;
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

getTotalAmount:(userid)=>{
  try{
      return new Promise(async(resolve,reject)=>{

       Helpers.addProductDetails(userid).then((res)=>{
          let response={}
          cart= res.cart;
          let total;


          if(cart){
            let cartlength=cart.Cartdata.length;
            if(cartlength>=0){
              total=cart.Cartdata.reduce((acc,crr)=>{
                acc+=crr.productId.price*crr.quantity;
                return acc;
              },0)
              resolve(total)
            }else{
              response.cartempty=true;
              resolve(response)
            }
          }else{
            resolve(response);
          }
      })
    })
    }catch(error){
      rejecrt(error)
    }
}
}


module.exports=Helpers;