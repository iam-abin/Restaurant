import crypto from 'crypto';

export const createToken = () => {
    const token = crypto.randomBytes(40).toString('hex');
    console.log('crypto token ', token);
    return token;
};
