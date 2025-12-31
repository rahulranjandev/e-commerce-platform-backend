import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import cookieParser from 'cookie-parser';
import cron from 'node-cron';
import { connectDB } from '@utils/connectDB';
import { checkAndGenerateEmbeddings } from '@utils/generateEmbeddings';
import { PORT, NODE_ENV } from '@config';

import router from '@routes/index';

console.log(`NODE_ENV: ${NODE_ENV}`);

const app = express();

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cookie Parser
app.use(cookieParser());

// Set Static Folder
const logsDirectory = path.join(__dirname, 'logs');

// Create the logs directory if it doesn't exist
if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory);
}

// Create a write stream
const accessLogStream = fs.createWriteStream(path.join(logsDirectory, 'access.log'), { flags: 'a' });

// Logger
app.use(
  morgan(
    `:remote-addr - :remote-user [:date[web]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"
`,
    { stream: accessLogStream }
  )
);
app.use(
  morgan(
    `:remote-addr - :remote-user [:date[web]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"
`
  )
);

// Cors
app.use(cors());

// Set Security HTTP Headers
app.use(helmet());

// Main Routes
app.use('/', router);

// Favicon.ico
app.get('/favicon.ico', (req: Request, res: Response) => {
  return res.sendFile(path.join(__dirname, 'favicon.ico'));
});

// UnKnown Routes
app.all('/*splat', (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

// Cron Job to check for new data and generate embeddings
cron.schedule(
  '*/5 * * * *',
  () => {
    console.log('Running cron job to check for new data and generate embeddings');
    checkAndGenerateEmbeddings();
  },
  {
    timezone: 'Asia/Kolkata',
  }
);

app.listen(PORT ?? 3333, () => {
  console.log(`Server is running on port ${PORT} && http://localhost:${PORT}`);

  connectDB();
});
