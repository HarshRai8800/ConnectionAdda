import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const maxAge = 3 * 24 * 60 * 60 * 1000
const prisma =new PrismaClient()
const createToken = (email:string,userId:number)=>{
const token = jwt.sign({email,userId},process.env.JWT_KEY||"jwtSecret",{expiresIn:maxAge})
return token
}

export const signup = async(req:any,res:any)=>{
try {
    const {email,password,firstname,lastname}=req.body

    if(!email||!password||!firstname||!lastname){
       return res.status(411).json({
            success:false,
            message:"body sent is not containing required data"
        })
    }

const checkUser = await prisma.userSchema.findUnique({
    where:{
        email
    }
})
if(checkUser){
    return res.status(411).json({
        success:false,
        message:"user already exist"
    })
}
const hashedPassword=await bcrypt.hash(password,10)
    const user = await prisma.userSchema.create({
        data:{
            firstname,
            lastname,
            email,
         password:hashedPassword
        }
    })
    
if(!user){
   return res.status(500).json({
        success:false,
        message:"user not created error in database"
    })
}
return res.cookie("jwt",createToken(email,user.id),{
    maxAge:maxAge,
secure:true,
sameSite:"none"
})
.status(200)
.json(user)

} catch (error) {
   
    return res.status(411).json(error)
}
}