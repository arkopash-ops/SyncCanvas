import bcrypt from "bcryptjs";
import UserModel from "../user/user.model";
import type { AuthResponse, UserLoginData, UserRegisterData } from "./auth.types";
import { generateToken } from "../../config/jwt";


// register a new user
export const register = async (data: UserRegisterData): Promise<AuthResponse> => {
    const { name, email, password } = data;

    const existing = await UserModel.findOne({ email });
    if (existing) {
        const err = new Error("Email already in use");
        (err as any).statusCode = 400;
        throw err;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
        name,
        email,
        password: hashedPassword
    });

    const token = generateToken(user._id.toString());

    return { user, token };
};


// login a user
export const login = async (data: UserLoginData): Promise<AuthResponse> => {
    const { email, password } = data;

    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
        const err = new Error("Invalid credentials");
        (err as any).statusCode = 401;
        throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        const err = new Error("Invalid credentials");
        (err as any).statusCode = 401;
        throw err;
    }

    const token = generateToken(user._id.toString());

    // Remove password from the returned document
    user.password = "" as any;

    return { user, token };
};


// logout a user
export const logout = async () => {
    return;
};
