import { useContext, useEffect, useState } from 'react';
import { GlobalStoreId } from '../../../api/store/GlobalStoreId';
import { decodeUserToken } from "../../../api/authentication/AuthenticationApi";
import ProfitChart from './ProfitChart';
import Top5Products from './Top5Products';
import Top5Category from './Top5Category';
import { getLanguage, translate } from '../../../language';

const StoreDashboard = () => {
    const [storeId, setStoreId] = useState(null);
    const { globalStoreId } = useContext(GlobalStoreId);

    useEffect(() => {
        const fetchStoreId = () => {
            if (globalStoreId !== null) {
                setStoreId(globalStoreId);
            } else {
                const userToken = decodeUserToken();
                if (userToken && userToken.storeId) {
                    setStoreId(parseInt(userToken.storeId, 10));
                } else {
                    console.error("Error: Store ID is not available in token or context.");
                }
            }
        };

        fetchStoreId();
    }, [globalStoreId]);

    if (storeId === null) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6 text-center">
                    {translate(getLanguage(), 'storeDashboard')}
                </h1>
                <div className="text-center text-red-500">
                    {translate(getLanguage(), 'storeDashboardError')}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">
                {translate(getLanguage(), 'storeDashboard')}
            </h1>
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="md:w-1/2 p-2 flex-1">
                    <Top5Products storeId={storeId} top={true} />
                </div>
                <div className="md:w-1/2 p-2 flex-1">
                    <Top5Products storeId={storeId} top={false} />
                </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="md:w-1/2 p-2 flex-1">
                    <Top5Category storeId={storeId} />
                </div>
                <div className="md:w-1/2 p-2 flex-1">
                    <ProfitChart storeId={storeId} />
                </div>
            </div>
        </div>
    );
};

export default StoreDashboard;
