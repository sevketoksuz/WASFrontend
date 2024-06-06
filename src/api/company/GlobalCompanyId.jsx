import { createContext, useState, useEffect } from 'react';

// Create the context
const GlobalCompanyId = createContext();

const GlobalCompanyIdProvider = ({ children }) => {
    const [globalCompanyId, setGlobalCompanyId] = useState(() => {
        // Retrieve the initial state from localStorage if it exists
        const savedValue = localStorage.getItem('globalCompanyId');
        return savedValue !== null ? JSON.parse(savedValue) : null;
    });

    useEffect(() => {
        // Save the globalValue to localStorage whenever it changes
        localStorage.setItem('globalCompanyId', JSON.stringify(globalCompanyId));
    }, [globalCompanyId]);

    return (
        <GlobalCompanyId.Provider value={{ globalCompanyId, setGlobalCompanyId }}>
            {children}
        </GlobalCompanyId.Provider>
    );
};

export { GlobalCompanyId, GlobalCompanyIdProvider };
