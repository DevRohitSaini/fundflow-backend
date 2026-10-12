import {Router} from 'express';
import authRoutes from './auth.js';
import {authenticate} from '../middleware/authenticate.js';

const routes = Router();

routes.get('/', (req, res)=>{
    res.send("FundFlow API is running");
})

// Mount the auth routes
routes.use('/auth', authRoutes);

export default routes;
