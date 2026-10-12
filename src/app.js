import {env} from './config/env.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/db.js';
import routes from './routes/routes.js';

connectDB();  // Connect to MongoDB

export const app = express();

app.set('trust proxy', 1);

// Helmet helps you secure your Express apps by setting various HTTP headers
app.use(helmet());

// Enable CORS with various options
var corsOptions = {
  origin: env.CORS_ORIGIN?.split(',') ?? false,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));

// Parse incoming request bodies
app.use(express.json({ limit: '10kb' }));


app.get('/', (req,res)=>{
    res.send("FundFlow Version 1.0.0");
});

app.use('/api', routes);  // app routes

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});