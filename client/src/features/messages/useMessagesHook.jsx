import { useQuery } from 'react-query';
import { makeAuthenticatedRequest } from '../auth/make-authenticated-request';

async function fetchMessages(getAccessTokenSilently, id, guest, guestInit) {
  const response = await makeAuthenticatedRequest(
    getAccessTokenSilently,
    'get',
    `${import.meta.env.VITE_API_URL}/messages?id=${id}`,
    {id},
    guest,
    guestInit
  )
  return response.data;
}

export function useMessages(getAccessTokenSilently, id, guest, guestInit) {
  return useQuery(['messages', id], () => fetchMessages(getAccessTokenSilently, id, guest, guestInit));
}