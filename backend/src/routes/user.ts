import express, { Router } from 'express';
import { userController } from '../controllers/user.controller';
import {
    resendOtpRequestBodyValidator,
    signinRequestBodyValidator,
    signupRequestBodyValidator,
    verifyOtpRequestBodyValidator,
} from '../utils';
import { validateRequest } from '../middlewares';
import { checkCurrentUser } from '../middlewares/checkCurrentUser.middleware';

const router: Router = express.Router();

router.post('/login', signinRequestBodyValidator, validateRequest, userController.signin);

router.post('/signup', signupRequestBodyValidator, validateRequest, userController.signup);

router.post('/verify-otp', verifyOtpRequestBodyValidator, validateRequest, userController.verifyOtp);

router.post('/resend-otp', resendOtpRequestBodyValidator, validateRequest, userController.resendOtp);

router.get('/profile', checkCurrentUser, userController.profile);

export { router as userRoute };
