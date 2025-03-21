import dotenv from 'dotenv';

dotenv.config();

export const SERVER_CONFIG = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development'
};