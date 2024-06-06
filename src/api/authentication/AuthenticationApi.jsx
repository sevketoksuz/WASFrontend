import axios from 'axios';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';

const API_BASE_URL = "http://13.50.13.151";

const login = async (username, password) => {
    console.log(username, password)
    const url = `${API_BASE_URL}/account/login`;
    const body = {
        username: username,
        password: password
    };

    try {
        const response = await axios.post(url, body);
        const token = response.data;
        Cookies.set('user_token', token, { expires: 1/24 });
        return token;
    } catch (error) {
        if (error.response) {
            console.error('Error status:', error.response.status);
            console.error('Error data:', error.response.data);
            throw new Error(error.response.data || 'Unknown error occurred');
        } else if (error.request) {
            console.error('No response:', error.request);
            throw new Error('No response received from server');
        } else {
            console.error('Error message:', error.message);
            throw new Error('Error setting up login request');
        }
    }
}

const decodeUserToken = () => {
    const token = Cookies.get('user_token');

    if(!token) {
        return null;
    }

    try {
        const decodedToken = jwtDecode(token);
       
        return {
            username: decodedToken.sub,
            roles: decodedToken.roles,
            userId: decodedToken.userId,
            storeId: decodedToken.storeId,
            companyId: decodedToken.companyId
        };
    } catch(e) {
        console.error('Error while decoding token:', e);
        return null;
    }
}


const logout = () => {
    Cookies.remove('user_token');
    window.location.href = "http://localhost:5173/login";
}

export {
    login,
    logout,
    decodeUserToken
};