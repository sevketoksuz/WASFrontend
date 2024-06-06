import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { getTop3StoresByProfitForUser } from '../../../api/store/StoreApi';
import { decodeUserToken } from "../../../api/authentication/AuthenticationApi";
import { getLanguage, translate } from '../../../language';

const COLORS = [
    'rgba(75, 192, 192, 0.6)',
    'rgba(255, 159, 64, 0.6)',
    'rgba(153, 102, 255, 0.6)',
];

const BORDER_COLORS = [
    'rgba(75, 192, 192, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(153, 102, 255, 1)',
];

const Top3Store = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const companyId = decodeUserToken().companyId;

    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                const response = await getTop3StoresByProfitForUser(companyId);
                setStores(response.data);
                setLoading(false);
            } catch (error) {
                setError(`Error fetching top 3 stores: ${error.message}`);
                setLoading(false);
            }
        };

        fetchStoreData();
    }, [companyId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const data = {
        labels: stores.map(store => store.name),
        datasets: [
            {
                label: 'Total Profit',
                data: stores.map(store => store.totalProfit),
                backgroundColor: COLORS,
                borderColor: BORDER_COLORS,
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.raw !== null) {
                            label += translate(getLanguage(), 'currency') + context.raw.toLocaleString();
                        }
                        return label;
                    },
                },
            },
        },
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full h-full">
            <h2 className="text-2xl font-bold mb-6 text-center">
                {translate(getLanguage(), 'top3Store')}
            </h2>
            <div className="h-96">
                <Doughnut data={data} options={options} />
            </div>
        </div>
    );
};

export default Top3Store;
