import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();
import { createToken } from "../helpers/jwt.js";
const maxAge = 3 * 24 * 60 * 60 * 1000;
export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(411).json({
                success: false,
                message: "body sent is not containing required data"
            });
        }
        const response = await prisma.userSchema.findUnique({
            where: {
                email,
            }
        });
        if (!response) {
            return res.status(200).json({
                success: false,
                message: "User Dont Exist"
            });
        }
        const checkingPassword = bcrypt.compare(password, response.password);
        if (!checkingPassword) {
            return res.status(200).json({
                success: false,
                message: "password is incorrect"
            });
        }
        return res.status(200).cookie("jwt", createToken(email, response.id, maxAge), {
            maxAge: maxAge,
            secure: true,
            sameSite: "none"
        }).json(response);
    }
    catch (error) {
        return res.status(411).json({
            success: false,
            message: "something went wrong"
        });
    }
};
export const GoogleGitSigIn = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(411).json({
                success: false,
                message: "body sent is not containing required data"
            });
        }
        const response = await prisma.userSchema.findUnique({
            where: {
                email,
            }
        });
        if (!response) {
            return res.status(400).json({
                success: false,
                message: "User Dont Exist"
            });
        }
        return res.status(200).cookie("jwt", createToken(email, response.id, maxAge), {
            maxAge: maxAge,
            secure: true,
            sameSite: "none"
        }).json(response);
    }
    catch (error) {
        return res.status(411).json({
            success: false,
            message: "something went wrong"
        });
    }
};
