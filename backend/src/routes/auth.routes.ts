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
    verifyTokenRequestBodyValidator,
    paramsIdValidator,
} from '../utils';
import { checkCurrentUser, auth, validateRequest } from '../middlewares';

const router: Router = express.Router();

router.post('/signin', signinRequestBodyValidator, validateRequest, authController.signin);

router.post('/signup', signupRequestBodyValidator, validateRequest, authController.signup);

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
    paramsIdValidator('userId'),
    validateRequest,
    authController.blockUnblockUser,
);

router.post(
    '/logout',
    checkCurrentUser,
    auth([ROLES_CONSTANTS.USER, ROLES_CONSTANTS.RESTAURANT, ROLES_CONSTANTS.ADMIN]),
    authController.logout,
);

export { router as authRoutes };
