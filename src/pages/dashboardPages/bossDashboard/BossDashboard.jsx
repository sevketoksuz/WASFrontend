// eslint-disable-next-line no-unused-vars
import React from 'react';
import Top3Employee from './Top3Employee';
import Top3Store from './Top3Store';
import {getLanguage, translate} from "../../../language/index.jsx";

const BossDashboard = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">
                {translate(getLanguage(), "bossDashboard")}
            </h1>
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="md:w-1/2 p-2 flex-1 h-max">
                    <Top3Employee />
                </div>
                <div className="md:w-1/2 p-2 flex-1 h-max">
                    <Top3Store />
                </div>
            </div>
        </div>
    );
};

export default BossDashboard;
