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

    console.log()
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

const fillFormData = (transactionDTO, file) => {
    let formData = new FormData();
    formData.append('date', transactionDTO.date);
    formData.append('quantity', transactionDTO.quantity);
    formData.append('price', transactionDTO.price);
    formData.append('fullName', transactionDTO.fullName);
    formData.append('address', transactionDTO.address);
    formData.append('phone', transactionDTO.phone);
    formData.append('isBuying', transactionDTO.isBuying);

    if (file) {
        formData.append('file', file);
    }
    return formData;
}

const getTransactionById = async (id) => {
    const url = `${API_BASE_URL}/transaction/getTransactionById/${id}`;

    try {
        const response = await axios.get(url, {
            headers: getHeaders()
        });

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(`Unexpected response status while getting transaction by id: ${response.status}`);
        }
    } catch (error) {
        console.error(`Could not fetch transaction for transaction id ${id}`, error);
    }
};

const getAllTransactions = async () => {
    const url = `${API_BASE_URL}/transaction/allTransaction`;
    return apiCall(url, { headers : getHeaders() }, "Could not fetch all transactions");
};

const getTransactionsByProductId = async (productId) => {
    const url = `${API_BASE_URL}/transaction/product/${productId}`;


    try {
        const response = await axios.get(url, {
            headers: getHeaders()
        });

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(`Unexpected response status while getting transactions by product id: ${response.status}`);
        }
    } catch (error) {
        console.error(`Could not fetch transactions for product id ${productId}`, error);
    }
};

const getDailyTotalTransactions = async (storeId) => {
    const url = `${API_BASE_URL}/transaction/daily-totals/${storeId}`;

    try {
        const response = await axios.get(url, {
            headers: getHeaders()
        });

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(`Unexpected response status while getting daily total transactions: ${response.status}`);
        }
    } catch (error) {
        console.error('Could not fetch daily total transactions', error);
    }
}

const addTransaction = async (transactionDTO, file) => {
    const url = `${API_BASE_URL}/transaction/addTransaction`;

    let formData = fillFormData(transactionDTO, file);
    formData.append('product', transactionDTO.product);
    try {
        const response = await axios.post(url, formData, {
            headers: getHeaders(true)
        });

        if (response.status === 201) {
            console.log('Transaction added successfully');
            return response.data;
        } else {
            throw new Error(`Unexpected response status while adding transaction: ${response.status}`);
        }
    } catch (error) {
        console.error('Could not add transaction', error);
    }
};

const updateTransaction = async (id, transactionDTO, file) => {
    const url = `${API_BASE_URL}/transaction/updateTransaction/${id}`;

    let formData = fillFormData(transactionDTO, file);
    formData.append('product', transactionDTO.product.id);
    try {
        const response = await axios.put(url, formData, {
            headers: getHeaders(true)
        });

        if (response.status === 200) {
            console.log('Transaction updated successfully');
            return response.data;
        } else {
            throw new Error(`Unexpected response status while updating transaction: ${response.status}`);
        }
    } catch (error) {
        console.error('Could not update transaction', error);
    }
};

const deleteTransaction = async (id) => {
    const url = `${API_BASE_URL}/transaction/deleteTransaction/${id}`;

    try {
        const response = await axios.delete(url, {
            headers: getHeaders()
        });

        if (response.status === 204) {
            console.log('Transaction deleted successfully');
        } else {
            throw new Error(`Unexpected response status while deleting transaction: ${response.status}`);
        }
    } catch (error) {
        console.error('Could not delete transaction', error);
    }
};

export {
    getTransactionById,
    getAllTransactions,
    getTransactionsByProductId,
    getDailyTotalTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
};
