import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTransactionById, deleteTransaction } from '../../../api/transaction/TransactionApi.jsx';
import placeholderImage from '../../../assets/transaction.png';
import { getLanguage, translate } from '../../../language';

function TransactionDetails() {
    const { transactionId } = useParams();
    const [transaction, setTransaction] = useState(null);
    const [imageUrl, setImageUrl] = useState(placeholderImage);
    const navigate = useNavigate();
    const lang = getLanguage();

    useEffect(() => {
        const fetchTransaction = async () => {
            const data = await getTransactionById(transactionId);
            setTransaction(data);
            setImageUrl(data.resourceFile?.data ? `data:image/jpeg;base64,${data.resourceFile.data}` : placeholderImage);
        };
        fetchTransaction();
    }, [transactionId]);

    const handleDelete = async () => {
        if (window.confirm(translate(lang, 'deleteConfirmation'))) {
            await deleteTransaction(transactionId);
            navigate(`/transactions/${transaction.product.id}`);
        }
    };

    if (!transaction) return <div>{translate(lang, 'loading')}</div>;

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-2/3 bg-white shadow-lg rounded-lg p-5">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">{translate(lang, 'transactionDetails')}</h1>
                <div className="flex flex-wrap md:flex-nowrap bg-white rounded-lg mx-auto">
                    {/* Image Section */}
                    <div className="md:w-1/2 p-2 flex flex-col items-center">
                        <img
                            src={imageUrl}
                            alt="transaction image"
                            className="rounded-lg object-cover"
                        />
                    </div>
                    {/* General Properties Section */}
                    <div className="md:w-1/2 p-2">
                        <div className="w-full">
                            <div className="mb-4">
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="buying"
                                        name="isBuying"
                                        value={true}
                                        checked={transaction.isBuying === true}
                                        readOnly
                                        className="mr-2"
                                    />
                                    <label htmlFor="buying" className="mr-4">{translate(lang, 'buying')}</label>
                                    <input
                                        type="radio"
                                        id="selling"
                                        name="isBuying"
                                        value={false}
                                        checked={transaction.isBuying === false}
                                        readOnly
                                        className="mr-2"
                                    />
                                    <label htmlFor="selling">{translate(lang, 'selling')}</label>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="date" className="block text-sm font-medium text-gray-900">{translate(lang, 'date')}</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={transaction.date}
                                    readOnly
                                    className="block w-full border border-gray-300 rounded-md py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="quantity" className="block text-sm font-medium text-gray-900">{translate(lang, 'quantity')}</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={transaction.quantity}
                                    readOnly
                                    className="block w-full border border-gray-300 rounded-md py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="price" className="block text-sm font-medium text-gray-900">{translate(lang, 'price')}</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="price"
                                    value={transaction.price}
                                    readOnly
                                    className="block w-full border border-gray-300 rounded-md py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-900">{translate(lang, 'fullName')}</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={transaction.fullName}
                                    readOnly
                                    className="block w-full border border-gray-300 rounded-md py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-900">{translate(lang, 'address')}</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={transaction.address}
                                    readOnly
                                    className="block w-full border border-gray-300 rounded-md py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-900">{translate(lang, 'phone')}</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={transaction.phone}
                                    readOnly
                                    className="block w-full border border-gray-300 rounded-md py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="flex justify-center space-x-2 mt-4">
                            <button
                                className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                onClick={handleDelete}>
                                {translate(lang, 'delete')}
                            </button>
                            <button
                                className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                onClick={() => navigate(`/transactions/${transaction.product.id}`)}>
                                {translate(lang, 'back')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TransactionDetails;
