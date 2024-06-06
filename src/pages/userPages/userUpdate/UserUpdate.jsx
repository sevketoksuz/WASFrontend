import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserById, updateUser } from '../../../api/user/UserApi';
import { decodeUserToken } from '../../../api/authentication/AuthenticationApi';
import { getLanguage, translate } from '../../../language';

const placeholderImage = 'src/assets/user.webp';

function UserUpdate() {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [imageUrl, setImageUrl] = useState(null);
    const lang = getLanguage();

    useEffect(() => {
        const fetchUser = async () => {
            const decodedToken = decodeUserToken();
            if (decodedToken && decodedToken.userId) {
                try {
                    const response = await getUserById(decodedToken.userId);
                    setUser(response.data);
                    if (response.data.resourceFile && response.data.resourceFile.data) {
                        setImageUrl(`data:image/jpeg;base64,${response.data.resourceFile.data}`);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    alert(translate(lang, 'failedToFetchUser'));
                    navigate('/login');
                }
            } else {
                alert(translate(lang, 'userIdNotFound'));
                navigate('/login');
            }
        };
        fetchUser();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageUrl(URL.createObjectURL(file));
            setUser((prevState) => ({
                ...prevState,
                file: file
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (user.phoneNo.length < 9 || user.phoneNo.length > 13) {
            alert(translate(lang, 'phoneLengthError'));
            return;
        }
        try {
            await updateUser(user.id, user, user.file);
            alert(translate(lang, 'profileUpdated'));
            navigate('/profile');
        } catch (error) {
            console.error("Error updating profile:", error);
            alert(translate(lang, 'profileUpdateFailed'));
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-5 bg-white shadow-lg rounded-lg mt-16">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">{translate(lang, 'editProfile')}</h1>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">{translate(lang, 'name')}</label>
                        <input type="text" id="name" name="name" value={user.name} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="surname">{translate(lang, 'surname')}</label>
                        <input type="text" id="surname" name="surname" value={user.surname} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">{translate(lang, 'email')}</label>
                        <input type="email" id="email" name="email" value={user.email} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="phoneNo">{translate(lang, 'phone')}</label>
                        <input type="text" id="phoneNo" name="phoneNo" value={user.phoneNo} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="file">{translate(lang, 'profilePicture')}</label>
                    <input type="file" id="file" name="file" onChange={handleFileChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    {imageUrl && (
                        <div className="mt-2">
                            <img
                                src={imageUrl}
                                alt="Profile"
                                className="w-32 h-32 rounded-full shadow"
                                onError={(e) => { e.target.src = placeholderImage; }}
                            />
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-between">
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">{translate(lang, 'saveChanges')}</button>
                    <button type="button" onClick={() => navigate('/profile')} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">{translate(lang, 'cancel')}</button>
                </div>
            </form>
        </div>
    );
}

export default UserUpdate;
