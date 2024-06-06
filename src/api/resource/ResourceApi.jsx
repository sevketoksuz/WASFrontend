import Cookies from "js-cookie";
import axios from "axios";
import {getLanguage, translate} from '../../language';
const API_BASE_URL = "http://13.50.13.151";

const lang = getLanguage();
//#region Fun

const checkResponseStatusCode = (status) => {
    if (status === 403) {
        alert(translate(lang, 'sessionExpired'));
        Cookies.remove('user_token');
        window.location.href = `http://localhost:5173/login`;
        return false;
    }
    return true;
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

//#endregion


const getResource = async (id) => {
    const url = `${API_BASE_URL}/resourceFile/image/${id}`;
    return apiCall(
        url,
        { headers: getHeaders(), responseType: "blob" },
        "Error getting photo:"
    );
};

const getUserPhoto = async  (id) => {
    const url = `${API_BASE_URL}/user/downloadResourceFile/${id}`;
    return apiCall(
        url,
        {headers: getHeaders(), responseType:"blob"},
        "Error getting photo:"
    )
}

export {
    getResource,
    getUserPhoto
}