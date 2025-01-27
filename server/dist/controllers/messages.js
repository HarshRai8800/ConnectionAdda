import { prisma } from "../index.js";
import { uploadCloudinary } from "../helpers/cloudinary.js";
export const getMessages = async (request, response) => {
    try {
        const { userId, recipentId } = request.body;
        console.log(userId, recipentId);
        if (!userId || !recipentId) {
            return response.status(400).json({
                success: false,
                message: "data nopt received"
            });
        }
        const messages = await prisma.messageSchema.findMany({
            where: {
                AND: [
                    {
                        OR: [
                            { recipientId: recipentId, senderId: userId },
                            { recipientId: userId, senderId: recipentId },
                        ],
                    },
                ],
            },
            include: {
                sender: true,
                recipient: true,
            },
            orderBy: {
                timestamp: 'asc', // Optionally, sort messages by timestamp
            },
        });
        console.log(messages);
        if (messages) {
            return response.status(200).json(messages);
        }
        return response.status(400).json({
            success: false,
            message: "could not find messages"
        });
    }
    catch (error) {
        return response.status(400).json({
            success: false,
            message: "something went wrong"
        });
    }
};
export const getChannelMessages = async (request, response) => {
    try {
        const { channelId } = request.body;
        const messages = await prisma.channelSchema.findUnique({
            where: {
                id: channelId
            },
            include: {
                messages: {
                    include: {
                        sender: true
                    }
                }
            }
        });
        if (!messages) {
            return response.status(400).json({
                status: false,
                message: "the messages are not to be found and chann el also not exist"
            });
        }
        return response.status(200).json(messages);
    }
    catch (error) {
        return response.status(500).json({
            status: false,
            message: "something went wrong"
        });
    }
};
export const uploadImage = async (req, res) => {
    try {
        const userId = req.userId;
        const file = req.file;
        if (file) {
            const upload = await uploadCloudinary(file.path);
            if (!upload) {
                return res.status(400).json({
                    status: false,
                    message: "file could not be uploacded"
                });
            }
            return res.status(200).json(upload);
        }
        return res.status(400).json({ message: "error" });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
};
