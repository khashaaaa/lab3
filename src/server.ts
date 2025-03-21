import { createApp } from './app';
import { SERVER_CONFIG } from './config/server.config';

const startServer = async () => {
    try {
        const app = createApp();

        const server = app.listen(SERVER_CONFIG.port, () => {
            console.log(`Server running on port ${SERVER_CONFIG.port} in ${SERVER_CONFIG.nodeEnv} mode`);
        });

        process.on('SIGTERM', () => {
            console.log('SIGTERM signal received: closing HTTP server');
            server.close(() => {
                console.log('HTTP server closed');
            });
        });

    } catch (error) {
        console.error('Unable to start server:', error);
        process.exit(1);
    }
};

startServer();