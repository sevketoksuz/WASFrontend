import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { getTop5MostProfitableCategory } from '../../../api/category/CategoryApi.jsx';
import Chart from 'chart.js/auto';
import { getLanguage, translate } from "../../../language/index.jsx";

const COLORS = [
    'rgba(75, 192, 192, 0.6)',
    'rgba(75, 192, 75, 0.6)',
    'rgba(255, 206, 86, 0.6)',
    'rgba(153, 102, 255, 0.6)',
    'rgba(255, 105, 180, 0.6)',
    'rgba(255, 99, 132, 0.6)',
];

const BORDER_COLORS = [
    'rgba(75, 192, 192, 1)',
    'rgba(75, 192, 75, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 105, 180, 1)',
    'rgba(255, 99, 132, 1)',
];

const Top5Category = (props) => {
    // eslint-disable-next-line react/prop-types
    const { storeId } = props;
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const lang = getLanguage();
    const currency = translate(lang, 'currency'); // Para birimi çevirisini burada alın

    console.log("StoreId: category", storeId);

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                const response = await getTop5MostProfitableCategory(storeId);
                setCategories(response.data);
                setLoading(false);
            } catch (error) {
                setError(`${translate(lang, 'errorFetchingCategories')}${error.message}`);
                setLoading(false);
            }
        };

        fetchCategoryData();
    }, [storeId]);

    useEffect(() => {
        return () => {
            for (let id in Chart.instances) {
                Chart.instances[id].destroy();
            }
        };
    }, []);

    if (loading) {
        return <div>{translate(lang, 'loading')}</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const data = {
        labels: categories.map((category) => category.categoryName),
        datasets: [
            {
                label: translate(lang, 'totalProfit'),
                data: categories.map((category) => category.totalProfit),
                backgroundColor: categories.map((_, index) => COLORS[index % COLORS.length]),
                borderColor: categories.map((_, index) => BORDER_COLORS[index % BORDER_COLORS.length]),
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';

                        if (label) {
                            label += ': ';
                        }
                        label += `${currency}${context.parsed.y.toFixed(2)}`;
                        return label;
                    }
                }
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full">
            <h2 className="text-2xl font-bold mb-6 text-center">
                {translate(lang, 'top5Category')}
            </h2>
            <Bar data={data} options={options} />
        </div>
    );
};

export default Top5Category;
