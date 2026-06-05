import './config/env';

import http from 'http'
import app from './app';
import connectDB from './config/db';
import { initializeSocket } from './socket';

const PORT = process.env.PORT || 8081;

connectDB();

const server = http.createServer(app);
initializeSocket(server);

server.listen(PORT, () => {
    console.log(`Server running on  http://localhost:${PORT}/`);
});

