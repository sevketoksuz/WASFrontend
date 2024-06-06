import { useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { addCompany } from "../../../api/company/CompanyApi.jsx";
import {getLanguage, translate} from '../../../language';

export default function CompanyAdd() {
    const { bossId } = useParams();
    const [image, setImage] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [company, setCompany] = useState({
        name: '',
        description: '',
        taxLevel: '',
        userId: bossId
    });
    const navigate = useNavigate();
    const lang = getLanguage();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await addCompany(company, image);
            if (response) {
                alert(translate(lang, 'companyAddSuccess'));
                navigate('/');
            }
        } catch (error) {
            alert(translate(lang, 'companyAddFailed'));
            console.error("Error adding the company:", error);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-5 my-10 w-full max-w-xl bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    {translate(lang, 'companyRegistration')} {/* Güncellenen satır */}
                </h2>
                <form className="space-y-6" onSubmit={handleRegister}>
                    <InputField
                        id="name"
                        label={translate(lang, 'name')}
                        name="name"
                        value={company.name}
                        onChange={e => setCompany(prevState => ({
                            ...prevState,
                            name: e.target.value
                        }))}
                    />
                    <InputField
                        id="description"
                        label={translate(lang, 'description')}
                        name="description"
                        as="textarea"
                        value={company.description}
                        onChange={e => setCompany(prevState => ({
                            ...prevState,
                            description: e.target.value
                        }))}
                    />
                    <InputField
                        id="tax-level"
                        label={translate(lang, 'taxLevel')}
                        name="tax-level"
                        value={company.taxLevel}
                        onChange={e => setCompany(prevState => ({
                            ...prevState,
                            taxLevel: e.target.value
                        }))}
                    />
                    <div className="w-full mt-8">
                        <label htmlFor="imageFile" className="block mb-2 text-sm font-medium text-gray-700">
                            {translate(lang, 'companyImage')}
                        </label>
                        <input
                            id="imageFile"
                            name="imageFile"
                            type="file"
                            className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                            onChange={(event) => {
                                const file = event.target.files[0];
                                if (file) {
                                    setImage(file);
                                    const reader = new FileReader();
                                    reader.onload = (e) => {
                                        setPhoto(e.target.result);
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />
                        <p className="mt-1 text-sm text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px).</p>
                        {photo && (
                            <img
                                src={photo}
                                className="rounded-lg w-full object-cover mt-2"
                                style={{ maxHeight: '400px' }}
                            />
                        )}
                    </div>
                    <div className="flex justify-center mt-6">
                        <button
                            type="submit"
                            className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md"
                        >
                            {translate(lang, 'register')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function InputField({ id, label, type = 'text', name, value, onChange, as = 'input' }) {
    const Component = as;
    return (
        <div className="mb-4 input-field">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <div className="mt-2">
                <div className="flex items-center rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <Component
                        id={id}
                        name={name}
                        type={type}
                        className={`block w-full border-0 bg-gray-100 py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 ${as === 'textarea' ? 'h-32 resize-none' : ''}`}
                        value={value}
                        onChange={onChange}
                    />
                </div>
            </div>
        </div>
    );
}
