import {app} from './src/app.js';
import  {env} from './src/config/env.js';

app.listen(env.PORT || 4000, () => {
    console.log(`FundFlow API listening on :${env.PORT} ${env.NODE_ENV}`);
});

const shutdown = async () => {
  server.close();
  await mongoose.disconnect();
  process.exit(0);
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);