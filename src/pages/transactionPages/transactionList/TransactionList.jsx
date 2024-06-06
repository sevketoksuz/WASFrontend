// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { getTransactionsByProductId } from '../../../api/transaction/TransactionApi.jsx';
import { getLanguage, translate } from '../../../language';

function TransactionList() {
    const { productId } = useParams();
    const [transactions, setTransactions] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const navigate = useNavigate();
    const lang = getLanguage();

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const fetchedTransactions = await getTransactionsByProductId(productId);
                setTransactions(Array.isArray(fetchedTransactions) ? fetchedTransactions : [fetchedTransactions]);
            } catch (error) {
                console.error("Error in getTransactionsByProductId:", error);
                setTransactions([]);
            }
        };
        fetchTransactions();
    }, [productId]);

    const exportExcel = () => {
        const exportData = transactions.map(({ fullName, date, quantity, price, isBuying }) => ({
            fullName, date, quantity, price, type: isBuying ? translate(lang, 'purchase') : translate(lang, 'sale')
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'transactions.xlsx');
    };

    const filteredTransactions = transactions.filter((transaction) =>
        Object.values(transaction).some((value) =>
            String(value).toLowerCase().includes(globalFilter.toLowerCase())
        )
    );

    const statusBodyTemplate = (isBuying) => (
        <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${
            isBuying ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
            {isBuying ? translate(lang, 'purchase') : translate(lang, 'sale')}
        </span>
    );

    const actionBodyTemplate = (transaction) => (
        <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
            onClick={() => navigate(`/transaction-details/${transaction.id}`)}
            title={translate(lang, 'viewDetails')}
        >
            {translate(lang, 'viewDetails')}
        </button>
    );

    return (
        <div className="max-w-6xl mx-auto p-5 bg-white shadow-lg rounded-lg mt-16">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">{translate(lang, 'transactionsForProduct')} {productId}</h1>
            <div className="flex justify-between items-center gap-4 mb-6">
                <input
                    type="text"
                    className="p-2 border border-gray-300 rounded"
                    placeholder={translate(lang, 'globalSearch')}
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                />
                <button
                    onClick={exportExcel}
                    className="bg-blue-600 mr-20 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
                >
                    {translate(lang, 'exportToExcel')}
                </button>

                <button
                    onClick={() => navigate(`/add-transaction/${productId}`)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
                >
                    {translate(lang, 'addTransaction')}
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                    <tr className="text-center">
                        <th className="px-4 py-2 border border-gray-300">{translate(lang, 'fullName')}</th>
                        <th className="px-4 py-2 border border-gray-300">{translate(lang, 'date')}</th>
                        <th className="px-4 py-2 border border-gray-300">{translate(lang, 'quantity')}</th>
                        <th className="px-4 py-2 border border-gray-300">{translate(lang, 'price')}</th>
                        <th className="px-4 py-2 border border-gray-300">{translate(lang, 'type')}</th>
                        <th className="px-4 py-2 border border-gray-300">{translate(lang, 'actions')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredTransactions.map((transaction) => (
                        <tr key={transaction.id} className="text-center">
                            <td className="px-4 py-2 border border-gray-300">{transaction.fullName}</td>
                            <td className="px-4 py-2 border border-gray-300">{transaction.date}</td>
                            <td className="px-4 py-2 border border-gray-300">{transaction.quantity}</td>
                            <td className="px-4 py-2 border border-gray-300">{transaction.price}</td>
                            <td className="px-4 py-2 border border-gray-300">{statusBodyTemplate(transaction.isBuying)}</td>
                            <td className="px-4 py-2 border border-gray-300">{actionBodyTemplate(transaction)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TransactionList;