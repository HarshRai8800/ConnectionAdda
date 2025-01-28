import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import signup from "./routes/signup.route.js"
import signin from "./routes/signin.route.js"
import checkUser from "./routes/user.route.js"
import searchContact from "./routes/contacts.route.js"
import {createServer} from "http" // import { Server as SocketIOServer} from "socket.io"
import { socket } from "./socket.js"
import { PrismaClient } from "@prisma/client"
import messages from "./routes/message.route.js"
import createChannel from "./routes/channel.route.js"
const app = express()

dotenv.config()

const Server = createServer(app)
export const prisma = new PrismaClient()
socket(Server)
const port = process.env.PORT
app.use(cors({
    origin:"https://connectionadda.in",
    methods:["GET","POST","DELETE","PUT"],
    credentials:true
}))

app.use(cookieParser())
app.use(express.json())
app.use("/api/v1",signup)
app.use("/api/v1",signin)
app.use("/api/v1",checkUser)
app.use("/api/v1",searchContact)
app.use("/api/v1",messages)
app.use("/api/v1",createChannel)
 Server.listen(port,()=>{
    console.log("server is listening on port ",port)
})



