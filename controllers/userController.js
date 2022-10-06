const userModel=require('../model/user-model');
const bcrypt=require('bcrypt');



module.exports={
    userlogin:(logindata)=>{
        return new Promise(async (resolve,reject)=>{
            let response={
                status:false,
                usernotfound:false
            }
            let user=await userModel.findOne({email:logindata.email})
            
            if(user){
                bcrypt.compare(logindata.password,user.password,(err,valid)=>{
                    if(valid){
                        response.status=true;
                        response.user=user;
                        response.email=user.email;
                        resolve(response);
                        console.log('success');
                    }else{
                        resolve(response);
                        console.log('error found while bcrypt ',err);
                    }
                })
            }else{
                response.usernotfound=true;
                resolve(response);
            }
        })
    },

    getUser:(userid)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                    await userModel.findById({_id:userid}).lean().then((response)=>{
                    resolve(response)
                })

            }catch(error){
                reject(error)
            }
        })
    },

    updateProfile:(userid,userData)=>{
        console.log(userid,userData,'this both userid and userdata........');
        return new Promise(async(resolve,reject)=>{
            try{
                await userModel.findByIdAndUpdate(userid,{
                    name:userData.name,
                    phonenumber:userData.phonenumber,
                    email:userData.email,
                    image:userData.image
                }).then((response)=>{
                    resolve(response);
                })
            }catch(error){
                reject(error);
            }
        })
    },


    changePassword:(userid,passwords)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const password=await userModel.findOne({_id:userid});
            if(password){
                bcrypt.compare(passwords.oldPassword,password.password,async(err,valid)=>{
                    if(valid){
                        const hash = await bcrypt.hash(passwords.newPassword,10)
                            passwords.newPassword= hash;
                            const updated=await userModel.findByIdAndUpdate(userid,{password:passwords.newPassword});
                            console.log(updated,'is updated!');
                            resolve(updated)
                    }else{
                        resolve(password)
                    }
                })
            }else{
                resolve()
            }
        }catch(error){
            reject(error)
        }
    })
        


    },


    userCount:()=>{
        return new Promise(async(resolve,reject)=>{
            try{
                const users=await userModel.find();
                let count=0;
                count=users.length;
                console.log(count,'is the count of the users ...')
                resolve(count);
            }catch(error){
                reject(error);
            }
        })
    }


    // usersignup:(userdata)=>{
    //     return new Promise(async (resolve,reject)=>{
    //         let user=await userModel.findOne({email:userdata.email});
    //         const state={
    //             userexist:false,
    //             user:null
    //         }
    
    //         if(!user){
    //             // userdata.password= await bcrypt.hash(userdata.password,10);
    //             // console.log(userdata.password);
    //             userModel.create(userdata).then((data)=>{
    //                 console.log(data);
    //                 state.userexist=false;
    //                 state.user=userdata;
    //                 state.email=userdata.email;
                     
    //                 resolve(state);
    //             })
    //         }else{
    //             state.userexist=true;
    //             resolve(state);
    //         }
    //     })
    // }

}