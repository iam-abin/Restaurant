import express, { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import {
    resendOtpRequestBodyValidator,
    signinRequestBodyValidator,
    signupRequestBodyValidator,
    verifyOtpRequestBodyValidator,
    forgotPasswordRequestBodyValidator,
    resetPasswordRequestBodyValidator,
    ROLES_CONSTANTS,
} from '../utils';
import { checkCurrentUser, auth, validateRequest } from '../middlewares';

const router: Router = express.Router();

router.post('/signin', signinRequestBodyValidator, validateRequest, authController.signin);

router.post('/signup', signupRequestBodyValidator, validateRequest, authController.signup);

router.post('/verify-otp', verifyOtpRequestBodyValidator, validateRequest, authController.verifyOtp);

router.post('/resend-otp', resendOtpRequestBodyValidator, validateRequest, authController.resendOtp);

router.post(
    '/password/forgot',
    forgotPasswordRequestBodyValidator,
    validateRequest,
    authController.forgotPassword,
);

router.post(
    '/password/reset',
    resetPasswordRequestBodyValidator,
    validateRequest,
    authController.resetPassword,
);

router.post('/logout', checkCurrentUser, auth(ROLES_CONSTANTS.USER), authController.logout);

export { router as authRoutes };
