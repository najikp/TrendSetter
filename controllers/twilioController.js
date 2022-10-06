const { promise } = require('bcrypt/promises');
const async = require('hbs/lib/async');
const { promises } = require('nodemailer/lib/xoauth2');
const twilio=require('twilio');
const userModel=require('../model/user-model');
const dotenv=require('dotenv');
dotenv.config({path:"./config.env"});

const config={
    serviceid:process.env.serviceid,
    accountSID:process.env.accountSID,
    authToken:process.env.authToken

};


const client = require('twilio')(config.accountSID,config.authToken);

module.exports={
    getOtp:(number)=>{
        return new Promise (async (resolve,reject)=>{
            const user=await userModel.findOne({phonenumber:number});
            const response={};


            if(user){
                response.exist=true;
                if(!user.ActiveStatus){
                    client.verify.v2.services(config.serviceid).verifications.create({
                        to:'+91'+number,
                        channel:'sms'
                    }).then((data)=>{
                        console.log('response');
                        response.data=data;
                        response.user=user;
                        response.email=user.email=user.email;
                        response.ActiveStatus=true;
                        resolve(response)
                    }).catch((error)=>{
                        console.log('error founf at verification');
                        reject(error)
                    })
                }else{
                    response.userBlocker=true;
                    resolve(response)
                }
            }else{
                response.exist=false;
                resolve(response)
            }
        })
    },



    checkOut:(otp,number)=>{
        const phonenumber='+91'+number;
        return new Promise((resolve,reject)=>{
            client.verify.v2.services(config.serviceid).verificationChecks.create({
                to:phonenumber,
                code:otp
            }).then((verification_check)=>{
                console.log(verification_check.status);
                console.log('verification success');
                resolve(verification_check.status);
            }).catch((error)=>{
                console.log('error',error);
            })
        });
    }
}