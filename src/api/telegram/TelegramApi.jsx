import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = "http://13.50.13.151";

const getHeaders = () => {
    const token = Cookies.get('user_token');
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
};

const apiCall = async (url, config, errorHandler) => {
    try {
        return await axios.get(url, config);
    } catch (error) {
        console.error(errorHandler, error);
        throw error;
    }
};

const getTelegramLink = async (userId) => {
    const url = `${API_BASE_URL}/api/telegram/linkUser/${userId}`;
    return apiCall(
        url,
        { headers: getHeaders() },
        "Error getting Telegram link:"
    );
};

export {
    getTelegramLink
};
