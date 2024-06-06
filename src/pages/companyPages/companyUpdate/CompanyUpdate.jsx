import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCompanyById, updateCompany } from '../../../api/company/CompanyApi';
import { decodeUserToken } from '../../../api/authentication/AuthenticationApi';
import { GlobalCompanyId } from "../../../api/company/GlobalCompanyId.jsx";
import {getLanguage, translate} from '../../../language';

const placeholderImage = 'src/assets/company-placeholder.png';

function CompanyUpdate() {
    const [photo, setPhoto] = useState(null);
    const { globalCompanyId } = useContext(GlobalCompanyId);
    const { id } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState({});
    const [imageUrl, setImageUrl] = useState(null);
    const lang = getLanguage();

    useEffect(() => {
        const fetchCompany = async () => {
            const decodedToken = decodeUserToken();
            if (decodedToken) {
                try {
                    const response = await getCompanyById(decodeUserToken().companyId || globalCompanyId.id);
                    setCompany(response.data);
                    if (response.data.resourceFile && response.data.resourceFile.data) {
                        setImageUrl(`data:image/jpeg;base64,${response.data.resourceFile.data}`);
                    }
                } catch (error) {
                    console.error("Error fetching company data:", error);
                    alert(translate(lang, 'companyFetchError'));
                    navigate('/companies');
                }
            } else {
                alert(translate(lang, 'companyIdError'));
                navigate('/login');
            }
        };
        fetchCompany();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCompany((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            setImageUrl(URL.createObjectURL(file));
            setCompany((prevState) => ({
                ...prevState,
                file: file
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateCompany(company, photo);
            alert(translate(lang, 'companyUpdateSuccess'));
            navigate('/companies');
        } catch (error) {
            alert(translate(lang, 'companyUpdateFailed'));
            console.error("Error updating company:", error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-5 bg-white shadow-lg rounded-lg mt-16">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">{translate(lang, 'editCompany')}</h1> {/* Güncellenen satır */}
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-6">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">{translate(lang, 'name')}</label> {/* Güncellenen satır */}
                    <input type="text" id="name" name="name" value={company.name || ''} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">{translate(lang, 'description')}</label> {/* Güncellenen satır */}
                    <textarea id="description" name="description" value={company.description || ''} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="taxLevel">{translate(lang, 'taxLevel')}</label> {/* Güncellenen satır */}
                    <input type="text" id="taxLevel" name="taxLevel" value={company.taxLevel || ''} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">{translate(lang, 'companyLogo')}</label> {/* Güncellenen satır */}
                    <input type="file" id="file" name="file" onChange={handleFileChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    {imageUrl && (
                        <div className="mt-2">
                            <img
                                src={imageUrl}
                                alt="Company Logo"
                                className="w-32 h-32 rounded-full shadow"
                                onError={(e) => { e.target.src = placeholderImage; }}
                            />
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-between">
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">{translate(lang, 'saveChanges')}</button> {/* Güncellenen satır */}
                    <button type="button" onClick={() => navigate('/companies')} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">{translate(lang, 'cancel')}</button> {/* Güncellenen satır */}
                </div>
            </form>
        </div>
    );
}

export default CompanyUpdate;
