import { useEffect, useState, useContext } from 'react';
import { addProduct } from '../../../api/product/ProductApi.jsx';
import { getStoreById } from "../../../api/store/StoreApi.jsx";
import { addCategory, getCategoriesByStoreId } from "../../../api/category/CategoryApi.jsx";
import { decodeUserToken } from "../../../api/authentication/AuthenticationApi.jsx";
import { GlobalStoreId } from "../../../api/store/GlobalStoreId.jsx";
import { useNavigate } from 'react-router-dom';
import { getLanguage, translate } from '../../../language';

function ProductAdd({ onClose }) {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [photo, setPhoto] = useState(null);
    const [photoError, setPhotoError] = useState('');
    const [store, setStore] = useState(null);
    const { globalStoreId } = useContext(GlobalStoreId);
    const [product, setProduct] = useState({
        name: '',
        model: '',
        category: 0,
        productCode: '',
        store: 0,
        quantity: '',
        productFields: []
    });
    const [newCategory, setNewCategory] = useState('');
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    const lang = getLanguage();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoryData = await getCategoriesByStoreId(decodeUserToken().storeId || globalStoreId);
                setCategories(categoryData.data);
            } catch (error) {
                console.error("Failed to fetch categories", error);
                setCategories([]);
            }
        };

        const fetchStore = async () => {
            try {
                const storeData = await getStoreById(decodeUserToken().storeId || globalStoreId);
                setStore(storeData.data);
                setProduct(prev => ({ ...prev, store: storeData.data.id }));
            } catch (error) {
                console.error("Failed to fetch store", error);
                setStore(null);
            }
        };

        fetchCategories();
        fetchStore();
    }, []);

    if (!store) {
        return <div>Loading...</div>;
    }

    const handleChange = (e, index = null) => {
        if (index !== null) {
            const updatedFields = product.productFields.map((field, idx) =>
                idx === index ? { ...field, [e.target.name]: e.target.value } : field
            );
            setProduct({ ...product, productFields: updatedFields });
        } else {
            setProduct({ ...product, [e.target.name]: e.target.value });
        }
    };

    const addInputField = (name = '', feature = '') => {
        setProduct(prev => ({
            ...prev,
            productFields: [...prev.productFields, { name, feature }]
        }));
    };

    const removeInputField = (index) => {
        if (product.productFields.length > 0) {
            setProduct(prev => {
                const updatedFields = prev.productFields.filter((_, idx) => idx !== index);
                return { ...prev, productFields: updatedFields };
            });
        }
    };

    const handleCategoryPrototype = (e) => {
        const selectedValue = e.target.value;
        if (selectedValue === "") {
            setProduct({ ...product, category: '', productFields: [] });
        } else if (selectedValue === "new") {
            setShowNewCategoryInput(true);
            setProduct({ ...product, category: '', productFields: [] });
        } else {
            setShowNewCategoryInput(false);
            const category = categories.find(cat => cat.id === parseInt(selectedValue));
            if (category) {
                setProduct({
                    ...product,
                    category: category.id,
                    productFields: category.prototypes.map(prototype => ({
                        name: prototype.name,
                        feature: prototype.feature
                    }))
                });
            }
        }
    };

    const handleAddCategory = async () => {
        const storeId = parseInt(decodeUserToken().storeId || globalStoreId, 10);
        const newCategoryObj = {
            category: {
                name: newCategory,
                storeId: storeId,
                prototypes: [],
                products: []
            },
            prototypes: product.productFields.map(field => ({ name: field.name, isDelete: false }))
        };

        try {
            await addCategory(newCategoryObj);
            alert(translate(lang, 'categoryAdded'));
            // Refetch categories after adding the new category
            const categoryData = await getCategoriesByStoreId(decodeUserToken().storeId || globalStoreId);
            setCategories(categoryData.data);
            setProduct(prev => ({
                ...prev,
                category: '', // reset the category selection if needed
                productFields: []
            }));
            setNewCategory('');
            setShowNewCategoryInput(false);
        } catch (error) {
            console.error("Failed to add category", error);
        }
    };


    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file && file.size > maxSize) {
            setPhotoError('File size exceeds the 5MB limit.');
            setPhoto(null);
        } else {
            setPhotoError('');
            setPhoto(file);
        }
    };

    const handleSubmit = async () => {
        try {
            if (photoError) {
                alert(photoError);
                return;
            }
            await addProduct(product, photo);
            alert(translate(lang, 'productAdded'));
            navigate('/product-list');
        } catch (error) {
            alert(translate(lang, 'productAddFailed'));
            console.error("Failed to add product", error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-5 my-10 w-full max-w-4xl bg-white rounded-lg shadow-lg mt-2">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">{translate(lang, 'newProduct')}</h2>
                <div className="product-fields">
                    <div className="field-pair">
                        <InputField
                            id="name"
                            label={translate(lang, 'name')}
                            name="name"
                            value={product.name}
                            onChange={handleChange}
                        />
                        <InputField
                            id="model"
                            label={translate(lang, 'model')}
                            name="model"
                            value={product.model}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="field-pair">
                        <InputField
                            id="category"
                            label={translate(lang, 'category')}
                            name="category"
                            value={product.category}
                            onChange={handleCategoryPrototype}
                            isSelect
                            options={categories}
                        />
                        <InputField
                            id="productCode"
                            label={translate(lang, 'productCode')}
                            name="productCode"
                            value={product.productCode}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="field-pair">
                        <InputField
                            id="store"
                            label={translate(lang, 'store')}
                            name="store"
                            enabled={false}
                            value={store.name}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                {showNewCategoryInput && (
                    <div className="mt-6 mb-4">
                        <label htmlFor="newCategory"
                               className="block text-sm font-medium text-gray-700 mb-2">{translate(lang, 'newCategory')}</label>
                        <div className="flex items-center">
                            <input
                                id="newCategory"
                                name="newCategory"
                                type="text"
                                className="w-full p-2 text-sm text-gray-900 border rounded-lg bg-gray-50 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                value={newCategory}
                                onChange={e => setNewCategory(e.target.value)}
                            />
                            <button
                                className="ml-4 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                                onClick={handleAddCategory}
                            >
                                {translate(lang, 'addCategory')}
                            </button>
                        </div>
                    </div>
                )}
                <div className="mt-6 mb-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">{translate(lang, 'productFields')}</h3>
                    {product.productFields.map((field, index) => (
                        <div key={index} className="field-pair mb-2">
                            <InputField
                                label={translate(lang, 'fieldName')}
                                name="name"
                                value={field.name}
                                onChange={e => handleChange(e, index)}
                            />
                            <InputField
                                label={translate(lang, 'feature')}
                                name="feature"
                                value={field.feature}
                                onChange={e => handleChange(e, index)}
                            />
                            <button
                                className="ml-4 px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
                                onClick={() => removeInputField(index)}
                            >
                                {translate(lang, 'deleteField')}
                            </button>
                        </div>
                    ))}
                    <button
                        className="mt-4 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                        onClick={() => addInputField()}
                    >
                        {translate(lang, 'addField')}
                    </button>
                </div>
                <div className="mt-6 mb-4">
                    <label
                        className="block text-sm font-medium text-gray-700 mb-2">{translate(lang, 'productImage')}</label>
                    <input
                        id="imageFile"
                        name="imageFile"
                        type="file"
                        className="w-full text-sm text-gray-900 border rounded-lg bg-gray-50 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        onChange={handlePhotoChange}
                    />
                    {photoError && <p className="text-red-500 text-sm mt-2">{photoError}</p>}
                    {photo && (
                        <div className="mt-4">
                            <img
                                src={URL.createObjectURL(photo)}
                                alt="Product Preview"
                                className="object-cover border rounded-lg"
                            />
                        </div>
                    )}
                </div>
                <div className="flex justify-end">
                    <button
                        className="mr-4 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                        onClick={handleSubmit}
                    >
                        {translate(lang, 'addProduct')}
                    </button>
                    <button
                        className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
                        onClick={onClose}
                    >
                        {translate(lang, 'cancel')}
                    </button>
                </div>
            </div>
        </div>
    );
}

function InputField({id, label, name, value, onChange, enabled = true, isSelect = false, options = []}) {
    return (
        <div className="w-full mb-4 mr-3">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            {isSelect ? (
                <select
                    id={id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="w-full p-2 text-sm text-gray-900 border rounded-lg bg-gray-50 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">{translate(getLanguage(), 'selectCategory')}</option>
                    <option value="new">{translate(getLanguage(), 'newCategory')}</option>
                    {options.map(option => (
                        <option key={option.id} value={option.id}>{option.name}</option>
                    ))}
                </select>
            ) : (
                <input
                    id={id}
                    name={name}
                    type="text"
                    value={value}
                    onChange={onChange}
                    className={`w-full p-2 text-sm text-gray-900 border rounded-lg bg-gray-50 border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${!enabled && 'bg-gray-100 cursor-not-allowed'}`}
                    disabled={!enabled}
                />
            )}
        </div>
    );
}

export default ProductAdd;
