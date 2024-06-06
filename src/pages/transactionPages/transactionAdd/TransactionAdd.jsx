import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addTransaction } from '../../../api/transaction/TransactionApi.jsx';
import { getLanguage, translate } from '../../../language';

function TransactionAdd() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const lang = getLanguage();
    const [image, setImage] = useState(null);

    const getCurrentDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const [transaction, setTransaction] = useState({
        isBuying: true,
        date: getCurrentDate(),
        quantity: 0,
        price: 0.0,
        fullName: '',
        address: '',
        phone: '',
        product: productId,
    });

    const [photo, setPhoto] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTransaction({ ...transaction, [name]: value === 'true' ? true : value === 'false' ? false : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (transaction.phone.length < 9 || transaction.phone.length > 13) {
            alert(translate(lang, 'phoneLengthError'));
            return;
        }
        try {
            await addTransaction(transaction, image);
            alert(translate(lang, 'transactionAddSuccess'));
            navigate(`/transactions/${productId}`);
        } catch (error) {
            console.error('Failed to add transaction:', error);
            alert(translate(lang, 'transactionAddError'));
        }
    };

    return (
        <div className="max-w-lg mx-auto p-5 bg-white shadow-lg rounded-lg mt-16">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">{translate(lang, 'addTransaction')}</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">{translate(lang, 'type')}</label>
                    <div className="flex items-center mt-1">
                        <input type="radio" id="buying" name="isBuying" value={true}
                               checked={transaction.isBuying === true} onChange={handleChange} className="mr-2"/>
                        <label htmlFor="buying" className="mr-4">{translate(lang, 'buying')}</label>
                        <input type="radio" id="selling" name="isBuying" value={false}
                               checked={transaction.isBuying === false} onChange={handleChange} className="mr-2"/>
                        <label htmlFor="selling">{translate(lang, 'selling')}</label>
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">{translate(lang, 'date')}</label>
                    <input type="date" name="date" value={transaction.date} onChange={handleChange}
                           className="block w-full mt-1"/>
                </div>
                <div className="mb-4">
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">{translate(lang, 'quantity')}</label>
                    <input type="number" name="quantity" value={transaction.quantity} onChange={handleChange}
                           className="block w-full mt-1"/>
                </div>
                <div className="mb-4">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">{translate(lang, 'price')}</label>
                    <input type="number" step="0.01" name="price" value={transaction.price} onChange={handleChange}
                           className="block w-full mt-1"/>
                </div>
                <div className="mb-4">
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">{translate(lang, 'fullName')}</label>
                    <input type="text" name="fullName" value={transaction.fullName} onChange={handleChange}
                           className="block w-full mt-1"/>
                </div>
                <div className="mb-4">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">{translate(lang, 'address')}</label>
                    <input type="text" name="address" value={transaction.address} onChange={handleChange}
                           className="block w-full mt-1"/>
                </div>
                <div className="mb-4">
                    <label htmlFor="phone"
                           className="block text-sm font-medium text-gray-700">{translate(lang, 'phone')}</label>
                    <input
                        type="text"
                        name="phone"
                        value={transaction.phone}
                        onChange={handleChange}
                        minLength="9"
                        maxLength="13"
                        className="block w-full mt-1"
                        required
                    />
                </div>

                <div className="w-full mt-8">
                    <label htmlFor="imageFile" className="block mb-2 text-sm font-medium text-gray-700">{translate(lang, 'productImage')}:</label>
                    <input
                        id="imageFile"
                        name="imageFile"
                        type="file"
                        className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                        onChange={(event) => {
                            const file = event.target.files[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                    setPhoto(e.target.result);
                                };
                                reader.readAsDataURL(file);
                                setImage(file)
                            }
                        }}
                    />
                    <p className="mt-1 text-sm text-gray-500">{translate(lang, 'imageFileHint')}</p>
                    {photo && (
                        <img
                            src={photo}
                            className="rounded-lg w-full object-cover mt-2"
                            style={{maxHeight: '400px'}}
                        />
                    )}
                </div>
                <div className="flex justify-center space-x-2 mt-4">
                    <button type="submit"
                            className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        {translate(lang, 'add')}
                    </button>
                    <button type="button"
                            className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            onClick={() => navigate(`/transactions/${productId}`)}>
                        {translate(lang, 'cancel')}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default TransactionAdd;
