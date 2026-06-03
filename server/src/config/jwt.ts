import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}

export const generateToken = (id: string) => {
    return jwt.sign(
        { id },
        JWT_SECRET,
        { expiresIn: "1h" }
    );
};

export const verifyToken = (jwtToken: string) => {
    return jwt.verify(jwtToken, JWT_SECRET);
};
