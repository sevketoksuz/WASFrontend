import { createContext, useState, useEffect } from 'react';

// Create the context
const GlobalStoreId = createContext();

const GlobalStoreIdProvider = ({ children }) => {
    const [globalStoreId, setGlobalStoreId] = useState(() => {
        // Retrieve the initial state from localStorage if it exists
        const savedValue = localStorage.getItem('globalStoreId');
        return savedValue !== null ? JSON.parse(savedValue) : null;
    });

    useEffect(() => {
        // Save the globalValue to localStorage whenever it changes
        localStorage.setItem('globalStoreId', JSON.stringify(globalStoreId));
    }, [globalStoreId]);

    return (
        <GlobalStoreId.Provider value={{ globalStoreId, setGlobalStoreId }}>
            {children}
        </GlobalStoreId.Provider>
    );
};

export { GlobalStoreId, GlobalStoreIdProvider };
