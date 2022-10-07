const { response } = require('express');
var express = require('express');
var router = express.Router();
const mongoose=require('mongoose');
const { render } = require('../app');
const adminController = require('../controllers/adminController');
const categoryController = require('../controllers/categoryController');
const productController = require('../controllers/productController');
const adminModel = require('../model/admin-model');
const userModel = require('../model/user-model');

const verifyLogin=(req,res,next)=>{
  if(req.session.admin){
    next()
  }else{
    res.redirect('/admin')
  }
}



const multer=require('multer');
const bannerController = require('../controllers/bannerController');
const coupenController = require('../controllers/couponController');
const couponController = require('../controllers/couponController');
const orderController = require('../controllers/orderController');
const usercontroller = require('../controllers/userController');
const  fileStorageEngine = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'./public/images');
  },
  filename:(req,file,cb)=>{
    cb(null,Date.now()+"--"+file.originalname)
  }
})
const upload=multer({storage:fileStorageEngine});

/* GET users listing. */
router.get('/',async(req,res,next)=>{
  if(req.session.admin){
    let admin=req.session.admin;
    res.redirect('/admin/login');
  }else{
    res.render('admin/admin-login',{nohead:true,admin:false});
  }
})
// router.post('/',(req,res)=>{
//   if(req.session.admin){
//     res.render('admin/admin-home',{layout:'admin-layout'})
//   }else{
//     res.render('admin/admin-login');
//   }
// })


// router.get('/admin',(req,res)=>{
//   if(req.session.admin){
//     res.redirect('/admin')
//   }else{
//     const admin=req.session.adminnotfound;
//     const wrongpassword=req.session.wrongpassword;
//     res.render('admin/admin-login',{admin,wrongpassword});
//   }
// })

 router.get('/adminlogout',(req,res)=>{
  req.session.destroy();
  res.redirect('/admin')
 });



 router.get('/login',verifyLogin,async(req,res)=>{
  const usersCount=await usercontroller.userCount();
      const orderCount=await orderController.orderCount();
      const pendingCount=await orderController.pendingDelivery();
      const successCount=await orderController.successDelivery();
      const cancelCount=await orderController.cancelDelivery();
      const totalIncome=await orderController.totalIncome();
      const codCount=await orderController.codPayment();
      const onlinePay=await orderController.onlinePayment();
      const dailyincome=await orderController.todayIncome();
      res.render('admin/admin-home',{admin:true,layout:'admin-layout',dailyincome,onlinePay,codCount,totalIncome,usersCount,orderCount,pendingCount,successCount,cancelCount});
 })


router.post('/login',(req,res)=>{
  adminController.adminlogin(req.body).then(async(response)=>{

    if(response.status){

      req.session.admin=response.admin;
      console.log(req.session.admin);
      req.session.email=response.email;
      req.session.userloggedIn=true;
      console.log('login success');
      res.redirect('/admin/login')
    
    }else if(response.adminnotfound){
      req.session.adminnotfound=true;
      req.session.wrongpassword=false;
      console.log('admin not found');
      res.redirect('/admin')
    
    }else{
      req.session.adminnotfound=false;
      req.session.wrongpassword=true;
      res.redirect('/admin');
    }
  })
})

///////////////////User Management/////////////////

router.get('/users',(req,res)=>{
  if(req.session.admin){
    adminController.getUserDate().then((users)=>{
      res.render('admin/users',{users,layout:'admin-layout'})
    })
  }else{
    res.redirect('/admin')
  }
});


///////////////Block Users////////////
router.get('/blockuser/:_id',(req,res,next)=>{
  const id=req.params._id;
  console.log('working');
  adminController.blockuser(id).then((response)=>{
    // req.session.user.status=true;
    console.log(response);
    res.redirect('/admin/users')
  }).catch((err)=>{
    next(err)
  })
})


//////////Active Users/////////////
router.get('/activeuser/:_id',(req,res,next)=>{
  const id=req.params._id;
  adminController.activeuser(id).then((response)=>{
    res.redirect('/admin/users')
   }).catch((err)=>{
    next(err)
   })
})







/////////Category Management/////////////////////

router.get('/category',(req,res)=>{
  if(req.session.admin){
    categoryController.getcategory().then((response)=>{
      res.render('admin/category',{response,layout:'admin-layout'})
    })
  }else{
    res.redirect('/admin')
  }
})




//////////////////Add category page getting////////////////

router.get('/addcategory',(req,res)=>{
  const categoryexist=req.session.categoryexist;
  req.session.categoryexist=null;

  res.render('admin/add-category',{categoryexist,layout:'admin-layout'})
})






//////////////////get category data/////////////////

router.post('/addcategory',upload.array('image',1),(req,res)=>{
  const images=req.files;
  let array=[];
  array=images.map((value)=>value.filename);
  req.body.image=array;
  console.log(req.body,'this is req.body when category creation...');
  categoryController.addcategoryData(req.body).then((response)=>{
    if(response.exist){
      req.session.categoryexist=true;
      req.session.category=response.category;
      res.redirect('/admin/addcategory');
    }else{
      req.session.category=response.category;
      // console.log(req.session.category);
      // console.log(response);
      res.redirect('/admin/category');
    }
  }).catch((err)=>{
    console.log('error found',err);
  })

})


/////////////////////delete category//////////////////

router.get('/delete-category/:_id',async(req,res,next)=>{
  const categoryid=req.params._id;
  const category=await categoryController.categoryCheck(categoryid);
  console.log(category[0],'this is what it is.....');
  if(category[0]!=undefined){
    res.redirect('/admin/category')
  }else{
    console.log(category,'is the category inside the product')
    categoryController.deletecategory(categoryid).then((data)=>{
    res.redirect('/admin/category')
    }).catch((err)=>{
      next(err)
    })
  }

})


/////////////////////update category//////////////////////

router.get('/editcategory/:_id',(req,res,next)=>{
  const categoryid=req.params._id;
  categoryController.getcategorydata(categoryid,req.body).then((categorydata)=>{
    res.render('admin/update-category',{categorydata,layout:'admin-layout'})
  }).catch((err)=>{
    next(err)
  })
})

router.post('/updatecategory/:_id',upload.array('image',1),(req,res,next)=>{
  const images=req.files;
  let array=[];
  array=images.map((value)=>value.filename);
  req.body.image=array;
  const categoryid=req.params._id;
  categoryController.updatecategory(categoryid,req.body).then((response)=>{
    res.redirect('/admin/category')
  }).catch((err)=>{
    next(err)
  })
})






///////////////////////Product Management/////////////////////

router.get('/product',(req,res)=>{
  if(req.session.admin){

    productController.getProduct().then((response)=>{
      res.render('admin/product',{response,layout:'admin-layout'});
    })
  }else{
    res.redirect('/admin')
  }
})


////////////Add Product///////////////

router.get('/addproduct',(req,res)=>{
  if(req.session.admin){
    categoryController.getcategory().then((category)=>{
      
      res.render('admin/add-product',{category,layout:'admin-layout'})
    })
  }
})

router.post('/addproduct',upload.array('image',3),(req,res)=>{
  const images=req.files;
  let array=[];
  array=images.map((value)=>value.filename);
  req.body.image=array;
  productController.AddProduct(req.body).then((response)=>{
    res.redirect('/admin/product')
  }).catch((error)=>{
    console.log('error undallo',error);
  })
})





////////////Delete Product////////////

router.get('/deleteproduct/:_id',(req,res,next)=>{
  const productid=req.params._id;
  productController.deleteProduct(productid).then((data)=>{
    res.redirect('/admin/product');
  }).catch((err)=>{
    next(err)
  })
})


/////////////Update Product/////////////////

router.get('/updateproduct/:_id',(req,res,next)=>{
  const productid=req.params._id;
  productController.updateProduct(productid,req.body).then((productdata)=>{
    categoryController.getcategory(productid).then((categorydata)=>{
      const products={
        _id:productdata._id,
        productname:productdata.productname,
        price:productdata.price,
        catagoryname:productdata.catagoryname,
        image:productdata.image,
        description:productdata.description

      };
      res.render('admin/update-product',{products,categorydata,layout:'admin-layout'});

    })
  }).catch((err)=>{
    next(err)
  })
})



router.post('/updateproduct/:_id',upload.array('image',3),(req,res,next)=>{
  const productid=req.params._id;
  const image=req.files;
  let array=[];
  array=image.map((value)=>value.filename);
  req.body.image=array;
  productController.updateProduct(productid,req.body).then((response)=>{
    res.redirect('/admin/product')
  }).catch((err)=>{
    next(err)
  })
})






///////////banner management///////////

router.get('/banner',(req,res)=>{
  bannerController.getBanner().then((bannerdata)=>{
    res.render('admin/banner',{bannerdata,layout:'admin-layout'});
  })
})





////////////add banner//////////////////

router.get('/addbanner',(req,res)=>{
 res.render('admin/add-banner',{layout:'admin-layout'});
})

router.post('/addbanner',upload.array('image',1),(req,res)=>{
  const image=req.files;
  let array=[];
  array=image.map((value)=>value.filename);
  req.body.image=array;
  bannerController.addBanner(req.body).then((response)=>{
    res.redirect('/admin/banner');
  }).catch((err)=>{
    console.log(err);
  })
})



/////////delete banner data///////

router.get('/deletebanner/:_id',(req,res,next)=>{

  const bannerid=req.params._id;
  bannerController.deleteBanner(bannerid).then((response)=>{

    res.redirect('/admin/banner');
  }).catch((err)=>{
    next(err)
  })

})



///////////edit banner data/////////

router.get('/updatebanner/:_id',(req,res,next)=>{
  let bannerid=req.params._id;
    bannerController.getBannerValue(bannerid).then((response)=>{ 
      console.log(response);
      res.render('admin/update-banner',{response,layout:'admin-layout'});
    }).catch((err)=>{
      next(err)
    })               

})



router.post('/updatebanner/:_id',upload.array('image',3),(req,res,next)=>{
  const image=req.files;
  let array=[];
  array=image.map((value)=>value.filename)
  req.body.image=array;
  let bannerid=req.params._id;
  bannerController.editBanner(bannerid,req.body).then((response)=>{
    res.redirect('/admin/banner');
  }).catch((err)=>{
    next(err)
  })
})




////////////////////coupen management/////////////////////////////

router.get('/coupon',verifyLogin,(req,res)=>{
  couponController.getAllCoupons().then((response)=>{
    res.render('admin/coupon',{response,layout:'admin-layout'})
  })
})
/////adding coupen/////////

router.get('/addcoupon',verifyLogin,(req,res)=>{
  const couponexist=req.session.couponexist;
  req.session.couponexist=null;
  res.render('admin/add-coupon',{couponexist,layout:'admin-layout'});
})


router.post('/addcoupon',(req,res)=>{
  couponController.addCoupon(req.session.user._id,req.body).then((response)=>{
    if(response.exist){
      req.session.couponexist=true;
      req.session.coupon=response.coupon;
      res.redirect('/admin/addcoupon')
    }else{
      req.session.coupon=response.coupon;
      res.redirect('/admin/coupon');
    }
  }).catch((error)=>{
    console.log(error);
  })
})


//////////delete coupons///////////

router.get('/deletecoupon/:_id',(req,res,next)=>{
  couponController.deleteCoupon(req.params._id).then((response)=>{
    res.redirect('/admin/coupon'); 
  }).catch((err)=>{
    next(err)
  })
})


//////////edit coupons//////////

router.get('/editcoupon/:_id',(req,res,next)=>{
  couponController.getcoupon(req.params._id).then((response)=>{
    res.render('admin/update-coupon',{response,layout:'admin-layout'});
  }).catch((err)=>{
    next(err)
  })
})


router.post('/editcoupon/:_id',(req,res,next)=>{
  couponController.editCoupons(req.params._id,req.body).then((response)=>{
    res.redirect('/admin/coupon')
  }).catch((error)=>{
    console.log(error);
    next(err)
  }) 
})


///////////Order Management////

router.get('/orders',verifyLogin,(req,res)=>{
  orderController.allOrders().then((orderDetails)=>{
    res.render('admin/orders',{layout:'admin-layout',orderDetails});
  }).catch((err)=>{
    console.log(err,':founded at line:450/admin.js');
  })
})



/////shipping////
router.post('/shipOrder/:_id',(req,res,next)=>{
  orderController.shipOrder(req.params._id).then((response)=>{
    // res.redirect('/admin/orders')
    res.json({response})
  }).catch((err)=>{
    next(err)
  })
})

////deliverying////
router.post('/deliveryOrder/:_id',(req,res,next)=>{
  orderController.deliveryOrder(req.params._id).then((response)=>{
    // res.redirect('/admin/orders');
    res.json({response});
  }).catch((err)=>{
    next(err)
  })

})

/////cancelling///
router.post('/cancelOrder/:_id',(req,res,next)=>{
  orderController.cancelOrder(req.params._id).then((response)=>{
    // res.redirect('/admin/orders');
    res.json({response});
  }).catch((err)=>{
    next(err)
  })
})



//////get dashboard graph//////////

router.get('/getdash',(req,res,next)=>{
  orderController.stati().then((status)=>{
    res.json({status})
  }).catch((err)=>{
    next(err)
  })
})





///////get datatanle//////
router.get('/table',verifyLogin,async(req,res)=>{
  const orders=await orderController.allOrders()
  res.render('admin/reportTable',{nohead:true,orders});
})


module.exports = router;