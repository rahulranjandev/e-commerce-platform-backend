import cron from 'node-cron';

import app from './app';
import { connectDB } from '@utils/connectDB';
import { checkAndGenerateEmbeddings } from '@utils/generateEmbeddings';
import { PORT } from '@config';

const server = app.listen(PORT ?? 3333, () => {
  console.log(`Server is running on port ${PORT} && http://localhost:${PORT}`);

  connectDB();
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

export default server;
