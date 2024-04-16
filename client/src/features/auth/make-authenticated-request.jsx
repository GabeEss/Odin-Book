import axios from "axios";

export async function makeAuthenticatedRequest(getAccessTokenSilently, method, url, data = {}, guestId, guestInit) {

    const headers = {
        'X-Guest': guestId,
    };

    // Does this request require an access token? If a guest user is initialized, then no.
    if(!guestInit) {
        const token = await getAccessTokenSilently();
        headers.authorization = `Bearer ${token}`;

        const response = await axios({
            method,
            url,
            data,
            headers,
        });

        return response
    } else {
        const response = await axios({
            method,
            url,
            data,
            headers,
        });

        return response
    }
}