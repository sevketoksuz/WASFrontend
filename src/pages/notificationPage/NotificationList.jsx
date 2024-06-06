import { useEffect, useState } from 'react';
import { getNotificationsByUserId, markNotificationIsSeen } from "../../api/notification/NotificationApi.jsx";
import { decodeUserToken } from "../../api/authentication/AuthenticationApi.jsx";
import { format } from 'date-fns';
import {getLanguage, translate} from '../../language';

function NotificationList() {
    const [notifications, setNotifications] = useState([]);
    const [page, setPage] = useState(1);
    const notificationsPerPage = 10;
    const lang = getLanguage();

    useEffect(() => {
        const fetchNotifications = async () => {
            const decodedToken = decodeUserToken();
            if (decodedToken) {
                const response = await getNotificationsByUserId(decodedToken.userId);
                console.log(response.data);
                if (response && response.data) {
                    const sortedNotifications = response.data.sort(
                        (a, b) => new Date(b.recordDate) - new Date(a.recordDate)
                    );
                    setNotifications(sortedNotifications);
                    setPage(1); // Ensure the first page is selected when notifications are fetched
                }
            }
        };

        fetchNotifications();
    }, []);

    useEffect(() => {
        // Ensure we show the correct page if the current page exceeds total pages after fetching data
        const totalPages = Math.ceil(notifications.length / notificationsPerPage);
        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [notifications]);

    const totalPages = Math.ceil(notifications.length / notificationsPerPage);
    const displayedNotifications = notifications.slice((page - 1) * notificationsPerPage, page * notificationsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const handleMarked = (notificationId) => {
        markNotificationIsSeen(notificationId)
            .then(response => {
                console.log('Notification marked as read', response.data);
                const updatedNotifications = notifications.map(notification => {
                    if (notification.id === notificationId) {
                        notification.isSeen = true;
                    }
                    return notification;
                });
                setNotifications(updatedNotifications);
            })
            .catch(error => {
                console.error('Failed to mark notification as read', error);
            });
    };

    const getNotificationLevelColor = (level) => {
        switch (level) {
            case 'INFO':
                return 'bg-blue-100 text-blue-800';
            case 'SUCCESS':
                return 'bg-green-100 text-green-800';
            case 'ERROR':
                return 'bg-red-100 text-red-800';
            case 'WARNING':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800'; // default color for unknown levels
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-5 bg-white shadow-lg rounded-lg mt-16">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">{translate(lang, 'notifications')}</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 table-fixed">
                    <thead>
                    <tr className="text-center">
                        <th className="w-1/6 px-4 py-2 border border-gray-300">{translate(lang, 'subject')}</th>
                        <th className="w-2/5 px-4 py-2 border border-gray-300">{translate(lang, 'description')}</th>
                        <th className="w-1/6 px-4 py-2 border border-gray-300">{translate(lang, 'date')}</th>
                        <th className="w-1/6 px-4 py-2 border border-gray-300">{translate(lang, 'level')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {displayedNotifications.length > 0 ? (
                        displayedNotifications.map((notification) => (
                            <tr key={notification.id} className="text-center">
                                <td className="px-4 py-2 border border-gray-300">{notification.subject}</td>
                                <td className="px-4 py-2 border border-gray-300">{notification.description}</td>
                                <td className="px-4 py-2 border border-gray-300">{format(new Date(notification.recordDate), 'PPP')}</td>
                                <td className="px-4 py-2 border border-gray-300">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getNotificationLevelColor(notification.notificationLevel[0])}`}>
                                        {notification.notificationLevel[0]}
                                    </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="px-4 py-2 border border-gray-300 text-center">{translate(lang, 'noNotifications')}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between mt-4">
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l ${page === 1 && 'cursor-not-allowed opacity-50'}`}
                >
                    {translate(lang, 'previous')}
                </button>
                <div className="flex items-center space-x-2">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <span
                            key={index + 1}
                            className={`px-4 py-2 ${page === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'} rounded-full cursor-pointer`}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </span>
                    ))}
                </div>
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r ${page === totalPages && 'cursor-not-allowed opacity-50'}`}
                >
                    {translate(lang, 'next')}
                </button>
            </div>
        </div>
    );
}

export default NotificationList;
