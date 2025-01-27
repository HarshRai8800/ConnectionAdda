import { PrismaClient } from "@prisma/client";
import { Request, response, Response } from "express";
import {renameSync} from "fs"
import { createToken } from "../helpers/jwt.js";
import { uploadCloudinary } from "../helpers/cloudinary.js";
const maxAge = 3 * 24 * 60 * 60 * 1000
const prisma = new PrismaClient()


 const checkUser = async(req:any,res:any)=>{
try {
    const {email}= req.body
if(!email){
    return res.status(411).json({
        success:false,
        message:"body sent is not containing required data"
    })
}
const response = await prisma.userSchema.findUnique({
    where:{
        email
    }
})
if(response){
    return res.status(200).json({
        success:true,
          response

    })
}
return res.status(400).json({
    success:false,
    message:"user not found"
})



} catch (error) {
    return res.status(411).json({
        success:false,
        message:"something went wrong"
    })   
}

}

const getUserInfo = async (req:any,res:any)=>{
try {
    const {email}= req.body
   
    if(!email){
        return res.status(400).json({
            success:false,
            msg:"email not recieved"
        })
    }

const userInfo = await prisma.userSchema.findUnique({
    where:{
    email
    }
})


if(!userInfo){
    return res.status(400).json({
        success:false,
        message:"the user is not registered in database"
    })
}

return res.
status(200).cookie("jwt",createToken(email,userInfo.id,maxAge),{
        maxAge:maxAge,
        secure:true,
    sameSite:"none"
    }).json({
    id:userInfo.id,
    email:userInfo.email,
    firstname:userInfo.firstname,
    lastname:userInfo.lastname,
    color:userInfo.color,
    password:userInfo.password,
    image:userInfo.image,
    profileSetup:userInfo.profileSetup
})


} catch (err) {
    return res.status(400).json({
        success:false,
        message:"something went wrong at server"
    })
}




}

const setUserInfo = async (req:any,res:any)=>{
    try {
        const {firstname,lastname,color,profileSetup} = req.body

        if(!firstname||!lastname){
            return res.status(400).json({
                success:false
            })
        }
        const updatedUser = await prisma.userSchema.update({
            where:{
             id:req.userId
            },
            data:{
                lastname,
                firstname,
                color,
                profileSetup
            }
        })
        if(!updatedUser){
            return res.status(400).json({
                success:false,
                message:"user coloud not be updated"
            })
        }
        return res.status(200).json({
            id:updatedUser.id,
            email:updatedUser.email,
            firstname:updatedUser.firstname,
            lastname:updatedUser.lastname,
            color:updatedUser.color,
            image:updatedUser.image,
            profileSetup:updatedUser.profileSetup
            
        })


    } catch (err) {
        return res.status(400).json({
            success:false,
            message:"something went wrong at server"
        })
    }
}

const setDeletImage = async(req:any,res:any)=>{
    const userId = req.userId
   
    const UpdatedImage = await prisma.userSchema.update({
        where:{
            id:userId
        },
       data:{
    image:null     
 }
    })
   return res.status(200).json(UpdatedImage)
}

const setUserImage = async (req:any,res:any)=>{
try {
const userId = req.userId
const response = await prisma.userSchema.findUnique({
    where:{
        id:userId
    }
})
if(!response){
    return res.status(400).json({
        status:false,
        msg:"user not found"
     })
}

const file = req.file
const upload = await uploadCloudinary(file.path)
if(!upload?.url){
    return res.status(400).json({
        status:false,
        msg:"file not found to  be saved"
     })
}

const updatedUser = await prisma.userSchema.update({
    where:{
        id:userId
    },
    data:{
        image:upload.url||""
    }
})
return res.status(200).json(updatedUser)
} catch (error) {
    console.log(error)
    return res.status(200).json({status:false,message:error})
}
}

const deleteSession = async (req:any,res:any)=>{
try {
 res.cookie("jwt","",{maxAge:1,secure:true,sameSite:true})
 return res.status(200).json({
    msg:"cookiue has been deleted successfuly"
 })
} catch (error) {
    return res.status(400).json({
        msg:"error has happened"
     })
}
}
const userTersting = async(req:any,res:any)=>{
    const userId = req.userId
    const user = await prisma.userSchema.findUnique({
        where:{
            id:userId
        }
    })
    console.log(req.file)
    const url = await uploadCloudinary(req.file.path)
    console.log(url)
return res.status(200).json(url)

}
export {
    checkUser,
    setUserInfo,
    setUserImage,
    getUserInfo,
setDeletImage,
    deleteSession,
    userTersting
    
}