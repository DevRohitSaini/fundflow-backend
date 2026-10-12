import {Router} from 'express';
import * as authController from '../controllers/auth.js';

const authRoutes = Router();

authRoutes.route('/signin').post(authController.signin);
authRoutes.route('/token').get(authController.refreshToken);
authRoutes.route('/logout').post(authController.logout);
authRoutes.route('/signup').post(authController.signup);

export default authRoutes;