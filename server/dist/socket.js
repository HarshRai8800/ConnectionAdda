import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const socket = (server) => {
    console.log("hii");
    const io = new Server(server, {
        cors: {
            origin: ["https://connectionadda.com"],
            methods: ["GET", "POST", "DELETE", "PUT"],
            credentials: true,
        }
    });
    const userSocketMsap = new Map();
    const userPublicMap = new Map();
    const disconnect = (socket) => {
        for (const [userId, socketId] of userSocketMsap.entries()) {
            if (socketId === socket.id) {
                userSocketMsap.delete(userId);
                break;
            }
        }
    };
    const sendMessage = async (message) => {
        console.log(message);
        const senderSocketId = userSocketMsap.get(Number(message.senderId));
        console.log(senderSocketId);
        const recipentSocketId = userSocketMsap.get(message.recipientId);
        if (message.fileUrl) {
            const createdMessage = await prisma.messageSchema.create({
                data: {
                    senderId: message.senderId,
                    recipientId: message.recipientId,
                    messageType: message.messageType,
                    fileUrl: message.fileUrl,
                    timestamp: new Date()
                }
            });
            console.log(createdMessage);
            const messageData = await prisma.messageSchema.findUnique({ where: { id: createdMessage.id },
                include: {
                    sender: true,
                    recipient: true
                }
            });
            if (senderSocketId) {
                io.to(senderSocketId).emit("recievedMessage", { messageData });
            }
            if (recipentSocketId) {
                console.log("inside sender");
                io.to(recipentSocketId).emit("recievedMessage", { messageData });
            }
            return;
        }
        const createdMessage = await prisma.messageSchema.create({
            data: {
                senderId: message.senderId,
                recipientId: message.recipientId,
                messageType: message.messageType,
                content: message.content ? message.content : undefined,
                fileUrl: message.fileUrl,
                timestamp: new Date()
            }
        });
        console.log(createdMessage);
        const messageData = await prisma.messageSchema.findUnique({ where: { id: createdMessage.id },
            include: {
                sender: true,
                recipient: true
            }
        });
        if (senderSocketId) {
            io.to(senderSocketId).emit("recievedMessage", { messageData });
        }
        if (recipentSocketId) {
            console.log("inside sender");
            io.to(recipentSocketId).emit("recievedMessage", { messageData });
        }
    };
    const sendChannelMessage = async (message) => {
        const { channelId, senderId, content, messageType, fileUrl } = message;
        const createMessage = await prisma.messageSchema.create({
            data: {
                senderId,
                recipientId: null,
                content,
                channelId,
                messageType,
                timestamp: new Date(),
                fileUrl,
            }
        });
        const messageData = await prisma.messageSchema.findUnique({
            where: {
                id: createMessage.id
            },
            include: {
                sender: true
            }
        });
        const channel = await prisma.channelSchema.findUnique({
            where: {
                id: channelId
            },
            include: {
                messages: true,
                members: true
            }
        }) || { id: "", members: [], admin: "" };
        const finalData = { ...messageData, channelId: channel.id };
        if (channel && channel.id) {
            channel.members.forEach((members) => {
                const membersSocketId = userSocketMsap.get(Number(members.id));
                if (membersSocketId) {
                    console.log(finalData);
                    io.to(membersSocketId).emit("send_channel_message", finalData);
                }
            });
            const adminSocketId = userSocketMsap.get(Number(channel.admin));
            console.log(adminSocketId);
            if (adminSocketId) {
                io.to(adminSocketId).emit("send_channel_message", finalData);
            }
        }
    };
    io.on("connect", (socket) => {
        console.log("connnected");
        const userId = Number(socket.handshake.query.userId);
        if (userId) {
            userSocketMsap.set(userId, socket.id);
            console.log("testing" + userSocketMsap.get(userId));
            console.log(`User Connected ${userId} with Socker ID : ${socket.id}`);
        }
        else {
            console.log("User Id not provided during connection");
        }
        socket.on("sendMessage", sendMessage);
        socket.on("send_channel_message", sendChannelMessage);
        socket.on("disconnect", () => disconnect(socket));
    });
};
