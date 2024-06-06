import React, { useState, useEffect } from 'react';
import { decodeUserToken } from "../../api/authentication/AuthenticationApi.jsx";
import { getTelegramLink } from "../../api/telegram/TelegramApi.jsx";
import { getUserById } from "../../api/user/UserApi.jsx";
import { getLanguage, translate } from '../../language';

function Settings() {
    const [isPaired, setIsPaired] = useState(false);
    const userId = decodeUserToken().userId;
    const lang = getLanguage();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await getUserById(userId);
                if (response && response.data) {
                    const user = response.data;
                    setIsPaired(!!user.telegramId);
                }
            } catch (error) {
                console.error('Failed to get user details:', error);
                alert(translate(lang, 'failedToGetUserDetails'));
            }
        };

        fetchUserDetails();
    }, [userId]);

    const handlePairing = async () => {
        try {
            const response = await getTelegramLink(userId);
            if (response && response.data) {
                window.location.href = response.data;
                setIsPaired(true);
                alert(translate(lang, 'telegramPairingLinkOpened'));
            }
        } catch (error) {
            console.error('Failed to get Telegram link:', error);
            alert(translate(lang, 'failedToGetTelegramLink'));
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-5 bg-white shadow-lg rounded-lg mt-16">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">{translate(lang, 'settings')}</h1>
            <div className="flex justify-center items-center mb-6 space-x-4">
                <div className="w-1/4">
                    <label className="text-center justify-center block text-sm font-medium text-gray-700">{translate(lang, 'telegram')}</label>
                    <input
                        type="text"
                        value={isPaired ? translate(lang, 'paired') : translate(lang, 'notPaired')}
                        readOnly
                        className="text-center mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-gray-600 sm:text-sm"
                    />
                </div>
                <div className="w-1/4">
                    <button
                        onClick={handlePairing}
                        className="text-center border border-blue-600 mt-6 justify-center w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md shadow-sm"
                    >
                        {translate(lang, 'pairTelegram')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Settings;
