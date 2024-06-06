import React, { useEffect, useState, useContext } from 'react';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { CiCircleCheck } from 'react-icons/ci';
import { addAccount } from '../../../api/user/UserApi.jsx';
import { useNavigate } from "react-router-dom";
import { GlobalStoreId } from "../../../api/store/GlobalStoreId.jsx";
import { getLanguage, translate } from '../../../language';
import { decodeUserToken } from "../../../api/authentication/AuthenticationApi.jsx";

export default function UserAdd(props) {
    const { type } = props;
    const { globalStoreId } = useContext(GlobalStoreId);
    const [account, setAccount] = useState({ username: '', password: '', password_again: '' });
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [user, setUser] = useState({ email: '', name: '', surname: '', phone: '' });
    const [photo, setPhoto] = useState(null);
    const navigate = useNavigate();
    const lang = getLanguage();

    const handlePhotoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPhoto(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        document.getElementById('photoInput').click();
    };

    const handleRegister = async (event) => {
        event.preventDefault();



        if (!passwordsMatch) {
            alert(translate(lang, 'passwordsDoNotMatch'));
            return;
        }

        if (user.phone.length < 9 || user.phone.length > 13) {
            alert(translate(lang, 'phoneLengthError'));
            return;
        }

        const formData = new FormData();
        formData.append('name', user.name);
        formData.append('surname', user.surname);
        formData.append('email', user.email);
        formData.append('username', account.username);
        formData.append('password', account.password);
        formData.append('phoneNo', user.phone);
        formData.append('roles', type.toString().toUpperCase());
        formData.append('isTelegram', false);
        formData.append('ownerId', decodeUserToken().userId);
        if (globalStoreId !== null || type === 'Employee') {
            formData.append('storeIds', globalStoreId);
        } else if (type === 'Boss') {
            formData.append('storeIds', "");
        } else {
            alert(translate(lang, 'storeNotDefined'));
            return;
        }



        const fileInput = document.getElementById('photoInput');
        if (fileInput.files.length > 0) {
            formData.append('file', fileInput.files[0]);
        }

        try {
            const result = await addAccount(formData);
            if (type === 'Boss') {
                alert(translate(lang, 'accountRegisteredSuccess') + " " + translate(lang, 'continueWithCompany'));
                navigate(`/new-company/${result.id}`);
            } else {
                alert(translate(lang, 'accountRegisteredSuccess'));
                navigate(`/`);
            }
        } catch (error) {
            console.error("Error while registering the account:", error);
            alert(translate(lang, 'accountRegisterError'));
        }
    };

    useEffect(() => {
        if (globalStoreId === null && type === 'Employee') {
            alert(translate(lang, 'chooseStoreFirst'));
            navigate('/stores');
        }
    }, []);

    useEffect(() => {
        setPasswordsMatch(account.password && account.password_again && account.password === account.password_again);
    }, [account.password, account.password_again]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-5 my-10 w-full max-w-4xl bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    {type === 'Boss' ? translate(lang, 'register') : translate(lang, 'newEmployee')}
                </h2>
                <form className="space-y-6" onSubmit={handleRegister}>
                    <div className="product-fields">
                        <div className="field-pair">
                            <InputField
                                id="username"
                                label={translate(lang, 'username')}
                                name="username"
                                value={account.username}
                                onChange={e => setAccount(prevState => ({
                                    ...prevState,
                                    username: e.target.value
                                }))}
                            />
                            <InputField
                                id="password"
                                label={translate(lang, 'password')}
                                name="password"
                                type="password"
                                value={account.password}
                                onChange={e => setAccount(prevState => ({
                                    ...prevState,
                                    password: e.target.value
                                }))}
                            />
                        </div>
                        <div className="field-pair">
                            <InputField
                                id="password-again"
                                label={translate(lang, 'passwordAgain')}
                                name="password_again"
                                type="password"
                                value={account.password_again}
                                onChange={e => setAccount(prevState => ({
                                    ...prevState,
                                    password_again: e.target.value
                                }))}
                                passwordsMatch={passwordsMatch}
                            />
                            <InputField
                                id="phone"
                                label={translate(lang, 'phone')}
                                name="phone"
                                value={user.phone}
                                minLength="9"
                                maxLength="13"
                                className="block w-full mt-1"
                                required
                                onChange={e => setUser(prevState => ({
                                    ...prevState,
                                    phone: e.target.value
                                }))}
                            />
                        </div>
                    </div>

                    <h2 className="text-lg font-semibold leading-7 text-gray-900">{translate(lang, 'personalInformation')}</h2>
                    <div className="product-fields">
                        <div className="field-pair">
                            <InputField
                                id="first-name"
                                label={translate(lang, 'firstName')}
                                name="first-name"
                                value={user.name}
                                onChange={e => setUser(prevState => ({
                                    ...prevState,
                                    name: e.target.value
                                }))}
                            />
                            <InputField
                                id="last-name"
                                label={translate(lang, 'lastName')}
                                name="last-name"
                                value={user.surname}
                                onChange={e => setUser(prevState => ({
                                    ...prevState,
                                    surname: e.target.value
                                }))}
                            />
                        </div>
                        <div className="field-pair">
                            <InputField
                                id="email"
                                label={translate(lang, 'email')}
                                name="email"
                                type="email"
                                value={user.email}
                                onChange={e => setUser(prevState => ({
                                    ...prevState,
                                    email: e.target.value
                                }))}
                                customWidth="w-[412px]"
                            />
                            <div className="flex items-center gap-x-3 relative" style={{ left: '-7rem' }}>
                                <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
                                    {translate(lang, 'photo')}
                                </label>
                                <div className="mt-2 flex items-center gap-x-3">
                                    {photo ? (
                                        <img src={photo} alt="Profile" className="h-12 w-12 rounded-full" />
                                    ) : (
                                        <UserCircleIcon className="h-12 w-12 text-gray-300" aria-hidden="true" />
                                    )}
                                    <button
                                        type="button"
                                        className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                        onClick={triggerFileInput}
                                    >
                                        {translate(lang, 'changePhoto')}
                                    </button>
                                    <input
                                        type="file"
                                        id="photoInput"
                                        style={{ display: 'none' }}
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center mt-6">
                        <button
                            type="submit"
                            className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md"
                        >
                            {translate(lang, 'registerButton')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function InputField({ id, label, type = 'text', name, value, onChange, passwordsMatch = false, customWidth }) {
    return (
        <div className="mb-4 input-field">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label} <span className="text-red-500">*</span></label>
            <div className="mt-2">
                <div className={`flex items-center rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ${customWidth || 'sm:max-w-md'}`}>
                    <input
                        id={id}
                        name={name}
                        type={type}
                        className="block flex-1 border-0 bg-gray-100 py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        value={value}
                        onChange={onChange}
                    />
                    {name === 'password_again' && passwordsMatch && <CiCircleCheck className="text-green-500 ml-2" size="24px" />}
                </div>
            </div>
        </div>
    );
}
