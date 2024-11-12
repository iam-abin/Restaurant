import express, { Router } from 'express';
import { userController } from '../controllers/auth.controller';
import {
    resendOtpRequestBodyValidator,
    signinRequestBodyValidator,
    signupRequestBodyValidator,
    verifyOtpRequestBodyValidator,
    ROLES_CONSTANTS,
} from '../utils';
import { checkCurrentUser, auth, validateRequest } from '../middlewares';
import { forgotPasswordRequestBodyValidator, resetPasswordRequestBodyValidator } from '../utils/validation/password.validation';

const router: Router = express.Router();

router.post('/signin', signinRequestBodyValidator, validateRequest, userController.signin);

router.post('/signup', signupRequestBodyValidator, validateRequest, userController.signup);

router.post('/verify-otp', verifyOtpRequestBodyValidator, validateRequest, userController.verifyOtp);

router.post('/resend-otp', resendOtpRequestBodyValidator, validateRequest, userController.resendOtp);

router.post('/password/forgot', forgotPasswordRequestBodyValidator, validateRequest, userController.forgotPassword);

router.post('/password/reset', resetPasswordRequestBodyValidator, validateRequest, userController.resetPassword);

router.get('/profile', checkCurrentUser, auth(ROLES_CONSTANTS.USER), userController.profile);

router.get('/logout', checkCurrentUser, auth(ROLES_CONSTANTS.USER), userController.logout);

export { router as userRoute };
