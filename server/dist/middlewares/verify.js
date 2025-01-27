import jwt from "jsonwebtoken";
export const verify = (req, res, next) => {
    try {
        const token = req.cookies?.jwt;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: Token not provided" });
        }
        const secretKey = process.env.JWT_KEY || "jwtSecret";
        const data = jwt.verify(token, secretKey);
        if (!data || typeof data !== "object" || !data.userId) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
        // Attach the userId to the request object
        req.userId = data.userId;
        next();
    }
    catch (error) {
        console.error("Error verifying token:", error);
        return res.status(401).json({ message: "Unauthorized: Token verification failed" });
    }
};
