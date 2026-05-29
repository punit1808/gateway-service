import jwt from "jsonwebtoken";

const publicRoutes = [
"/auth/login",
"/auth/register",
"/health"
];

const authMiddleware = (req, res, next) => {

if (publicRoutes.some(route => req.path.startsWith(route))) {
    return next();
}

const authHeader = req.headers.authorization;

if (!authHeader || !authHeader.startsWith("Bearer ")) {

    return res.status(401).json({
        message: "Missing or invalid token"
    });
}

const token = authHeader.split(" ")[1];

try {

    const decoded = jwt.verify(
        token,
        Buffer.from(process.env.JWT_SECRET, "base64")
        );

    req.headers["x-user-email"] = decoded.sub;

    next();

} catch (err) {

    return res.status(401).json({
        message: "Invalid or expired token"
    });

}

};

export default authMiddleware;
