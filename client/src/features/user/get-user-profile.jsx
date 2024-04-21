import { makeAuthenticatedRequest } from '../auth/make-authenticated-request';

async function getUserProfile(userId, getAccessTokenSilently, guest, guestInit) {
    try {
        let endpoint = `${import.meta.env.VITE_API_URL}/user`;

        // Differentiate between the current user's profile and another user's profile via params
        if (userId) {
            endpoint += `s/${userId}`;
        }
        const response = await makeAuthenticatedRequest(
            getAccessTokenSilently,
            'get',
            endpoint,
            {},
            guest,
            guestInit
        )
        if(response.data.success) {
            return response.data;
        } else {
            throw new Error('Failed to retrieve user info');
        }
    } catch (error) {
        console.error('error', error);
        return 'Failed to retrieve user info, please contact support';
    }
}

export default getUserProfile;