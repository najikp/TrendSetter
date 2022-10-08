const orderModel=require('../model/order-model');
const cartController=require('../controllers/cartController');
const addressController = require('./addressController');
const cartmodel = require('../model/cart-model');

module.exports={

    placeOrder:(orderdata,userid,coupon)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                            var date=new Date();
                            var newdate=date.toISOString();
                            newdate=newdate.slice(0,10);
                            console.log(newdate,'there is a new daataaaaaa////////////////////////');

                if(orderdata.paymentMethod==='COD'){
                    OrderStatus=true;
                }
                cartController.getTotalAmount(userid).then((response)=>{
                    console.log(response,'this is response');
                    if(orderdata.discount){
                        response=response-orderdata.discount;
                    }
                    addressController.getAddressData(orderdata.address).then((details)=>{
                        console.log(details,'this is addressdetails')
                        cartController.addProductDetails(userid).then((order)=>{
                            
                            if(coupon){
                            console.log(order,'this is cart details');

                            var newOrder=new orderModel({
                                userId:userid,
                                products:order.cart.Cartdata,
                                totalAmount:response,
                                paymentMethod:orderdata.paymentMethod,
                                deliveryStatus:'Pending',
                                deliveryAddress:details[0].address,
                                grandTotal:coupon.grandTotal,
                                discount:coupon.coupon.discount,
                                OrderStatus:true,
                                productStatus:'Pending',
                                newdate:newdate
        
        
                            })
                        }else{
                            let zero=0;
                            var newOrder=new orderModel({
                                userId:userid,
                                products:order.cart.Cartdata,
                                totalAmount:response,
                                paymentMethod:orderdata.paymentMethod,
                                deliveryStatus:'Pending',
                                deliveryAddress:details[0].address,
                                grandTotal:zero,
                                discount:zero,
                                OrderStatus:true,
                                productStatus:'Pending',
                                newdate:newdate
        
        
                            })
                        }
                            newOrder.save().then(async(newOrder)=>{
                                await cartmodel.findOneAndDelete({userId:userid}).then((response)=>{

                                    resolve(newOrder);
                                })

                            })
                        })                                
                        })
                    })
                
            }catch(error){
                reject(error);
            } 
        })
    },


    getOrder:(orderid)=>{
        return new Promise((resolve,reject)=>{
            try{
                orderModel.find({_id:orderid}).lean().then((response)=>{
                    console.log(response,'this is the orders');
                })
            }catch(error){
                reject(error)
            }
        })
    },


    getTrack:(orderid)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                await orderModel.findOne({_id:orderid}).populate('products.productId').populate('userId').lean().then((response)=>{
                    resolve(response);
                })
            }catch(error){
                console.log('error founded:',error);
                reject(error);
            }
        })
    },

    myOrders:(userid)=>{
        console.log(userid,'is the userid')
        return new Promise(async(resolve,reject)=>{
            try{
                await orderModel.find({userId:userid}).sort({createdAt:-1}).populate('products.productId').lean().then((response)=>{
                    console.log(response,'this is response form the orders by the user');
                    resolve(response);
                })
            }catch(error){
                reject(error);
            }
        })
    },

    allOrders:()=>{
        return new Promise(async(resolve,reject)=>{
            try{
                await orderModel.find().sort({createdAt:-1}).lean().populate('products.productId').then((response)=>{
                    resolve(response);
                })
            }catch(error){
                reject(error)
            }
        })
    },

    shipOrder:(orderid)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                await orderModel.findByIdAndUpdate({_id:orderid},{productStatus:'shipped'}).then((response)=>{
                    resolve(response);
                })
            }catch(error){
                reject(error);
            }
        })
    },

    deliveryOrder:(orderid)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                await orderModel.findByIdAndUpdate({_id:orderid},{productStatus:'delivered',deliveryStatus:'success'}).then((response)=>{
                    resolve(response);
                })
            }catch(error){
                reject(error);
            }
        })
    },

    cancelOrder:(orderid)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                await orderModel.findByIdAndUpdate({_id:orderid},{productStatus:'cancelled'}).then((response)=>{
                    resolve(response);
                })
            }catch(error){
                reject(error);
            }
        })
    },

    shipOrder:(orderid)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                await orderModel.findByIdAndUpdate({_id:orderid},{productStatus:'shipped'}).then((response)=>{
                    resolve(response);
                })
            }catch(error){
                reject(error);
            }
        })
    },

    orderCount:()=>{
        return new Promise(async(resolve,reject)=>{
            try{
                let orders=await orderModel.find().lean();
                console.log(orders,'thesse are the orders....');
                let count=0;
                count=orders.length;
                console.log(count,'is the count of the orders array...');
                resolve(count);
            }catch(error){
                reject(error);
            }
        })
    },

    pendingDelivery:()=>{
        return new Promise(async(resolve,reject)=>{
            try{
                const pending=await orderModel.find({productStatus:'Pending'})
                let count=0;
                count=pending.length;
                console.log(count,'this is the count of the pending orders..');
                resolve(count);
            }catch(error){
                reject(error);
            }
        })
    },
    successDelivery:()=>{
        return new Promise(async(resolve,reject)=>{
            try{
                const success=await orderModel.find({productStatus:'delivered'})
                let count=0;
                count=success.length;
                console.log(count,'this is the count of delivered orderes///');
                resolve(count)
            }catch(error){
                reject(error);
            }
        })
    },
    cancelDelivery:()=>{
        return new Promise(async(resolve,reject)=>{
            try{
                const cancel=await orderModel.find({productStatus:'cancelled'});
                let count=0;
                count=cancel.length;
                resolve(count)
            }catch(error){
                reject(error);
            }
        })
    },

    codPayment:()=>{
        return new Promise(async(resolve,reject)=>{
            try{
                const cod=await orderModel.find({paymentMethod:'COD'})
                let count=0;
                count=cod.length;
                resolve(count)
            }catch(error){
                reject(error);
            }
        })
    },


    onlinePayment:()=>{
        return new Promise(async(resolve,reject)=>{
            try{
                const online=await orderModel.find({paymentMethod:'Online'});
                let count=0;
                count=online.length;
                resolve(count);
            }catch(error){
                reject(error);
            }
        })
    },
    todayIncome:()=>{
        return new Promise(async(resolve,reject)=>{
            try{
                let day=new Date();
                let today=day.toISOString();
                today=today.slice(0,10);
                const orders=await orderModel.find({newdate:today})
                console.log(orders,'these are the orders of today only ');
                    let a=0;
                    let b=0;
                    var totalamount=0;
                    var grandtotal=0;
                for(let i=0;i<orders.length;i++){
                    if(orders[i].grandTotal===0){
                        for(let x=a;x<=a;x++){
                            console.log(orders[i].totalAmount,'TOTAL AMOUNT(today)')
                            totalamount=totalamount+orders[i].totalAmount;
                        }
                    }else{
                        for(let y=b; y<=b; y++){
                            console.log(orders[i].grandTotal,'GRAND TOTAL(today)');
                            grandtotal=grandtotal+orders[i].grandTotal;
                        }
                    }
                }
                console.log(totalamount,'this is totalamount(today)');
                console.log(grandtotal,'this is the grandtotal(today)');
                const totalincome=totalamount+grandtotal;
                console.log(totalincome,'is the TOTAL INCOME(today)');
                resolve(totalincome);
            }catch(error){
                reject(error)
            }
        })
    },

    totalIncome:()=>{
        return new Promise(async(resolve,reject)=>{
            try{
                const orders=await orderModel.find().lean();
                console.log(orders,'are the orders...');
                    let a=0;
                    let b=0;
                    var totalamount=0;
                    var grandtotal=0;
                for(let i=0;i<orders.length;i++){
                    if(orders[i].grandTotal===0){
                        for(let x=a;x<=a;x++){
                            console.log(orders[i].totalAmount,'TOTAL AMOUNT')
                            totalamount=totalamount+orders[i].totalAmount;
                        }
                    }else{
                        for(let y=b; y<=b; y++){
                            console.log(orders[i].grandTotal,'GRAND TOTAL');
                            grandtotal=grandtotal+orders[i].grandTotal;
                        }
                    }
                }
                console.log(totalamount,'this is totalamount');
                console.log(grandtotal,'this is the grandtotal');
                const totalincome=totalamount+grandtotal;
                console.log(totalincome,'is the TOTAL INCOME');
                resolve(totalincome);
            }catch(error){
                reject(error);  
            }
        })
    },

    stati:()=>{
        return new Promise(async(resolve,reject)=>{
            try{
                var dateArray=[];
                for(let i=0;i<5;i++){
                    var d=new Date();
                    d.setDate(d.getDate()-i)
                    var newdate=d.toISOString();
                    newdate=newdate.slice(0,10);
                    dateArray[i]=newdate;
                }
                var dateSale=[]
                for(i=0;i<5;i++){
                    dateSale[i]=await orderModel.find({newdate:dateArray[i]}).lean().count();
                }
                var status={
                    dateSale:dateSale,
                    dateArray:dateArray
                }
                resolve(status);
            }catch(error){
                reject(error)
            }
        })
    }

}