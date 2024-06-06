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

const getAllCompanies = async () => {
    const url = `${API_BASE_URL}/company/getall`;
    return apiCall(
        url,
        { headers: getHeaders() },
        `Unexpected response status while getting companies.`
    );

}

const getCompanyById = async (id) => {
    const url = `${API_BASE_URL}/company/getById/${id}`;
    return apiCall(
        url,
        { headers: getHeaders() },
        `Unexpected response status while getting company.`
    );

}

const addCompany = async (company, file) => {
    const url = `${API_BASE_URL}/company/addCompany`;
    let formData = new FormData();
    formData.append('name', company.name);
    formData.append('description', company.description);
    formData.append('taxLevel', company.taxLevel);
    formData.append('userId', company.userId);
    if(file){
        formData.append('file', file);
    }
    try {
        const response = await axios.post(url, formData, {
            headers: getHeaders(true)
        });

        if (response.status === 201) {
            return response.data;
        } else {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
    } catch (error) {
        if (!checkResponseStatusCode(error.response.status)) {
            return;
        }
        console.error("Error adding the company:", error);
    }

}

const updateCompany = async (company, file) => {
    let formData = new FormData();
    formData.append('id', company.id);
    formData.append('name', company.name);
    formData.append('description', company.description);
    formData.append('taxLevel', company.taxLevel);
    formData.append('user.id', company.user.id);

    if (file) {
        formData.append('file', file);
    }

    const url = `${API_BASE_URL}/company/update/${company.id}`;

    const config = {
        headers: {
            ...getHeaders(true),
            'Content-Type': 'multipart/form-data'
        }
    };

    try {
        const response = await axios.put(url, formData, config);
        checkResponseStatusCode(response.status);
        return response.data;
    } catch (error) {
        if (!checkResponseStatusCode(error.response.status)) {
            return;
        }
        console.error("Error updating the company:", error);
        throw error;
    }
};

export {
    getCompanyById,
    getAllCompanies,
    addCompany,
    updateCompany
}