import cors from 'cors';
import cookieParser from 'cookie-parser';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes/index.all';

const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

const start_server = async (req: Request, res: Response) => {
  res.send('hello world');
};
app.get('/', start_server);

app.use('/api', router);

app.use(globalErrorHandler);
app.use(notFound);
export default app;
