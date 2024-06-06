import Cookies from 'js-cookie';
import resources from "./resources.jsx";

export const translate = (lang, key) => {
    var translation;
    if (lang) {
        const translated = resources[lang][key];
        if (translated) {
            translation = translated;
        } else {
            translation = resources["en"][key];
        }
    } else {
        translation = resources["en"][key];
    }
    return translation;
};

export const getLanguage = () => {
    const lang = Cookies.get('lng');
    return lang || 'en';
};
