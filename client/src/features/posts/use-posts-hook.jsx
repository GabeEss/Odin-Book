import { useQuery } from 'react-query';
import { makeAuthenticatedRequest } from '../auth/make-authenticated-request';

async function fetchPosts(getAccessTokenSilently, id, guest, guestInit) {
  const response = await makeAuthenticatedRequest(
    getAccessTokenSilently,
    'get',
    `${import.meta.env.VITE_API_URL}/posts?id=${id}`,
    {id},
    guest,
    guestInit
  )
  return response.data;
}

export function usePosts(getAccessTokenSilently, id, guest, guestInit) {
  return useQuery(['posts', id], () => fetchPosts(getAccessTokenSilently, id, guest, guestInit));
}