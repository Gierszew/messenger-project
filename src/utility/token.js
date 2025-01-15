import {jwtDecode} from 'jwt-decode';

export async function getToken() {
    const token = sessionStorage.getItem("authToken");
    let decodedToken;
    if (token) {
        try {
            decodedToken = jwtDecode(token);
        } catch (e) {
            console.error("Błąd dekodowania tokenu", e);
        }
    } else {
        decodedToken = null
    }
    return decodedToken;
}

export async function authUser() {
    try {
        const token = sessionStorage.getItem("authToken");
        const decodedToken = await jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken && decodedToken.exp > currentTime) {
            return true;
        } else {
            sessionStorage.removeItem("authToken");
            return false;
        }
    } catch (e) {
        sessionStorage.removeItem("authToken");
        return false;
    }
}