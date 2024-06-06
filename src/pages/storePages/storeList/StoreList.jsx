import React, { useContext, useEffect, useState } from 'react';
import { getStoresByCompanyId } from "../../../api/store/StoreApi.jsx";
import { decodeUserToken } from "../../../api/authentication/AuthenticationApi.jsx";
import { GlobalStoreId } from "../../../api/store/GlobalStoreId.jsx";
import { GlobalCompanyId } from "../../../api/company/GlobalCompanyId.jsx";
import { useNavigate } from "react-router-dom";
import { getLanguage, translate } from '../../../language';

function StoreList() {
    const [stores, setStores] = useState([]);
    const { setGlobalStoreId, globalStoreId } = useContext(GlobalStoreId);
    const { globalCompanyId } = useContext(GlobalCompanyId);
    const navigate = useNavigate();
    const lang = getLanguage();

    useEffect(() => {
        const fetchStores = async () => {
            const decodedToken = decodeUserToken();
            if (decodedToken) {
                try {
                    if (decodedToken.roles[0] === "ADMIN") {
                        const response = await getStoresByCompanyId(globalCompanyId.id);
                        const storesWithBase64 = await Promise.all(
                            response.data.map(async (store) => {
                                if (store.resourceFile && store.resourceFile.data) {
                                    const binaryData = new Uint8Array(atob(store.resourceFile.data).split("").map(char => char.charCodeAt(0)));
                                    const blob = new Blob([binaryData], { type: 'application/octet-stream' });
                                    const base64String = await convertToBase64(blob);
                                    return {
                                        ...store,
                                        base64String,
                                    };
                                }
                                return store;
                            })
                        );
                        setStores(storesWithBase64);
                    }
                    else {
                        const response = await getStoresByCompanyId(decodedToken.companyId);
                        const storesWithBase64 = await Promise.all(
                            response.data.map(async (store) => {
                                if (store.resourceFile && store.resourceFile.data) {
                                    const binaryData = new Uint8Array(atob(store.resourceFile.data).split("").map(char => char.charCodeAt(0)));
                                    const blob = new Blob([binaryData], { type: 'application/octet-stream' });
                                    const base64String = await convertToBase64(blob);
                                    return {
                                        ...store,
                                        base64String,
                                    };
                                }
                                return store;
                            })
                        );
                        setStores(storesWithBase64);
                    }

                } catch (error) {
                    console.error("Failed to get stores.", error);
                }
            }
        };

        fetchStores();
    }, []);

    const convertToBase64 = (data) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(data);
            reader.onloadend = () => {
                const base64data = reader.result;
                resolve(base64data);
            };
            reader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const handleSelectStore = (storeId) => {
        setGlobalStoreId(storeId);
        navigate('/store');
    };

    return (
        <div className="max-w-6xl mx-auto p-5">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">{translate(lang, 'allStores')}</h1>
            {Array.isArray(stores) && stores.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-center">
                    {stores.map((store) => (
                        <div key={store.id}
                             className={`p-6 shadow-lg rounded-lg flex flex-col items-center transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl border-2 m-2 ${globalStoreId === store.id ? 'bg-green-50 border-green-700': 'bg-white'}`}>
                            <h2 className="text-xl font-semibold mb-2">{store.name}</h2>
                            <div className="h-32 w-32 mb-3 overflow-hidden rounded-full border-8 border-gray-200">
                                {store.base64String ? (
                                    <img
                                        src={store.base64String}
                                        className="object-cover w-full h-full"
                                        alt={`${store.resourceFile.name}`}
                                        onError={(e) => { e.target.src = 'src/assets/store.png'; }}
                                    />
                                ) : (
                                    <img
                                        src="src/assets/store.png"
                                        className="object-cover w-full h-full"
                                        alt="Default"
                                    />
                                )}
                            </div>
                            <p className="text-gray-600 text-sm mb-4">{store.description}</p>
                            <button
                                onClick={() => handleSelectStore(store.id)}
                                className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-900 transition-colors">
                                {translate(lang, 'select')}
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center text-gray-500">
                    <p>{translate(lang, 'noStoresFound')}</p>
                    <button
                        onClick={() => navigate('/add-store')}
                        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-gray-900 transition-colors mt-4">
                        {translate(lang, 'newStore')}
                    </button>
                </div>
            )}
        </div>
    );
}

export default StoreList;
