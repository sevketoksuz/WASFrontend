import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserById } from '../../../api/user/UserApi';
import { decodeUserToken, logout } from '../../../api/authentication/AuthenticationApi';
import defaultUserIcon from '../../../assets/user.webp';
import { GlobalStoreId } from '../../../api/store/GlobalStoreId.jsx';
import { GlobalCompanyId } from '../../../api/company/GlobalCompanyId.jsx';
import { getLanguage, translate } from '../../../language';

function UserProfile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const { setGlobalStoreId } = useContext(GlobalStoreId);
    const { setGlobalCompanyId } = useContext(GlobalCompanyId);
    const lang = getLanguage();

    useEffect(() => {
        const fetchUser = async () => {
            const decodedToken = decodeUserToken();
            if (decodedToken && decodedToken.userId) {
                try {
                    const response = await getUserById(decodedToken.userId);
                    setUser(response.data);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    alert(translate(lang, 'failedToFetchUserData'));
                    navigate('/login');
                }
            } else {
                alert(translate(lang, 'userIdNotFound'));
                navigate('/login');
            }
        };
        fetchUser();
    }, [navigate, lang]);

    if (!user) {
        return <div>{translate(lang, 'loading')}</div>;
    }

    const imageUrl = user.resourceFile && user.resourceFile.data ? `data:image/jpeg;base64,${user.resourceFile.data}` : defaultUserIcon;

    return (
        <div className="max-w-6xl mx-auto p-5 bg-white shadow-lg rounded-lg mt-16">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">{translate(lang, 'userProfile')}</h1>
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex justify-center">
                        <img src={imageUrl} alt="Profile" className="w-32 h-32 rounded-full shadow" onError={(e) => { e.target.src = defaultUserIcon; }} />
                    </div>
                    <div className="md:col-span-2">
                        <div className="mb-4">
                            <span className="font-semibold">{translate(lang, 'name')}: </span>{user.name}
                        </div>
                        <div className="mb-4">
                            <span className="font-semibold">{translate(lang, 'surname')}: </span>{user.surname}
                        </div>
                        <div className="mb-4">
                            <span className="font-semibold">{translate(lang, 'email')}: </span>{user.email}
                        </div>
                        <div className="mb-4">
                            <span className="font-semibold">{translate(lang, 'phone')}: </span>{user.phoneNo}
                        </div>
                        <div className="mb-4">
                            <span className="font-semibold">{translate(lang, 'isTelegramLinked')}: </span>{user.isTelegram ? translate(lang, 'yes') : translate(lang, 'no')}
                        </div>
                        <div className="mb-4">
                            <span className="font-semibold">{translate(lang, 'telegramId')}: </span>{user.telegramId}
                        </div>
                        <div className="mb-4">
                            <span className="font-semibold">{translate(lang, 'telegramLinkTime')}: </span>{user.telegramLinkTime}
                        </div>
                        <div className="flex justify-start items-center gap-4">
                            <button
                                onClick={() => navigate('/edit-profile')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
                            >
                                {translate(lang, 'editProfile')}
                            </button>
                            <button
                                onClick={() => {
                                    setGlobalStoreId(null);
                                    setGlobalCompanyId(null);
                                    logout();
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow"
                            >
                                {translate(lang, 'logout')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;
