import { Link } from 'react-router-dom';
import { FaBox, FaHome, FaStore, FaBuilding, FaList } from 'react-icons/fa';
import logo from '../../assets/logowis.png';
import { useEffect, useState } from "react";
import { decodeUserToken } from "../../api/authentication/AuthenticationApi.jsx";
import { getLanguage, translate } from '../../language';

const Sidebar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const decodedToken = decodeUserToken();
        if (decodedToken) {
            setIsLoggedIn(true);
            setUserRole(decodedToken.roles[0]); // Assuming the first role is the primary role
        }
    }, []);

    return (
        <div className="fixed top-0 bottom-0 left-0 z-30 w-64 bg-gray-900 text-gray-100 rounded-br-lg shadow-colorful-r">
            <div className="flex items-center justify-center p-2 border-b border-gray-700">
                <img
                    className="h-12 w-auto"
                    src={logo}
                    alt="Warehouse Information Systems Logo"
                />
            </div>
            {isLoggedIn &&
                <nav>
                    <ul className="mt-4 space-y-2">
                        <li className="px-6 pb-2 border-b border-gray-700 flex items-center">
                            <FaHome className="mr-4"/> {/* Home icon */}
                            <Link to="/" className="flex-grow text-white hover:text-blue-500">
                                {translate(getLanguage(), 'home')}
                            </Link>
                        </li>
                        {(userRole === 'BOSS' || userRole == 'ADMIN') &&
                            <li className="px-6 py-2 border-b border-gray-700 flex items-center">
                                <FaStore className="mr-4"/> {/* Stores icon */}
                                <Link to="/stores" className="flex-grow text-white hover:text-blue-500">
                                    {translate(getLanguage(), 'stores')}
                                </Link>
                            </li>
                        }
                        {(userRole === 'ADMIN') &&
                            <li className="px-6 py-2 border-b border-gray-700 flex items-center">
                                <FaBuilding className="mr-4"/> {/* Companies icon */}
                                <Link to="/companies" className="flex-grow text-white hover:text-blue-500">
                                    {translate(getLanguage(), 'companies')}
                                </Link>
                            </li>
                        }
                        <li className="px-6 py-2 border-b border-gray-700 flex items-center">
                            <FaList className="mr-4"/> {/* Category icon */}
                            <Link to="/categories" className="flex-grow text-white hover:text-blue-500">
                                {translate(getLanguage(), 'categories')}
                            </Link>
                        </li>
                        <li className="px-6 py-2 border-b border-gray-700 flex items-center">
                            <FaBox className="mr-4"/> {/* Products icon */}
                            <Link to="/product-list" className="flex-grow text-white hover:text-blue-500">
                                {translate(getLanguage(), 'products')}
                            </Link>
                        </li>
                    </ul>
                </nav>
            }
        </div>
    );
};

export default Sidebar;
