import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import { errorHandler } from './utils/error.handler';

export const createApp = (): Application => {
    const app: Application = express();

    app.use(helmet());
    app.use(cors());

    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }

    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ extended: true, limit: '1mb' }));

    app.use('/', routes);

    app.use(errorHandler);

    return app;
};