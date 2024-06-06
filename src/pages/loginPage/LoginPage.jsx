import { useState } from 'react';
import { FaUser, FaLock } from "react-icons/fa";
import { login } from '../../api/authentication/AuthenticationApi.jsx';
import logo from '../../assets/wislogo.png';
import background from '../../assets/WASBackground.jpg';
import 'tailwindcss/tailwind.css';
import { getLanguage, translate } from '../../language';

const LoginPage = () => {
  const [authenticate, setAuthenticate] = useState({ username: '', password: '' });

  const handleLogin = async () => {
    try {
      await login(authenticate.username, authenticate.password);
      window.location.href = '/';
    } catch (error) {
      const message = error.message === "Unexpected error: User not found"
          ? translate(getLanguage(), 'loginFailedUserNotFound')
          : translate(getLanguage(), 'loginFailedPasswordWrong');
      alert(message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
      <section
          className="bg-gray-100 min-h-screen flex box-border justify-center items-center font-roboto-slab"
          style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="bg-white/60 border border-gray-300 backdrop-blur-md shadow-lg rounded-2xl flex max-w-4xl p-5 items-center">
          <div className="md:w-1/2 px-12">
            <h2 className="font-bold text-3xl text-[#2C2C2C]">{translate(getLanguage(), 'login')}</h2>
            <p className="text-gray-500 mt-2">{translate(getLanguage(), 'welcomeBack')}</p>
            <form className="flex flex-col gap-4" onKeyDown={handleKeyDown}>
              <div className="flex items-center border border-gray-300 rounded-full">
                <FaUser className="ml-3 text-lg text-[#2C2C2C]" />
                <input
                    className="w-full h-12 bg-transparent outline-none pl-2 pr-10 rounded-full text-base text-[#2C2C2C] placeholder-[#2C2C2C]"
                    type="text"
                    placeholder={translate(getLanguage(), 'username')}
                    onChange={e => setAuthenticate({ ...authenticate, username: e.target.value })}
                />
              </div>

              <div className="relative flex items-center border border-gray-300 rounded-full">
                <FaLock className="ml-3 text-lg text-[#2C2C2C]" />
                <input
                    className="w-full h-12 bg-transparent outline-none pl-2 pr-10 rounded-full text-base text-[#2C2C2C] placeholder-[#2C2C2C]"
                    type="password"
                    placeholder={translate(getLanguage(), 'password')}
                    onChange={e => setAuthenticate({ ...authenticate, password: e.target.value })}
                />
              </div>
              <button
                  className="w-full h-11 bg-gray-800 rounded-full shadow text-base text-white font-semibold hover:bg-gray-900 transition-colors"
                  type="button"
                  onClick={handleLogin}
              >
                {translate(getLanguage(), 'login')}
              </button>
            </form>
          </div>

          <div className="md:block hidden w-1/2">
            <img className="rounded-2xl" src={logo} alt="logo" />
          </div>
        </div>
      </section>
  );
};

export default LoginPage;
