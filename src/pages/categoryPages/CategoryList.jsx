import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategoriesSummary } from "../../api/category/CategoryApi.jsx";
import { decodeUserToken } from "../../api/authentication/AuthenticationApi.jsx";
import { GlobalStoreId } from "../../api/store/GlobalStoreId.jsx";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {getLanguage, translate} from '../../language';

function CategoryList() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const { globalStoreId } = useContext(GlobalStoreId);
    const lang = getLanguage();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategoriesSummary(decodeUserToken().storeId || globalStoreId);
                setCategories(response.data || []);
            } catch (error) {
                console.error("Error in getProductsByStoreId:", error);
                setCategories([]);
            }
        };
        if (decodeUserToken().storeId || globalStoreId){
            fetchCategories();
        }
        else {
            alert(translate(lang, 'chooseStoreFirst'));
            navigate('/stores');
        }
    }, []);

    const exportExcel = () => {
        const exportData = filteredCategories.map(({ name, totalProfit, productCount }) => ({
            name, totalProfit, productCount
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Categories');
        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'categories.xlsx');
    };

    const filteredCategories = categories.filter((product) =>
        Object.values(product).some((value) =>
            String(value).toLowerCase().includes(globalFilter.toLowerCase())
        )
    );

    const statusBodyTemplate = (profit) => (
        <div
            className={`px-4 py-2 rounded text-center font-bold ${
                profit > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
        >
            {profit > 0 ? translate(lang, 'profitStatus') : translate(lang, 'profitLossStatus')}
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto p-5 bg-white shadow-lg rounded-lg mt-16">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">{translate(lang, 'allCategories')}</h1>
            <div className="flex justify-between items-center gap-4 mb-6">
                <input
                    type="text"
                    className="p-2 border border-gray-300 rounded"
                    placeholder={translate(lang, 'globalSearch')}
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                />
                <div className="flex-grow flex justify-end">
                    <button
                        onClick={exportExcel}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
                    >
                        {translate(lang, 'exportToExcel')}
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                    <tr className="text-center">
                        <th className="px-4 py-2 border border-gray-300">{translate(lang, 'category')}</th>
                        <th className="px-4 py-2 border border-gray-300">{translate(lang, 'productCount')}</th>
                        <th className="px-4 py-2 border border-gray-300">{translate(lang, 'totalProfit')}</th>
                        <th className="px-4 py-2 border border-gray-300">{translate(lang, 'status')}</th>
                        <th className="px-4 py-2 border border-gray-300">{translate(lang, 'actions')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredCategories.map((category) => (
                        <tr key={category.categoryId} className="text-center">
                            <td className="px-4 py-2 border border-gray-300">{category.name}</td>
                            <td className="px-4 py-2 border border-gray-300">{category.productCount}</td>
                            <td className="px-4 py-2 border border-gray-300">{category.totalProfit}</td>
                            <td className="px-4 py-2 border border-gray-300">
                                {statusBodyTemplate(category.totalProfit)}
                            </td>
                            <td className="px-4 py-2 border border-gray-300">
                                <button
                                    onClick={() => navigate(`/product-list/category/${category.categoryId}`)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
                                >
                                    {translate(lang, 'seeProducts')}
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CategoryList;
