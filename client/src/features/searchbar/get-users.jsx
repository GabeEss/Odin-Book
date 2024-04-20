import { makeAuthenticatedRequest } from '../auth/make-authenticated-request';

async function getUsers(search, getAccessTokenSilently, guest, guestInit) {
    try {
        const response = await makeAuthenticatedRequest(
            getAccessTokenSilently,
            'get',
            `${import.meta.env.VITE_API_URL}/users?search=${search}`,
            {},
            guest,
            guestInit
        )
        if(response.data.success) {
            return response.data.users;
        } else {
            console.log('Failed to get users');
            return [];
        }
    } catch (error) {
        console.error('error', error);
    }
}

export default getUsers;