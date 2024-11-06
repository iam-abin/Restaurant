import express, { Router } from 'express';
import { userController } from '../controllers/user.controller';
import {
    resendOtpRequestBodyValidator,
    signinRequestBodyValidator,
    signupRequestBodyValidator,
    verifyOtpRequestBodyValidator,
} from '../utils';
import { auth, validateRequest } from '../middlewares';
import { checkCurrentUser } from '../middlewares/checkCurrentUser.middleware';
import { ROLES } from '../utils/constants';

const router: Router = express.Router();

router.post('/signin', signinRequestBodyValidator, validateRequest, userController.signin);

router.post('/signup', signupRequestBodyValidator, validateRequest, userController.signup);

router.post('/verify-otp', verifyOtpRequestBodyValidator, validateRequest, userController.verifyOtp);

router.post('/resend-otp', resendOtpRequestBodyValidator, validateRequest, userController.resendOtp);

router.get('/profile', checkCurrentUser,auth(ROLES.USER), userController.profile);

router.get('/logout', checkCurrentUser,auth(ROLES.USER), userController.logout);

export { router as userRoute };
