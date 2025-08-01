import { makeAuthenticatedRequest } from "../../auth/make-authenticated-request";

export const handleGetUser = async (getAccessTokenSilently, guest, guestInit, setCurrentUser) => {
    try {
        const response = await makeAuthenticatedRequest(
            getAccessTokenSilently,
            'get',
            `${import.meta.env.VITE_API_URL}/current-user`,
            {},
            guest,
            guestInit
        )
        if(response.data.success) {
            setCurrentUser(response.data.currentUser);
        } else {
            setCurrentUser("");
            console.log(response.data.message);
        }
    } catch (error) {
        console.error('error', error);
    }
}