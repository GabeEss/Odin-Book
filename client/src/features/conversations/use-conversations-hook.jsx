import { useQuery } from 'react-query';
import { makeAuthenticatedRequest } from '../auth/make-authenticated-request';

async function fetchConversations(getAccessTokenSilently, guest, guestInit) {
    const response = await makeAuthenticatedRequest(
        getAccessTokenSilently,
        'get',
        `${import.meta.env.VITE_API_URL}/conversations`,
        {},
        guest,
        guestInit,
    )
    return response.data;
}

export function useConversations(getAccessTokenSilently, guest, guestInit) {
    return useQuery(['conversations'], () => fetchConversations(getAccessTokenSilently, guest, guestInit));
}