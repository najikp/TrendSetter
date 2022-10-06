const userModel=require('../model/user-model');

module.exports={
    isblocked:(req,res,next)=>{
        if(req.session.user){
            new Promise(async(resolve,reject)=>{
                const user=await userModel.findOne({email:req.session.email})
                resolve(user)
            }).then((user)=>{
                if(user.status){
                    res.render('user/user-blocked',{nohead:true});
                }else{
                    next()
                }
            })
        }else{
            next()
        }
    }


}