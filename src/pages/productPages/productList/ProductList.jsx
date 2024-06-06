import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductsByStoreId, getProductsByCategoryId } from "../../../api/product/ProductApi.jsx";
import { getCategoryById } from "../../../api/category/CategoryApi.jsx";
import { decodeUserToken } from "../../../api/authentication/AuthenticationApi.jsx";
import { GlobalStoreId } from "../../../api/store/GlobalStoreId.jsx";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {getLanguage, translate} from '../../../language';

function ProductList(props) {
    const { type } = props;
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const { globalStoreId } = useContext(GlobalStoreId);
    const lang = getLanguage();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                if (type === "category" && categoryId) {
                    const categoryResponse = await getCategoryById(categoryId);
                    setCategory(categoryResponse.data);
                    const productResponse = await getProductsByCategoryId(categoryId);
                    setProducts(productResponse || []);
                } else {
                    const storeId = decodeUserToken().storeId || globalStoreId;
                    if (storeId) {
                        const response = await getProductsByStoreId(storeId);
                        setProducts(response || []);
                    } else {
                        alert(translate(lang, 'chooseStoreFirst'));
                        navigate('/stores');
                    }
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                setProducts([]);
            }
        };
        fetchProducts();
    }, [type, categoryId, globalStoreId, lang, navigate]);

    const handleAddProductClick = () => {
        navigate('/add-product');
    };

    const exportExcel = () => {
        const exportData = filteredProducts.map(({ name, model, productCode, profit, currentStock }) => ({
            name, model, productCode, profit, currentStock
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'products.xlsx');
    };

    const filteredProducts = products.filter((product) =>
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
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
                {type === "category" ?
                    (category ? translate(lang, "productsByCategory") + category.name : translate(lang, "loadingCategory")) :
                    translate(lang, 'allProducts')}
            </h1>
            <div className="flex justify-between items-center gap-4 mb-6">
                <>
                    <input
                        type="text"
                        className="p-2 border border-gray-300 rounded"
                        placeholder={translate(lang, 'globalSearch')}
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                    />
                    <div className="flex-grow flex justify-center">
                        <button
                            onClick={exportExcel}
                            className="bg-blue-600 hover:bg-blue-700 mr-20 text-white px-4 py-2 rounded shadow"
                        >
                            {translate(lang, 'exportToExcel')}
                        </button>
                    </div>
                    <button
                        onClick={handleAddProductClick}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
                    >
                        {translate(lang, 'addProduct')}
                    </button>
                </>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                    <tr className="text-center">
                        <th className="px-4 py-2 border border-gray-300">{translate(lang, 'product')}</th>
                        <th className="px-4 py-2 border border-gray-300">{translate(lang, 'model')}</th>
                        <th className="px-4 py-2 border border-gray-300">{translate(lang, 'productCode')}</th>
                        <th className="px-4 py-2 border border-gray-300">{translate(lang, 'profit')}</th>
                        <th className="px-4 py-2 border border-gray-300">{translate(lang, 'currentStock')}</th>
                        <th className="px-4 py-2 border border-gray-300">{translate(lang, 'status')}</th>
                        <th className="px-4 py-2 border border-gray-300">{translate(lang, 'actions')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredProducts.map((product) => (
                        <tr key={product.id} className="text-center">
                            <td className="px-4 py-2 border border-gray-300">{product.name}</td>
                            <td className="px-4 py-2 border border-gray-300">{product.model}</td>
                            <td className="px-4 py-2 border border-gray-300">{product.productCode}</td>
                            <td className="px-4 py-2 border border-gray-300">{product.profit}</td>
                            <td className="px-4 py-2 border border-gray-300">{product.currentStock}</td>
                            <td className="px-4 py-2 border border-gray-300">
                                {statusBodyTemplate(product.profit)}
                            </td>
                            <td className="px-4 py-2 border border-gray-300">
                                <button
                                    onClick={() => navigate(`/product-details/${product.id}`)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
                                >
                                    {translate(lang, 'viewDetails')}
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

export default ProductList;
