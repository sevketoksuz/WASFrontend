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

const getAllCategories = async () => {
    const url = `${API_BASE_URL}/category/getall`

    return apiCall(
        url,
        {headers: getHeaders()},
        `Unexpected response status while getting categories.`
    )
}

const getCategoriesSummary = async (storeId) => {
    const url = `${API_BASE_URL}/category/getall/summaries/${storeId}`;
    console.log(storeId)
    return apiCall(
        url,
        { headers: getHeaders() },
        'Unexpected response status while getting categories summary.'
    );

}

const getCategoriesByStoreId = async (storeId) => {
    const url = `${API_BASE_URL}/category/store/${storeId}/categories`
     
    return apiCall(
        url,
        { headers: getHeaders() },
        `Unexpected response status while getting categories by store id.`
    );
}
const getTop5MostProfitableCategory = async (storeId) => {
    const url = `${API_BASE_URL}/category/top5CategoriesByProfit/${storeId}`;
    return apiCall(
        url,
        { headers: getHeaders() },
        'Unexpected response status while getting top 5 most profitable categories.'
    );
};
const getCategoryById = async (categoryId) => {
    const url = `${API_BASE_URL}/category/${categoryId}`;
    return apiCall(
        url,
        { headers: getHeaders() },
        'Unexpected response status while getting category by id.'
    );
};
const addCategory = async (category) => {
    const url = `${API_BASE_URL}/category/add`;
    
    try {
        const response = await axios.post(url, category, { headers: getHeaders() });
        if (response.status === 201) {
            return response.data;
        } else {
            throw new Error("Error adding category");
        }
    } catch (error) {
        console.error("Error in addCategory:", error);
        throw error;  // Ensure error is thrown to be caught in handleAddCategory
    }
};

export {
    getAllCategories,
    getCategoriesSummary,
    getCategoriesByStoreId,
    getTop5MostProfitableCategory,
    getCategoryById,
    addCategory
}