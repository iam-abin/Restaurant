import Stripe from 'stripe';
import { appConfig } from './app.config';

export const stripeInstance = new Stripe(appConfig.STRIPE_SECRET_KEY);
