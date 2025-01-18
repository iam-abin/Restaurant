import { DecodedGoogleToken } from '../types';
import makeApiCall from './apiCall';
import { GOOGLE_TOKEN_INFO_URL } from '../constants';

/**
 * Verifies the Google Credential Token by making an API call to retrieve token information.
 *
 * @param {string} credentialToken - The credential token received from Google for verification.
 * @returns {Promise<DecodedGoogleToken>} - The decoded token information including sub, name, email, etc.
 */
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
