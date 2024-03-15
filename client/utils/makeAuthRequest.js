import axios from "axios";

export async function makeAuthenticatedRequest(getAccessTokenSilently, method, url, data = {}) {

    const token = await getAccessTokenSilently({
        scope: "update:current_user_metadata update:users update:users_app_metadata"
    });

    const response = await axios({
        method,
        url,
        data,
        headers: {
            authorization: `Bearer ${token}`,
        }
    });

    return response;
}