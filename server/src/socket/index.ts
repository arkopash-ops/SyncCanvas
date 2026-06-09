import { Server } from "socket.io";

let io: Server;

export const initializeSocket = (server: any) => {
    io = new Server(server, {
        cors: { origin: process.env.CLIENT_URL, credentials: true }
    });
    
    io.on("connection", (socket) => {
        console.log(`Socket Connected: ${socket.id}`);

        // Join a user-specific room when authenticated
        socket.on("join_user", (userId: string) => {
            socket.join(`user_${userId}`);
            console.log(`User ${userId} joined their socket room.`);
        });
        
        socket.on("disconnect", () => {
            console.log(`Socket Disconnected: ${socket.id}`);
        });
    });

    return io;
};

export const getIO = () => io;
