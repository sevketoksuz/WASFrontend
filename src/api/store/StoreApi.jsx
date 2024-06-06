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

const getStoreById = async (id) => {
    const url = `${API_BASE_URL}/store/getStoreById/${id}`;
    return apiCall(
        url,
        { headers: getHeaders() },
        `Unexpected response status while getting store.`
    );
};

const getAllStores = async () => {
    const url = `${API_BASE_URL}/store/allStore`;
    return apiCall(
        url,
        { headers: getHeaders() },
        `Unexpected response status while getting all stores.`
    );
};

const getStoresByUserId = async (storeId) => {
    const url = `${API_BASE_URL}/store/${storeId}`;
    return apiCall(
        url,
        { headers: getHeaders() },
        `Unexpected response status while getting stores by store id.`
    );
};

const getStoresByCompanyId = async (companyId) => {
    const url = `${API_BASE_URL}/store/getStoreByCompanyId/${companyId}`;
    return apiCall(
        url,
        { headers: getHeaders() },
        `Unexpected response status while getting stores by company id.`
    );
}

const getTop3StoresByProfitForUser = async (userId) => {
    const url = `${API_BASE_URL}/store/top3StoresByProfit/${userId}`;
    return apiCall(
        url,
        { headers: getHeaders() },
        'Unexpected response status while getting top 3 most profitable Store.'
    );
};


const getTop5MostProfitableProducts = async (storeId, top = true) => {
    const url = `${API_BASE_URL}/store/${storeId}/top5MostProfitableProducts?top=${top}`;
    return apiCall(
        url,
        { headers: getHeaders() },
        'Unexpected response status while getting top 5 most profitable products.'
    );
};


//#endregion

//#region Add ApiCalls
const addStore = async (formData) => {
    const url = `${API_BASE_URL}/store/addStore`;

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
        console.error("Error adding the store:", error);
    }
};

//#endregion

//#region Update ApiCalls

const updateStore = async (id, storeDTO, file) => {
    const url = `${API_BASE_URL}/store/updateStore/${id}`;

    let formData = new FormData();
    formData.append('storeDTO', new Blob([JSON.stringify({
        ...storeDTO,
        id,
    })], {
        type: 'application/json'
    }));
    if (file) {
        formData.append('file', file);
    }

    try {
        const response = await axios.put(url, formData, {
            headers: getHeaders(true)
        });

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(`Unexpected response status while updating store: ${response.status}`);
        }
    } catch (error) {
        if (!checkResponseStatusCode(error.response.status)) {
            return;
        }
        console.error(`Could not update store with id ${id}`, error);
    }
};

//#endregion

//#region Delete ApiCalls

const deleteStore = async (id) => {
    const url = `${API_BASE_URL}/store/deleteStore/${id}`;

    try {
        const response = await axios.delete(url, {
            headers: getHeaders()
        });

        if (response.status === 204) {
            console.log(`Store with id ${id} deleted successfully`);
        } else {
            throw new Error(`Unexpected response status while deleting store: ${response.status}`);
        }
    } catch (error) {
        if (!checkResponseStatusCode(error.response.status)) {
            return;
        }
        console.error(`Could not delete store with id ${id}`, error);
    }
};

//#endregion

export {
    //get methods
    getStoreById,
    getAllStores,
    getStoresByUserId,
    getStoresByCompanyId,
    getTop5MostProfitableProducts,
    getTop3StoresByProfitForUser,
    //add methods
    addStore,
    //update methods
    updateStore,
    //delete methods
    deleteStore,
};
