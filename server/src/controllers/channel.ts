
import { prisma } from "../index.js"


export const createChannel = async(req:any,res:any)=>{
    try {
        const {name,members,email,id}=req.body
        console.log(members)
       
        const admin = await prisma.userSchema.findUnique({
            where:{
                id:id
            }
        })
        if(!admin){
            return res.status(400).json({
                success:false,
                message:"the admin is not found in database"
            })
        }
        const validMembers = await prisma.userSchema.findMany({
            where:{
               id:{in:members} 
            }
        })
        if(validMembers.length!==members.length){
            return res.status(400).json({
                success:false,
                message:"the channeles mebers arew found to be in database"
            })
        }
        const newChannel = await prisma.channelSchema.create({
            data: {
                name,
                admin: id,
                members: {
                    connect: members.map((memberId: number) => ({ id: memberId })),
                },
            },
        });
        return res.status(200).json({
            admin:admin.id,
            name:name,
            members:validMembers
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"something went wrong while creating channel"
        })
    }
}

export const getAllChannels= async(req:any,res:any)=>{
    try {
        const {userId}=req.body
        const admin = await prisma.userSchema.findUnique({
            where:{
                id:userId
            }
        })
if(!admin){
    return res.status(400).json({
        message:"admin id not found"
    })
}
const channels = await prisma.channelSchema.findMany({
    where: {
        OR: [
            { admin: userId },
            {
                members: {
                    some: {
                        id: userId, 
                    },
                },
            },
        ],
    },
    include: {
        members: true,
    },
});

return res.status(200).json(channels)
    } catch (error) {
        return res.status(500).json({
            message:"something went wrong"
        })
    }
}
