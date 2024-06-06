import axios from "axios";
import Cookies from "js-cookie";
import {getLanguage, translate} from '../../language';
const API_BASE_URL = "http://13.50.13.151";

const lang = getLanguage();

const checkResponseStatusCode = (status) => {
    if (status === 403) {
        alert(translate(lang, 'sessionExpired'));
        Cookies.remove('user_token');
        window.location.href = `http://localhost:5173/login`;
        return false;
    }
    return true;
};

//#region Get ApiCalls
const getHeaders = (isMultipart = false) => {
    const token = Cookies.get('user_token');

    if (isMultipart) {
        return {
            'Content-Type': 'multipart/form-data',
            "Authorization": `Bearer ${token}`
        };
    }
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
};

const apiCall = async (url, config, errorHandler) => {
    try {
        return await axios.get(url, config);
    } catch (error) {
        if (!checkResponseStatusCode(error.response.status)) {
            return;
        }
        console.error(errorHandler, error);
    }
};

const getTop3NotifiticationsByUserId = async (userId) => {
    const url = `${API_BASE_URL}/notification/user/${userId}/top3`;
    return apiCall(
        url,
        { headers: getHeaders() },
        "Error getting top 3 notifications:"
    );
}

const markNotificationIsSeen = async (notificationId) => {
    const url = `${API_BASE_URL}/notification/markNotification/${notificationId}`;
    try {
        return await axios.put(url, {},{ headers: getHeaders() });
    } catch (error) {
        if (!checkResponseStatusCode(error.response.status)) {
            return;
        }
        console.error("Error while marking notification", error);
    }
}

const getNotificationsByUserId = async (userId) => {
    const url = `${API_BASE_URL}/notification/user/${userId}`;
    return apiCall(
        url,
        { headers: getHeaders() },
        "Error getting notifications by user ID:"
    );
};

export {
    getTop3NotifiticationsByUserId,
    markNotificationIsSeen,
    getNotificationsByUserId
};
