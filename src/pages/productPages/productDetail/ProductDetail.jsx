import {useState, useEffect, useContext} from 'react';
import { deleteProduct, updateProduct, getProductById } from "../../../api/product/ProductApi.jsx";
import { getCategoriesByStoreId } from "../../../api/category/CategoryApi.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { GlobalStoreId } from "../../../api/store/GlobalStoreId.jsx";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {getLanguage, translate} from '../../../language';
import {decodeUserToken} from "../../../api/authentication/AuthenticationApi.jsx";

const placeholderImage = 'src/assets/product.png';

function ProductDetail() {
    const { productId } = useParams();
    const [editableProduct, setEditableProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [imageUrl, setImageUrl] = useState(placeholderImage);
    const navigate = useNavigate();
    const { globalStoreId } = useContext(GlobalStoreId);
    const lang = getLanguage(); // Eklenen satır

    useEffect(() => {
        const fetchProductAndCategories = async () => {
            try {
                const productResponse = await getProductById(productId);
                setEditableProduct(productResponse);

                if (productResponse.resourceFile && productResponse.resourceFile.data) {
                    setImageUrl(`data:image/jpeg;base64,${productResponse.resourceFile.data}`);
                }

                const categoryResponse = await getCategoriesByStoreId(decodeUserToken().storeId || globalStoreId);
                setCategories(categoryResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                navigate('/product-list')
            }
        };

        fetchProductAndCategories();
    }, [productId]);

    const handleFieldChange = (index, field, value) => {
        const updatedFields = editableProduct.productFields.map((f, i) =>
            i === index ? { ...f, [field]: value } : f
        );
        setEditableProduct({ ...editableProduct, productFields: updatedFields });
    };

    const handleDeleteField = (index) => {
        const updatedFields = editableProduct.productFields.filter((_, i) => i !== index);
        setEditableProduct({ ...editableProduct, productFields: updatedFields });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditableProduct({ ...editableProduct, [name]: value });
    };

    const handleCategoryChange = (e) => {
        const selectedCategory = categories.find(category => category.id === Number(e.target.value));
        console.log("Selected category:", selectedCategory);
        setEditableProduct({ ...editableProduct, category: selectedCategory });
    };

    const handleUpdate = async () => {
        try {
            const photo = document.getElementById('imageFile').files[0];
            await updateProduct(editableProduct.id, editableProduct, photo);
            navigate('/product-list')
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteProduct(editableProduct.id);
                navigate('/product-list')
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }
    };

    const handleNavigateToTransactions = () => {
        navigate(`/transactions/${editableProduct.id}`);
    };

    const handleAddNewProperty = () => {
        const newField = { name: "", feature: "" };
        setEditableProduct({
            ...editableProduct,
            productFields: [...editableProduct.productFields, newField]
        });
    };

    if (!editableProduct) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1 className="mt-10 text-3xl font-bold text-center text-gray-800 mb-10">{translate(lang, 'productDetails')}</h1>
            <div className="flex flex-wrap md:flex-nowrap bg-white shadow-lg rounded-lg mx-auto p-5 my-10">
                {/* Image Section */}
                <div className="md:w-1/3 p-2 flex flex-col items-center">
                    <img
                        src={imageUrl}
                        alt={editableProduct.name}
                        className="rounded-lg object-cover"
                    />
                    <div className="mt-2 w-full">
                        <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700">{translate(lang, 'productImage')}:</label>
                        <input
                            id="imageFile"
                            name="imageFile"
                            type="file"
                            className="form-input mt-1 block w-full border border-gray-300 rounded-md"
                            onChange={(event) => {
                                const file = event.target.files[0];
                                if (file) {
                                    const newImageUrl = URL.createObjectURL(file);
                                    setEditableProduct({
                                        ...editableProduct,
                                        imageFile: file
                                    });
                                    setImageUrl(newImageUrl); // Update the image URL to display the selected photo
                                }
                            }}
                        />
                    </div>
                </div>
                {/* General Properties Section */}
                <div className="md:w-1/3 p-2">
                    <div className="w-full">
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-900">{translate(lang, 'name')}:</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                className="block w-full border border-gray-300 rounded-md py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                value={editableProduct.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="model" className="block text-sm font-medium text-gray-900">{translate(lang, 'model')}:</label>
                            <input
                                id="model"
                                name="model"
                                type="text"
                                className="block w-full border border-gray-300 rounded-md py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                value={editableProduct.model}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="productCode" className="block text-sm font-medium text-gray-900">{translate(lang, 'productCode')}:</label>
                            <input
                                id="productCode"
                                name="productCode"
                                type="text"
                                className="block w-full border border-gray-300 rounded-md py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                value={editableProduct.productCode}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="category" className="block text-sm font-medium text-gray-900">{translate(lang, 'category')}:</label>
                            <select
                                id="category"
                                name="category"
                                className="block w-full border border-gray-300 rounded-md py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                value={editableProduct.category?.id || ''}
                                onChange={handleCategoryChange}
                            >
                                <option value="" disabled>{translate(lang, 'selectCategory')}</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                {/* Additional Properties Section */}
                <div className="md:w-1/3 p-2">
                    <div className="mb-4">
                        <label htmlFor="currentStock" className="block text-sm font-medium text-gray-900">{translate(lang, 'currentStock')}:</label>
                        <input
                            id="currentStock"
                            name="currentStock"
                            type="number"
                            className="block w-full border border-gray-300 rounded-md py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            value={editableProduct.currentStock}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="profit" className="block text-sm font-medium text-gray-900">{translate(lang, 'profit')}:</label>
                        <input
                            id="profit"
                            name="profit"
                            type="number"
                            className="block w-full border border-gray-300 rounded-md py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            value={editableProduct.profit}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="storeName" className="block text-sm font-medium text-gray-900">{translate(lang, 'storeName')}:</label>
                        <input
                            id="storeName"
                            name="storeName"
                            type="text"
                            className="block w-full border border-gray-300 rounded-md py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            value={editableProduct.store?.name || ''}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>
            <div className="bg-white shadow-lg rounded-lg mx-auto p-5 my-10">
                <h2 className="text-xl font-bold text-center text-gray-800 mb-5">{translate(lang, 'productProperties')}</h2>
                {editableProduct.productFields.map((field, index) => (
                    <div key={index} className="mb-4">
                        <div className="flex">
                            <input
                                type="text"
                                className="block w-full border border-gray-300 rounded-md py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                value={field.name}
                                onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                                placeholder="Property Name"
                            />
                            <input
                                type="text"
                                className="block w-full border border-gray-300 rounded-md py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 ml-2"
                                value={field.feature}
                                onChange={(e) => handleFieldChange(index, 'feature', e.target.value)}
                                placeholder="Property Feature"
                            />
                            <button
                                className="ml-2 text-red-500 hover:text-red-700"
                                onClick={() => handleDeleteField(index)}
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                ))}
                <div className="text-center">
                    <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={handleAddNewProperty}
                    >
                        + {translate(lang, 'newProperty')}
                    </button>
                </div>
            </div>
            <div className="flex justify-center space-x-4">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    onClick={handleUpdate}
                >
                    {translate(lang, 'update')}
                </button>
                <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    onClick={handleDelete}
                >
                    {translate(lang, 'delete')}
                </button>
                <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
                    onClick={handleNavigateToTransactions}
                >
                    {translate(lang, 'viewTransactions')}
                </button>
            </div>
        </div>
    );
}

export default ProductDetail;
