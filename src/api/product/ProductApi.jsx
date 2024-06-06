import axios from "axios";
import Cookies from "js-cookie";
import { addProductFields, updateProductField } from "../productField/ProductFieldApi.jsx";
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

const getProductsByStoreId = async (storeId) => {
    const url = `${API_BASE_URL}/product/store/${storeId}`;

    try {
        const response = await axios.get(url, { headers: getHeaders() });
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(`Error getting products with storeId: ${storeId}`);
        }
    } catch (error) {
        console.error("Error in getProductsByStoreId:", error);
    }
};

const getAllProducts = async () => {
    const url = `${API_BASE_URL}/product/allProduct`;

    try {
        const response = await axios.get(url, { headers: getHeaders() });
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Error getting all products");
        }
    } catch (error) {
        console.error("Error in getAllProducts:", error);
    }
};

const getProductsByCategoryId = async (categoryId) => {
    const url = `${API_BASE_URL}/product/category/${categoryId}`;

    try {
        const response = await axios.get(url, { headers: getHeaders() });
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(`Error getting products with categoryId: ${categoryId}`);
        }
    } catch (error) {
        console.error("Error in getProductsByCategoryId:", error);
    }
}

const getProductById = async (id) => {
    const url = `${API_BASE_URL}/product/getProductById/${id}`;

    try {
        const response = await axios.get(url, { headers: getHeaders() });
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(`Error getting product with id: ${id}`);
        }
    } catch (error) {
        console.error("Error in getProductById:", error);
    }
};

const addProduct = async (productDTO, file) => {
    let formData = formDataFiller(productDTO, file);
    formData.append("category", productDTO.category);
    formData.append("store", productDTO.store);
    const url = `${API_BASE_URL}/product/addProduct`;
    const config = {
        headers: getHeaders(true)
    };

    try {
        const response = await axios.post(url, formData, config);
        if (response.status === 201) {
            const id = response.data.id;
            const fields = await addProductFields(productDTO.productFields, id);
            if (fields.status === 201) {
                return {product : response.data, fields: fields.data};
            } else {
                if (checkResponseStatusCode(fields.status)) {
                    throw new Error("Error adding product fields");
                }
            }
        } else {
            if (checkResponseStatusCode(response.status)) {
                throw new Error("Unexpected response status while adding product");
            }
        }
    } catch (error) {
        console.error("Error in addProduct:", error);
    }
};


const updateProduct = async (id, productDTO, file) => {
    let formData = formDataFiller(productDTO, file);
    formData.append("category", productDTO.category.id);
    formData.append("store", productDTO.store.id);
    const url = `${API_BASE_URL}/product/updateProduct/${id}`;
    const config = {
        headers: getHeaders(true)
    };

    try {
        const response = await axios.put(url, formData, config);
        if (response.status === 200) {
            console.log("Product Fields", productDTO.productFields)
            const fields = await updateProductField(id, productDTO.productFields);
            if (fields.status === 201) {
                return {product : response.data, fields: fields.data};
            } else {
                if (checkResponseStatusCode(fields.status)) {
                    throw new Error("Error adding product fields");
                }
            }
        } else {
            throw new Error('Unexpected response status');
        }
    } catch (error) {
        console.error("Error updating the product:", error);
    }
};

const deleteProduct = async (id) => {
    const url = `${API_BASE_URL}/product/deleteProduct/${id}`;

    try {
        const response = await axios.delete(url, { headers: getHeaders() });
        if (response.status === 204) {
            console.log(`Product with ID: ${id} deleted successfully`);
        } else {
            throw new Error(`Error deleting product with id: ${id}`);
        }
    } catch (error) {
        console.error("Error in deleteProduct:", error);
    }
};

const formDataFiller = (productDTO, file) => {
    let formData = new FormData();
    formData.append("name", productDTO.name);
    formData.append("model", productDTO.model);
    formData.append("productCode", productDTO.productCode);
    formData.append("productFields", "");
    formData.append("transactions", "");
    formData.append('file', file);
    return formData;
};

export
{
    //get methods
    getProductsByStoreId,
    getAllProducts,
    getProductById,
    getProductsByCategoryId,
    //add methods
    addProduct,
    //update methods
    updateProduct,
    //delete methods
    deleteProduct,
};
