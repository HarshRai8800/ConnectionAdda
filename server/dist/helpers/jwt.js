import jwt from "jsonwebtoken";
export const createToken = (email, userId, maxAge) => {
    const token = jwt.sign({ email, userId }, process.env.JWT_KEY || "jwtSecret", { expiresIn: maxAge });
    return token;
};
