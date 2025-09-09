import { makeAuthenticatedRequest } from '../auth/make-authenticated-request';

export const guestLogin = async ({ guest, getAccessTokenSilently, isAuthenticated }) => {
    if(!isAuthenticated) {
        try {
            const response = await makeAuthenticatedRequest(
                getAccessTokenSilently,
                'post',
                `${import.meta.env.VITE_API_URL}/user/guest/register`,
                {},
                guest,
                true
            );
            return response;
        } catch(error) {
            console.error('error', error);
            throw error;
        }
    }
}