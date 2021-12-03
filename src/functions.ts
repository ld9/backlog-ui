import { BASE_API_URL } from "./variables";

export async function checkTokenStillActive() {
    const ute = localStorage.getItem("user-token-expires");
    const token = localStorage.getItem("user-token");
    
    if (ute) {
        if (new Date(ute) < new Date()) {
            // The token is expired
            localStorage.removeItem("user-token-expires");
            localStorage.removeItem("user-token");

            return false;
        } else {
            // it's not
            return token;
        }
    } else {
        return false;
    }
}