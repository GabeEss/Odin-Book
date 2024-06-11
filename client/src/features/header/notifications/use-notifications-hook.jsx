import { useQuery } from 'react-query';
import { makeAuthenticatedRequest } from '../../auth/make-authenticated-request';

async function fetchNotifications(getAccessTokenSilently, guest, guestInit) {
  const response = await makeAuthenticatedRequest(
    getAccessTokenSilently,
    'put',
    `${import.meta.env.VITE_API_URL}/notifications`,
    {},
    guest,
    guestInit
  )
  return response.data;
}

export function useNotifications(getAccessTokenSilently, guest, guestInit) {
  return useQuery(['notifications'], () => fetchNotifications(getAccessTokenSilently, guest, guestInit));
}