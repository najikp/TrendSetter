const bannerModel=require('../model/banner-model');


module.exports={

  
    addBanner:(bannerdata)=>{
        return new Promise((resolve,reject)=>{
            bannerModel.create(bannerdata).then((response)=>{
                resolve(response)
            }).catch((error)=>{
                reject(error)
            })
        })
    },


    getBanner:()=>{
        return new Promise(async (resolve,reject)=>{
            const bannerdata= await bannerModel.find({}).lean();

            resolve(bannerdata);
        })

    },

    getBannerValue:(bannerid)=>{
        return new Promise(async (resolve,reject)=>{
            const bannerdata= await bannerModel.findOne({_id:(bannerid)}).lean()
            resolve(bannerdata)
        })
    },


    deleteBanner:(bannerid)=>{
        return new Promise((resolve,reject)=>{
            bannerModel.findByIdAndDelete({_id:(bannerid)}).then((response)=>{
                resolve(response);
            })
        })
    },


    editBanner:(bannerid,bannerdata)=>{
        return new Promise(async (resolve,reject)=>{
            bannerModel.findByIdAndUpdate(bannerid,{bannername:bannerdata.bannername,
            content:bannerdata.content,
            image:bannerdata.image}).then((response)=>{
                resolve(response);
            })
        })
    },


    latestBanners:()=>{
        return new Promise(async(resolve,reject)=>{
            try{
                const banner=await bannerModel.find().sort({createdAt:1}).lean();
                let banners=[]
                for(let i=0;i<3;i++){
                    banners[i]=banner[i];
                }
                resolve(banners);
            }catch(error){
                reject(error);
            }
        })
    }


}
    



