const adminModel = require('../model/admin-model');
const bcrypt = require('bcryptjs');
const async = require('hbs/lib/async');
const { reject } = require('bcrypt/promises');
const userModel = require('../model/user-model');


module.exports = {
    adminlogin: (logindata) => {
        return new Promise(async (resolve, reject) => {
            let response = {
                status: false,
                adminnotfound: false
            }
            let admin = await adminModel.findOne({ email: logindata.email });

            if (admin) {
                bcrypt.compare(logindata.password, admin.password, (err, valid) => {
                    console.log(logindata.password);
                    console.log(admin.password);

                    if (valid) {
                        response.status = true;
                        response.admin = admin;
                        response.email = admin.email;
                        resolve(response);
                        console.log('success');
                    } else {
                        resolve(response);
                        console.log('error found while bcrypt', err);
                    }
                })
            } else {
                response.adminnotfound = true;
                resolve(response);
            }
        })
    },

    ////////////get user data////////////
    getUserDate: () => {
        return new Promise(async (resolve, reject) => {
            const users = await userModel.find({}).lean();
            // console.log(users);
            resolve(users);
        })
    },

    /////////block user/////////
    blockuser: (id)=>{
        return new Promise(async (resolve,reject)=>{
            const user = await userModel.findById({_id:Object(id)})
            user.status=true;
            await userModel.updateOne({_id:Object(id)},user)
            resolve('blocked')
        })
    },
    
        ////////active user///////////
        activeuser: (id) => {
            return new Promise(async (resolve, reject) => {
                const user = await userModel.findById({ _id: Object(id) })
                user.status = false;
                await userModel.updateOne({ _id: Object(id) }, user)
                resolve('active')
            })
        }

    
}