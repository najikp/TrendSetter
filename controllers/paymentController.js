const Razorpay=require('razorpay');
const orderModel=require('../model/order-model');
const dotenv=require('dotenv');
dotenv.config({path:"./config.env"});
const instance = new Razorpay({
    key_id:process.env.key_id,
    key_secret:process.env.key_secret
  });

module.exports={
    generateRazorpay:(orderId,totalAmount)=>{
        return new Promise((resolve,reject)=>{
            var options = {
                amount: totalAmount*100,  // amount in the smallest currency unit
                currency: "INR",
                receipt: ''+orderId
              };
              instance.orders.create(options, function(err, order) {
                console.log(order,'this is the instance');
                resolve(order)
              });
        })
    },
    verifyPayment:(details)=>{
      console.log(details,'this is details');
      return new Promise(async(resolve,reject)=>{
        try{
          const crypto=require('crypto');
          let hmac=crypto.createHmac('sha256',instance.key_secret);
          let body=details.payment.razorpay_order_id + "|" + details.payment.razorpay_payment_id;
          hmac.update(body.toString());
          hmac=hmac.digest('hex')
          if(hmac==details.payment.razorpay_signature){
            console.log('this is RESOLVE')
              resolve()
          }else{
            console.log('this is REJECT')
            reject()
          }

        }catch(error){
          console.log('this is the error working on it');
          console.error(error);
          reject(error)
        }
      })
    },

    changePaymentStatus:(orderid)=>{
      console.log(orderid,'is the orderid from changepaymnet staturs');
      return new Promise(async(resolve,reject)=>{
        try{
          await orderModel.findOneAndUpdate({_id:orderid},{OrderStatus:true,deleveryStatus:'success'}).then((response)=>{
            resolve(response);
          })
        }catch(error){
          reject(error)
        }
      })
    }
}