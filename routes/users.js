const { middleware } = require('expres');
const { response } = require('express');
var express = require('express');
const async = require('hbs/lib/async');
const twilioController = require('../controllers/twilioController');
const usercontroller = require('../controllers/usercontroller');
const userMiddleware = require('../middleware/userMiddleware');
var router = express.Router();
const userModel=require('../model/user-model');
const bcrypt = require('bcrypt');
const productController = require('../controllers/productController');
const cartController=require('../controllers/cartController');
const wishlistController = require('../controllers/wishlistController');
const checkoutController = require('../controllers/checkoutController');
const addressController = require('../controllers/addressController');
const addressModel = require('../model/address-model');
const categoryController = require('../controllers/categoryController');
const orderController = require('../controllers/orderController');
const couponController = require('../controllers/couponController');
const wishlistModel = require('../model/wishlist-model');
const { applyCoupon } = require('../controllers/couponController');
const paymentController=require('../controllers/paymentController');
const bannerController=require('../controllers/bannerController');
const Razorpay=require('razorpay');
const { verifyPayment } = require('../controllers/paymentController');
const fs = require('fs');

var easyinvoice = require('easyinvoice');


////////////////////InVoice NPM/////////////////

//Import the library into your project
 
// var data = {
//     //"documentTitle": "RECEIPT", //Defaults to INVOICE
//     "currency": "INR",
//     "taxNotation": "gst", //or gst
//     "marginTop": 25,
//     "marginRight": 25,
//     "marginLeft": 25,
//     "marginBottom": 25,
//     "logo": "https://www.easyinvoice.cloud/img/logo.png", //or base64
//     //"logoExtension": "png", //only when logo is base64
//     "sender": {
//         "company": "TrendSetter",
//         "address": "Calicut",
//         "zip": "673003",
//         "city": "Kozhikode",
//         "country": "India"
//         //"custom1": "custom value 1",
//         //"custom2": "custom value 2",
//         //"custom3": "custom value 3"
//     },
//     "client": {
//         "company": "Client Corp",
//         "address": "Clientstreet 456",
//         "zip": "4567 CD",
//         "city": "Clientcity",
//         "country": "Clientcountry"
//         //"custom1": "custom value 1",
//         //"custom2": "custom value 2",
//         //"custom3": "custom value 3"
//     },
//     "invoiceNumber": "2020.0001",
//     "invoiceDate": "05-01-2020",
//     "products": [
//         {
//             "quantity": "2",
//             "description": "Test1",
//             "tax": 6,
//             "price": 33.87
//         },
//         {
//             "quantity": "4",
//             "description": "Test2",
//             "tax": 21,
//             "price": 10.45
//         }
//     ],
//     "bottomNotice": "Kindly pay your invoice within 15 days."
// };
 
// //Create your invoice! Easy!
// easyinvoice.createInvoice(data, async function (result) {
//     //The response will contain a base64 encoded PDF file
//     console.log(result.pdf);
//     await fs.writeFileSync("invoice.pdf", result.pdf, 'base64');
// });









const multer=require('multer');
const  fileStorageEngine = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'./public/images');
  },
  filename:(req,file,cb)=>{
    cb(null,Date.now()+"--"+file.originalname)
  }
})
const upload=multer({storage:fileStorageEngine});







const verifyLogin=(req,res,next)=>{
  if(req.session.user){
    next()
  }else{
    res.redirect('/')
  }
}


/* GET home page. */
router.get('/',userMiddleware.isblocked, function(req, res, next) {
  productController.getProduct(req.body).then(async(response)=>{
    const banner=await bannerController.latestBanners();
    const category=await categoryController.getcategory();
    const latest=await productController.getLatest();
    if(req.session.user){
      const item=await wishlistController.totalItem(req.session.user._id)
      const items=await cartController.totalItem(req.session.user._id)
      res.render('user/user-home', {item,items,banner,response,category,latest, user:true });
    }else{
      res.render('user/user-home',{response,banner,category,latest,user:false});
    }
  })
  })

// router.get('/verifyotp',(req,res)=>{
//   res.render('user/verifyotp',{layout:'layout'});
// })




///////////////////////////////////////Login/////////////////////////////////////////

router.get('/login',(req,res)=>{
  if(req.session.user){
    res.redirect('/');
  }else{
    const user = req.session.usernotfound;
    let wrongpassword=req.session.wrongpassword;
    res.render('user/user-login',{nohead:true,user,wrongpassword});
  }
});




/////////////////////User Login Post Method///////////////////////////

router.post('/login',(req,res,next)=>{
  usercontroller.userlogin(req.body).then((response)=>{
    if(response.status){
      req.session.user=response.user;
      req.session.email=response.email;
      req.session.userloggedIn=true;     //last added for middleware//
      console.log('login success');
      res.redirect('/')


    }else if(response.usernotfound){
      req.session.usernotfound=true;
      req.session.wrongpassword=false;
      console.log('user not found ');
      res.redirect('/login');


    }else{
      console.log('login failed');
      req.session.usernotfound=false;
      req.session.wrongpassword=true;
      res.redirect('/login')
    }
  })
});





/////////////////////signup///////////////////////////////

router.get('/signup',(req,res)=>{
  if(req.session.user){
    res.redirect('/')
  }else{
    res.render('user/user-signup',{layout:'layout'});
  }
})

router.get('/signup',(req,res)=>{
  session=req.session;
  // console.log(session.userAlreadyExist);
  res.render('user/user-signup',{session,layout:'layout'});
})


// router.post('/signup',(req,res)=>{
//   usercontroller.usersignup(req.body).then((state)=>{
//     if(state.userexist){
//       req.session.userAlreadyExist=true;
//       console.log('user already exist');
//       res.redirect('/signup');
//     }else{
//       req.session.user=state.user;
//       req.session.email=state.email;
//       req.session.loggedIn=true;
//       // console.log(state.user);
//       // console.log('user');
//       res.redirect('/')


//       // req.session.phonenumber=req.body.phonenumber;
//       // twilioController.getOtp(req.body.phonenumber).then((response)=>{

//       //   if(response.exist){
//       //     if(response.ActiveStatus){
//       //       req.session.user=response.user;
//       //       console.log(response.email);
//       //       req.session.email=response.email;

//       //       res.render('user/verifyotp')

//       //     }
//       //   }
//       // })
//     }
//   })
// })

router.post('/signup',async(req,res)=>{
  console.log(req.body);
 try {
  const oldUser = await userModel.findOne({email:req.body.email})
  if(oldUser) return res.redirect('/signup')
  const hash = await bcrypt.hash(req.body.password,10)
  req.body.password= hash
  const newUser = await new userModel(req.body)
 
  newUser.save()
  // res.render('user/user-home',{layout:'layout'});

  req.session.phonenumber=req.body.phonenumber;
      twilioController.getOtp(req.body.phonenumber).then((response)=>{

        if(response.exist){
          if(response.ActiveStatus){
            req.session.user=response.user;
            // console.log(response.email);
            req.session.email=response.email;

            res.redirect('/otpverify')
          }
        }
        })

 } catch (error) {
  
 }
})



// router.post('/signup',async (req,res)=>{
//   try{
//     const newUser=await new userModel(req.body);
//     newUser.save();
//     res.render('user/user-home');
//   }catch(error){
//     console.log(error);
//   }
// });



///////////Logout////////////
router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.redirect('/');
});




////////OTP//////////

// router.get('/phonenumber',(req,res)=>{
//   if(req.session.loggedIn){
//     res.redirect('/')
//   }else{
//     res.render('user/verifyotp')
//   }
// })





////////////////OTP verifying/////////////////

router.get('/otpverify',(req,res)=>{
  if(req.session.user)
  res.render('user/verifyotp');
})
router.post('/otpverify',(req,res)=>{
  console.log(req.session.phonenumber);
  console.log(req.body.otp.join(''));
  twilioController.checkOut(req.body.otp.join(''),req.session.phonenumber).then((response)=>{

    if(response=='approved'){


      req.session.loggedIn=true;
      userModel.findOneAndUpdate({phonenumber:req.session.phonenumber},{verified:true},()=>{
        res.redirect('/');
      })
    }else{
      res.render('user/verifyotp')
    }
  })
})




////////shop viewing ///////////

router.get('/shop',userMiddleware.isblocked,(req,res)=>{
  const check=req.session.user;
  console.log(check,'this is the check inside thate...');
  productController.getProduct(req.body).then((products)=>{
    categoryController.getcategory().then((category)=>{
      if(req.session.user){
        wishlistController.totalItem(req.session.user._id).then((item)=>{
          cartController.totalItem(req.session.user._id).then((items)=>{
                res.render('user/shop',{user:true,products,item,items,category,check})
            })
          })
      }else{
        res.render('user/shop',{user:false,category,products,check})
      }

    })
  })
})



////////////////get items by category//////////////

router.get('/shop/:_id',userMiddleware.isblocked,(req,res)=>{
  categoryController.getcategory().then((category)=>{
    productController.getByCategory(req.params._id).then((getByCategory)=>{
      if(req.session.user){
        wishlistController.totalItem(req.session.user._id).then((item)=>{
          cartController.totalItem(req.session.user._id).then((items)=>{
            res.render('user/shopbycategory',{user:true,category,item,items,getByCategory});
            
          })
        })
      }else{
        res.render('user/shopbycategory',{user:false,category,getByCategory});
      }
    })
    })
  })












//////////single product viewing/////////////

router.get('/singleshop/:_id',userMiddleware.isblocked,(req,res)=>{
  let productid=req.params._id;
  productController.getProductData(productid).then(async(response)=>{
    console.log(response);
    const category=await productController.getByCategory(response.categoryname);
    const products=category;
    if(req.session.user){
      const item=await wishlistController.totalItem(req.session.user._id);
    const items=await cartController.totalItem(req.session.user._id);
    res.render('user/single-shop',{user:true,response,items,item,products})
    }else{
    res.render('user/single-shop',{user:false,response,products})
    }
    
  })
  
})


//////////////cart viewing/////////////////////


router.get('/cart',userMiddleware.isblocked,verifyLogin,(req,res)=>{
  cartController.addProductDetails(req.session.user._id).then((ProductDetails)=>{
      cartController.totalItem(req.session.user._id).then(async(items)=>{
      const item=await wishlistController.totalItem(req.session.user._id);
      cartController.getTotalAmount(req.session.user._id).then((total)=>{
        if(items==0||items==undefined){
          res.render('user/cart-empty',{user:true,items,item});
        }else{
          res.render('user/user-cart',{user:true,ProductDetails,items,item,total});
        }
      })

    })
  })

    
  })


// router.get('/addtocart/:_id',(req,res)=>{
//   if(req.session.user){
//    productid=req.params._id;
//    userid=req.session.user._id;
//   cartController.addToCart(productid,userid).then((response)=>{
//     console.log(response);
//     res.redirect('/cart')
  
//   })
// }
// })

//////////////////add to cart get method//////////////// 
router.get('/addtocart/:_id',verifyLogin,(req,res)=>{
  cartController.addProductDetails(req.session.user._id).then((ProductDetails)=>{
    cartController.addToCart(req.params._id,req.session.user._id).then((response)=>{
    cart = response.cart
    cartempty = response.cartempty
      res.redirect('/cart');
  })
})
})


/////////////////add to cart from wishlist///////

router.post('/addtocart-wishlist/:_id',verifyLogin,(req,res)=>{
  cartController.addProductDetails(req.session.user._id).then((ProductDetails)=>{
    cartController.addToCart(req.params._id,req.session.user._id).then((response)=>{
      wishlistController.deleteWishlist(req.session.user._id,req.params._id).then((data)=>{
        cart = response.cart
        cartempty = response.cartempty
          res.json({response});
      })
  })
})
})


////////////add to cart post method////////////////

router.post('/addtocart/:_id',verifyLogin,(req,res)=>{
  // cartController.addProductDetails(req.session.user._id).then((ProductDetails)=>{
    cartController.addToCart(req.params._id,req.session.user._id).then((response)=>{
    cart = response.cart
    cartempty = response.cartempty
      res.json(response)
  })
// })
})



////////////////delete cart items////////////

router.post('/deletecart/:_id',verifyLogin,(req,res)=>{
  cartController.deleteCart(req.session.user._id,req.params._id).then((response)=>{
    res.json(response)
    // res.json(response);
  })
})


//////////////////////increment cart items////////////////////

router.post('/incQty/:_id',verifyLogin,(req,res)=>{
  productid=req.params._id;
  userid=req.session.user._id;
  cartController.incQty(productid,userid).then((response)=>{
    res.json(response);
  })
})


//////////////////decrement cart items//////////

router.post('/decQty/:_id',verifyLogin,(req,res)=>{
  productid=req.params._id;
  userid=req.session.user._id;
  cartController.decQty(productid,userid).then((response)=>{
    res.json(response)
  })
})




///////////wishlist items//////////


router.get('/wishlist',userMiddleware.isblocked,verifyLogin,(req,res)=>{
  wishlistController.addProductDetails(req.session.user._id).then((ProductDetails)=>{
    wishlistController.totalItem(req.session.user._id).then(async(item)=>{
      const items=await cartController.totalItem(req.session.user._id)
      if(item==0){
        res.render('user/wishlist-empty',{user:true,items,item});
      }else{
        res.render('user/user-wishlist',{user:true,ProductDetails,item,items})
      }
    })
  })
})

router.post('/toWishlist/:_id',verifyLogin,(req,res)=>{
    wishlistController.addToWishlist(req.params._id,req.session.user._id).then((response)=>{
      wishlist=response.wishlist;
      wishlistempty=response.wishlistempty;
      res.json(response);
    })
  })



router.post('/deletewishlist/:_id',verifyLogin,(req,res)=>{
  wishlistController.deleteWishlist(req.session.user._id,req.params._id).then((response)=>{
    res.json({response})
  })
})


/////////apply coupon///////////

// router.post('/applycoupon',(req,res)=>{
//   const userid=req.session.user._id;
//   usercontroller.getUser(userid).then((userdetails)=>{
//     addressController.getAddress(userid).then((viewaddress)=>{
//       cartController.addProductDetails(userid).then(async(productdetails)=>{
//         cartController.getTotalAmount(userid).then((totalamount)=>{
//           cartController.totalItem(userid).then((items)=>{
//             wishlistController.totalItem(userid).then((item)=>{
//               couponController.applyCoupon(userid,req.body).then((applyCoupon)=>{
//                 res.redirect('/checkout')
//               })
//             })
//           })

//         })
//       })
//     })
//   })
// })


///////////////////////////appply coupon////////////////////

router.post('/applycoupon',(req,res)=>{
  const userid=req.session.user._id;
  couponController.applyCoupon(userid,req.body).then((response)=>{

    console.log(response,'this is the response when the coupon apply......');
    req.session.coupon=response;
    if(response){
      req.session.coupon=response;
      // req.session.discount=response.discount;
    }
    couponController.couponUser(userid,req.body).then((userCoupon)=>{
      res.json({response});
    })
    // console.log(req.session.discount,'this is coupon.....');
  }).catch((err)=>console.error(err));
})

router.get('/checkout',userMiddleware.isblocked,verifyLogin,(req,res)=>{
  userid=req.session.user._id;
  const coupon=req.session.coupon;
  addressController.getAddress(userid).then((addresses)=>{
  cartController.addProductDetails(userid).then((productData)=>{
    cartController.getTotalAmount(userid).then((total)=>{
      couponController.getAllCoupons().then(async(coupons)=>{
        const item=await wishlistController.totalItem(req.session.user._id);
        const items=await cartController.totalItem(req.session.user._id);
        res.render('user/checkout',{user:true,userid,productData,total,addresses,coupons,coupon,item,items});
      })
      })
    })
  })
})




router.post('/address/:id',(req,res)=>{
  addressController.addAddress(req.body,req.session.user._id).then((response)=>{
    res.redirect('/checkout');
  })
})


router.post('/address-profile/:_id',(req,res)=>{
  addressController.addAddress(req.body,req.session.user._id).then((response)=>{
    res.redirect('/profile')
  })
})



router.post('/checkout',verifyLogin,async(req,res,next)=>{
  console.log(req.body,'this is requestDotBody');
  let userid=req.session.user._id;
  let coupon=req.session.coupon;
  // let grandTotal=req.session.grandTotal;
  // let coupon=req.session.coupon;
  // let couponDiscount=req.session.response.coupon.discount;
  // let grandTotal=req.session.response.grandTotal;
  if(coupon){
  const couponUser=await couponController.couponUser(userid,coupon)
  }
  orderController.placeOrder(req.body,userid,coupon).then(async(orderDetails)=>{
    const orderId=orderDetails._id;
    req.session.orders=orderDetails;
    if(orderDetails.paymentMethod==='COD'){ 
      res.json({orderDetails});
    }else{
      if(orderDetails.discount==0){
        req.session.coupon=null;
      paymentController.generateRazorpay(orderId,orderDetails.totalAmount).then((data)=>{
        res.json({data})
      })
    }else{
      paymentController.generateRazorpay(orderId,orderDetails.grandTotal).then((data)=>{
        res.json({data})
      })
    }
      }
  }).catch((err)=>{
    next(err)
  })
})


// router.post('/checkout',verifyLogin,(req,res)=>{
//   console.log(req.body,'this is the body of the req');

//   orderController.addToOrders(req.session.user._id,req.body).then((response)=>{
//     console.log(response,'this is response');
//     res.send('response sended');
//   })
// })


// router.post('/checkout',verifyLogin,(req,res)=>{
//   const userid=req.session.user._id;
//   const totalAmount=req.session.response.total;
//   orderController.addToOrders(req.body,userid,totalAmount).then((orderDetails)=>{
//     console.log(orderDetails,'this is order details');
//     req.session.oreders=orderDetails;
//     res.send('this is order confirmation');
//   })
// })





////////////adding new address/////////////

router.get('/addAddress/:_id',verifyLogin,userMiddleware.isblocked,(req,res)=>{
  addressController.addAddress(req.session.user._id,req.body).then((response)=>{
    res.render('user/add-address',{user:true});
  })
})

//////////////add new address/////////////

router.get('/addAddress',userMiddleware.isblocked,verifyLogin,async(req,res)=>{
  const userid=req.session.user._id;
  const item=await wishlistController.totalItem(req.session.user._id);
  const items=await cartController.totalItem(req.session.user._id)
  res.render('user/add-address',{user:true,item,items,userid})
})

router.get('/addAddress-profile',verifyLogin,userMiddleware.isblocked,async(req,res)=>{
  const userid=req.session.user._id;
  const item=await wishlistController.totalItem(userid);
  const items=await cartController.totalItem(userid);
  res.render('user/add-address(profile)',{user:true,items,item,userid})
})


///////////delete addresss////////////

router.get('/deleteAddress/:_id',userMiddleware.isblocked,verifyLogin,(req,res)=>{
  addressController.deleteAddress(req.params._id).then((response)=>{
    console.log(req.params._id,'this is req.params._id');
    res.redirect('/profile');
  })
})


///////////edit address////////////

router.get('/editAddress/:_id',verifyLogin,userMiddleware.isblocked,async(req,res)=>{
  const userid=req.session.user._id;
  const addressid=req.params._id;
  const item=await wishlistController.totalItem(userid);
  const items=await cartController.totalItem(userid);
  addressController.getAddressData(req.params._id).then((addresses)=>{
    console.log(addresses,'this is the address of the single person');
    res.render('user/edit-address',{user:true,userid,addressid,items,item,addresses})
  })
})


router.post('/editAddress/:_id',(req,res)=>{
  const addressid=req.params._id
  console.log(req.body,'thsi is addressid');
  console.log(addressid,'is the addressid');  
  addressController.updateAddress(addressid,req.body).then((response)=>{
    res.redirect('/profile')
  })
})



//////////////user profile////////////

router.get('/profile',userMiddleware.isblocked,verifyLogin,(req,res)=>{
  let userid=req.session.user._id;
    usercontroller.getUser(req.session.user._id).then((response)=>{
    addressController.getAddress(req.session.user._id).then(async(addresses)=>{
      const item=await wishlistController.totalItem(req.session.user._id);
      const items=await cartController.totalItem(req.session.user._id);
         res.render('user/user-profile',{user:true,userid,response,addresses,item,items});
    })
  })

})


/////////////Update Profile?/////////////////////

router.post('/update-profile',upload.array('image',1),(req,res)=>{
  const images=req.files;
  let array=[];
  array=images.map((value)=>value.filename);
  console.log(array,'this is array');
  req.body.image=array
  const userid=req.session.user._id;
  usercontroller.updateProfile(userid,req.body).then((response)=>{
    res.redirect('/profile')
  }).catch((err)=>{
    console.log(err,'error found');
  })
})



////////////////////Change Password////////////////
router.post('/change-password',(req,res)=>{
  console.log(req.body);
  const userid=req.session.user._id;
  console.log(userid,'this is userdid');
  const password=req.body;
  usercontroller.changePassword(userid,password).then((response)=>{
    res.redirect('/profile');
  })
})


/////////////Order Confirmation/////////

router.get('/orderConfirm/:_id',userMiddleware.isblocked,verifyLogin,async(req,res)=>{
  const id=req.params._id;
  const User=req.session.user;
  const session=req.session;
  const coupons=req.session.coupon;
  const item=await wishlistController.totalItem(req.session.user._id);
  const items=await cartController.totalItem(req.session.user._id);
  orderController.getTrack(id).then(async(trackDetails)=>{
    console.log(trackDetails.products,'is the detaiils');
    const everything=trackDetails.products;
    // const everything=trackDetails.cart.products;
    // console.log('thsi is to toto ',everything,'is the details');
    res.render('user/order-confirmation',{user:true,User,trackDetails,session,item,items,trackDetails,everything,coupons})
  })
})


///////Track Order////////

router.get('/trackOrder/:_id',verifyLogin,userMiddleware.isblocked,(req,res)=>{
  orderController.getTrack(req.params._id).then(async(trackDetails)=>{
    console.log(trackDetails,'this is details');
    const item=await wishlistController.totalItem(req.session.user._id);
    const items=await cartController.totalItem(req.session.user._id);
    res.render('user/track-order',{user:true,trackDetails,item,items});
  })
})



////////////////verify Payment/////////////////

router.post('/verifyPayment',verifyLogin,(req,res)=>{
  paymentController.verifyPayment(req.body).then((data)=>{
    paymentController.changePaymentStatus(req.body.order.receipt).then((response)=>{
      console.log('payment successfull !');
      res.json({status:true})
    }).catch((err)=>{
      console.log(err);
      res.json({status:false})
    })
  }) 
})





//////////////////My Order////////////

router.get('/orders',userMiddleware.isblocked,verifyLogin,(req,res)=>{
  const userid=req.session.user._id;
  orderController.myOrders(userid).then(async(allOrders)=>{
    const item=await wishlistController.totalItem(userid);
    const items=await cartController.totalItem(userid)
    res.render('user/user-orders',{user:true,allOrders,item,items})
  })


})


///////cancel orders/////

router.post('/cancelOrder/:_id',(req,res)=>{
  orderController.cancelOrder(req.params._id).then((response)=>{
    res.json({response});
  })
})




/////order confirmation////////

// router.get('/confirmation',verifyLogin,async(req,res)=>{
//   const item=await wishlistController.totalItem(req.session.user._id);
//   const items=await cartController.totalItem(req.session.user._id);
//   res.render('user/order-confirmation',{user:true,item,items});
// })
module.exports = router;
