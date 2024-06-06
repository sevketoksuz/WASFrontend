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

//#region Get ApiCalls

const getProductFieldById = async (id) => {
    const url = `${API_BASE_URL}/productField/${id}`;

    try {
        const response = await axios.get(url, { headers: getHeaders() });
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(`Error getting product field with id: ${id}`);
        }
    } catch (error) {
        console.error("Error in getProductFieldById:", error);
    }
};

const getAllProductFields = async () => {
    const url = `${API_BASE_URL}/productField/getAllProductField`;

    try {
        const response = await axios.get(url, { headers: getHeaders() });
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Error getting all product fields");
        }
    } catch (error) {
        console.error("Error in getAllProductFields:", error);
    }
};

const getProductFieldsByProductId = async (productId) => {
    const url = `${API_BASE_URL}/productField/product/${productId}`;

    try {
        const response = await axios.get(url, {
            headers: getHeaders()
        });

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(`Unexpected response status while getting product fields: ${response.status}`);
        }
    } catch (error) {
        console.error(`Could not fetch product fields for product id ${productId}`, error);
    }
};

const addProductField = async (productFieldDTO) => {
    const url = `${API_BASE_URL}/productField/addProductField`;

    try {
        const response = await axios.post(url, productFieldDTO, {
            headers: getHeaders()
        });

        if (response.status === 201) {
            return response.data;
        } else {
            throw new Error(`Unexpected response status while adding product field: ${response.status}`);
        }
    } catch (error) {
        console.error("Could not add product field", error);
    }
};
const addProductFields = async (productFieldDTO, productID) => {
    const url = `${API_BASE_URL}/productField/addProductFields/${productID}`;

    try {
        const response = await axios.post(url, productFieldDTO, {
            headers: getHeaders()
        });

        if (response.status === 201) {
            return {data : response.data, status : response.status};
        } else {
            throw new Error(`Unexpected response status while adding product field: ${response.status}`);
        }
    } catch (error) {
        console.error("Could not add product field", error);
    }
};

const updateProductField = async (id, productFieldDTO) => {
    const url = `${API_BASE_URL}/productField/updateProductField/${id}`;

    try {
        const response = await axios.put(url, productFieldDTO, {
            headers: getHeaders()
        });

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(`Unexpected response status while updating product field: ${response.status}`);
        }
    } catch (error) {
        console.error(`Could not update product field with id ${id}`, error);
    }
};


const deleteProductField = async (id) => {
    const url = `${API_BASE_URL}/productField/deleteProductField/${id}`;

    try {
        const response = await axios.delete(url, {
            headers: getHeaders()
        });

        if (response.status === 204) {
            console.log(`Product field with id ${id} has been deleted successfully.`);
        } else {
            throw new Error(`Unexpected response status while deleting product field: ${response.status}`);
        }
    } catch (error) {
        console.error(`Could not delete product field with id ${id}`, error);
    }
};

export {
    //get methods
    getProductFieldById,
    getProductFieldsByProductId,
    getAllProductFields,
    //add methods
    addProductField,
    addProductFields,
    //update methods
    updateProductField,
    //delete methods
    deleteProductField,
};
