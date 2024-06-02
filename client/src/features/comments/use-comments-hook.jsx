import { useQuery } from 'react-query';
import { makeAuthenticatedRequest } from '../auth/make-authenticated-request';

async function fetchComments(getAccessTokenSilently, postId, guest, guestInit) {
  const response = await makeAuthenticatedRequest(
    getAccessTokenSilently,
    'get',
    `${import.meta.env.VITE_API_URL}/post/${postId}/comments`,
    {postId},
    guest,
    guestInit
  )
  return response.data;
}

export function useComments(getAccessTokenSilently, postId, guest, guestInit) {
  return useQuery(['comments', postId], () => fetchComments(getAccessTokenSilently, postId, guest, guestInit));
}