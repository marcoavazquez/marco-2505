import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes/index.ts';
import { notFound, errorHandler } from './middlewares/error-handler.ts';
import { config } from './config/index.ts';
import { checkHealth } from './middlewares/chaos.ts';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
if (config.env !== 'test') app.use(morgan('dev'));

app.use('/', routes);

app.use(checkHealth);
app.use(notFound);
app.use(errorHandler);


export default app;