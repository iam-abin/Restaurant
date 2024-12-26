import axios from 'axios';
import { DecodedGoogleToken } from '../types';
import { GOOGLE_TOKEN_INFO_URL } from './constants';
import makeApiCall from './apiCall';

export const verifyGoogleCredentialToken = async (credentialToken: string): Promise<DecodedGoogleToken> => {
    const response = await makeApiCall({ method: 'get', url: `${GOOGLE_TOKEN_INFO_URL}${credentialToken}` });
    const { sub, name, email, picture, iat, exp, email_verified } = response;
    return {
        sub,
        name,
        email,
        picture,
        iat,
        exp,
        email_verified,
    };
};
