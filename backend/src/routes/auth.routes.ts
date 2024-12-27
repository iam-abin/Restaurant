import express, { Router } from 'express';
import { authController } from '../controllers';
import {
    resendOtpRequestBodyValidator,
    signinRequestBodyValidator,
    signupRequestBodyValidator,
    verifyOtpRequestBodyValidator,
    forgotPasswordRequestBodyValidator,
    resetPasswordRequestBodyValidator,
    verifyTokenRequestBodyValidator,
    mongoIdParamsValidator,
    googleAuthRequestBodyValidator,
} from '../utils';
import { validateRequest } from '../middlewares';

const router: Router = express.Router();

router.post('/signin', signinRequestBodyValidator, validateRequest, authController.signin);

router.post('/refresh', authController.refresh);

router.post('/signup', signupRequestBodyValidator, validateRequest, authController.signup);

router.post('/google', googleAuthRequestBodyValidator, validateRequest, authController.googleAuth);

router.post('/verify/otp', verifyOtpRequestBodyValidator, validateRequest, authController.verifyOtp);

router.post('/resend-otp', resendOtpRequestBodyValidator, validateRequest, authController.resendOtp);

router.post(
    '/password/forgot',
    forgotPasswordRequestBodyValidator,
    validateRequest,
    authController.forgotPassword,
);

router.post(
    '/verify/reset-token',
    verifyTokenRequestBodyValidator,
    validateRequest,
    authController.verifyResetToken,
);

router.post(
    '/password/reset',
    resetPasswordRequestBodyValidator,
    validateRequest,
    authController.resetPassword,
);

router.patch(
    '/block-unblock/:userId',
    mongoIdParamsValidator('userId'),
    validateRequest,
    authController.blockUnblockUser,
);

router.post('/logout', authController.logout);

export { router as authRoutes };
