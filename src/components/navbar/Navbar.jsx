import { Fragment, useEffect, useState, useContext } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { logout, decodeUserToken } from "../../api/authentication/AuthenticationApi.jsx";
import { getUserPhoto } from "../../api/resource/ResourceApi.jsx";
import { format } from 'date-fns';
import { useNavigate, useLocation } from 'react-router-dom';
import { GlobalStoreId } from "../../api/store/GlobalStoreId.jsx";
import { GlobalCompanyId } from "../../api/company/GlobalCompanyId.jsx";
import { getTop3NotifiticationsByUserId, markNotificationIsSeen } from "../../api/notification/NotificationApi.jsx";
import User from '../../assets/user.webp';
import LanguageDropdown from './LanguageDropdown'; // LanguageDropdown bileşenini içe aktarın
import { getLanguage, translate } from '../../language';

const token = decodeUserToken() || { roles: [] };
const navigation = [
    { name: translate(getLanguage(),'dashboard'), href: token.roles[0] === 'BOSS' ? '/boss-dashboard' : '/store', current: false },
    ...((token.roles[0] === 'MANAGER' || token.roles[0] === 'BOSS'|| token.roles[0] === 'ADMIN') ? [{ name: translate(getLanguage(),'team'), href: '/store-employees', current: false }] : []),
    ...((token.roles[0] === 'BOSS'|| token.roles[0] === 'ADMIN') ? [{ name: translate(getLanguage(),'newStore'), href: '/add-store', current: false }] : []),
    ...((token.roles[0] === 'BOSS' || token.roles[0] === 'ADMIN') ? [{ name: translate(getLanguage(),'newEmployee'), href: '/employee-register', current: false }] : []),
    ...(token.roles[0] === 'ADMIN' ? [{ name: translate(getLanguage(),'newBoss'), href: '/register', current: false }] : []),
];


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

// Helper function to get notification level color
const getNotificationLevelColor = (level) => {
    switch (level) {
        case 'INFO':
            return 'text-blue-800 bg-blue-100';
        case 'SUCCESS':
            return 'text-green-800 bg-green-100';
        case 'ERROR':
            return 'text-red-800 bg-red-100';
        case 'WARNING':
            return 'text-yellow-800 bg-yellow-100';
        default:
            return '';
    }
};

function Navbar() {
    const [photo, setPhoto] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentNav, setCurrentNav] = useState(navigation);
    const navigate = useNavigate();
    const location = useLocation();
    const [notifications, setNotifications] = useState([]);
    const { setGlobalStoreId } = useContext(GlobalStoreId);
    const { setGlobalCompanyId } = useContext(GlobalCompanyId);

    useEffect(() => {
        const decodedToken = decodeUserToken();
        if (decodedToken) {
            getTop3NotifiticationsByUserId(decodedToken.userId)
                .then(response => {
                    setNotifications(response.data);
                })
                .catch(error => {
                    console.error('Failed to load notifications', error);
                });
        }
    }, []);

    const viewAllNotifications = () => {
        navigate('/notifications');
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
    }

    const handleLogout = () => {
        setGlobalStoreId(null);
        setGlobalCompanyId(null);
        logout();
    }

    useEffect(() => {
        const decodedToken = decodeUserToken();
        if (decodedToken) {
            setIsLoggedIn(true);
            try {
                getUserPhoto(decodedToken.userId)
                    .then(response => {
                        setPhoto(URL.createObjectURL(response.data));
                    });
            } catch (error) {
                console.error('Failed to load user photo', error);
            }
        }
    }, []);

    useEffect(() => {
        const updatedNavigation = navigation.map(item => ({
            ...item,
            current: item.href === location.pathname,
        }));
        setCurrentNav(updatedNavigation);
    }, [location.pathname]);


    return (
        <Disclosure as="nav" className="bg-gray-900 sticky top-0 z-50 ml-64 shadow-colorful-b">
            {({ open }) => (
                <>
                    <div className="mx-auto px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                {/* Mobile menu button*/}
                                {isLoggedIn && <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                    <span className="absolute -inset-0.5" />
                                    <span className="sr-only">
                                        {translate(getLanguage(), 'openMainMenu')}
                                    </span>
                                    {open ? (
                                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </Disclosure.Button>}
                            </div>
                            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                {isLoggedIn && <div className="hidden sm:ml-6 sm:block">
                                    <div className="flex space-x-4">
                                        {currentNav.map((item) => (
                                            <a
                                                key={item.name}
                                                href={item.href}
                                                className={classNames(
                                                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                    'rounded-md px-3 py-2 text-sm font-medium'
                                                )}
                                                aria-current={item.current ? 'page' : undefined}
                                            >
                                                {item.name}
                                            </a>
                                        ))}
                                    </div>
                                </div>}
                            </div>
                            {isLoggedIn ? (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                    <Menu as="div" className="relative">
                                        <div>
                                            <Menu.Button className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                                <span className="absolute -inset-1.5" />
                                                <span className="sr-only">
                                                    {translate(getLanguage(), 'viewNotifications')}
                                                </span>
                                                <BellIcon className="h-6 w-6" aria-hidden="true" />
                                            </Menu.Button>
                                        </div>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                {notifications.slice(0, 3).map((notification, index) => (
                                                    <Menu.Item key={index}>
                                                        {({ active }) => (
                                                            <a
                                                                onClick={() => handleMarked(notification.id)}
                                                                className={classNames(
                                                                    active ? 'bg-gray-100' : '',
                                                                    'block px-4 py-2 text-sm text-gray-700 relative'
                                                                )}
                                                            >
                                                                {!notification.isSeen && (
                                                                    <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full" />
                                                                )}
                                                                <div
                                                                    className={classNames(
                                                                        'px-2 py-1 rounded-full text-xs font-semibold mb-1 inline-block',
                                                                        getNotificationLevelColor(notification.notificationLevel[0])
                                                                    )}
                                                                >
                                                                    {notification.notificationLevel[0]}
                                                                </div>
                                                                <div className="font-bold">{notification.subject}</div>
                                                                <div className="text-xs text-gray-500">{notification.description}</div>
                                                                <div className="text-xs text-gray-400">
                                                                    {format(new Date(notification.recordDate), 'PPP')}
                                                                </div>
                                                            </a>
                                                        )}
                                                    </Menu.Item>
                                                ))}
                                                {notifications.length > 2 && (
                                                    <div
                                                        className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                                                        onClick={viewAllNotifications}
                                                    >
                                                        {translate(getLanguage(), 'viewAllNotifications')}
                                                    </div>
                                                )}
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>

                                    {/* Profile dropdown */}
                                    <Menu as="div" className="relative ml-3">
                                        <div>
                                            <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                                <span className="absolute -inset-1.5" />
                                                <span className="sr-only">
                                                    {translate(getLanguage(), 'openUserMenu')}
                                                </span>
                                                <img
                                                    className="h-8 w-8 rounded-full"
                                                    src={photo || User}
                                                    alt=""
                                                />
                                            </Menu.Button>
                                        </div>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <a
                                                            href="/profile"
                                                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                        >
                                                            {translate(getLanguage(), 'yourProfile')}
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <a
                                                            href="/settings"
                                                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                        >
                                                            {translate(getLanguage(), 'settings')}
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <a
                                                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                            onClick={() => handleLogout()}
                                                        >
                                                            {translate(getLanguage(), 'logOut')}
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                    <LanguageDropdown />
                                </div>
                            ) : (
                                <div>
                                    <a
                                        href="/login"
                                        className={classNames(
                                            'text-gray-300 hover:bg-gray-700 hover:text-white',
                                            'rounded-md px-3 py-2 text-sm font-medium'
                                        )}
                                    >
                                        {translate(getLanguage(), 'login')}
                                    </a>
                                    <LanguageDropdown/>
                                </div>

                            )}
                        </div>
                    </div>

                    <Disclosure.Panel className="sm:hidden">
                        <div className="space-y-1 px-2 pb-3 pt-2">
                            {currentNav.map((item) => (
                                <Disclosure.Button
                                    key={item.name}
                                    as="a"
                                    href={item.href}
                                    className={classNames(
                                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                        'block rounded-md px-3 py-2 text-base font-medium'
                                    )}
                                    aria-current={item.current ? 'page' : undefined}
                                >
                                    {item.name}
                                </Disclosure.Button>
                            ))}
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    )
}

export default Navbar;
