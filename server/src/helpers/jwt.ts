import jwt from "jsonwebtoken"

export const createToken = (email:string,userId:number ,maxAge:number)=>{
const token = jwt.sign({email,userId},process.env.JWT_KEY||"jwtSecret",{expiresIn:maxAge})
return token
}