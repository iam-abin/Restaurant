import express, { Router } from 'express';
import { userController } from '../controllers/user.controller';
import {
    signinRequestBodyValidator,
    signupRequestBodyValidator,
  
} from '../utils';
import { validateRequest } from '../middlewares';


const router: Router = express.Router();

router.post('/login', signinRequestBodyValidator, validateRequest, userController.signin);

router.post('/signup', signupRequestBodyValidator, validateRequest, userController.signup);

export { router as userRoute };
