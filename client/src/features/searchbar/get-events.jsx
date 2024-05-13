import { makeAuthenticatedRequest } from '../auth/make-authenticated-request';

async function getEvents(search, getAccessTokenSilently, guest, guestInit) {
    try {
        const response = await makeAuthenticatedRequest(
            getAccessTokenSilently,
            'get',
            `${import.meta.env.VITE_API_URL}/events?search=${search}`,
            {},
            guest,
            guestInit
        )
        if(response.data.success) {
            return response.data.events;
        } else {
            console.log('Failed to get events');
            console.log(response.data.message);
            return [];
        }
    } catch (error) {
        console.error('error', error);
    }
}

export default getEvents;