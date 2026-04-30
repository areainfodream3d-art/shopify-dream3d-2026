import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, Globe, Settings } from 'lucide-react';
import { Button } from '../ui/Button';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useTranslation } from 'react-i18next';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { user, loading } = useUserProfile();

  const navLinks = [
    { name: t('navbar.home'), path: '/' },
    { name: t('navbar.shop'), path: '/shop' },
    { name: t('navbar.commissions'), path: '/commissioni' },
    { name: 'Soluzioni Ingegneristiche', path: '/soluzioni-ingegneristiche' },
    { name: t('navbar.about'), path: '/chi-siamo' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const languages = [
    { code: 'it', label: 'IT', flag: '🇮🇹' },
    { code: 'en', label: 'EN', flag: '🇬🇧' },
    { code: 'es', label: 'ES', flag: '🇪🇸' },
    { code: 'de', label: 'DE', flag: '🇩🇪' },
    { code: 'fr', label: 'FR', flag: '🇫🇷' },
    { code: 'ru', label: 'RU', flag: '🇷🇺' },
    { code: 'zh', label: 'ZH', flag: '🇨🇳' },
  ];

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false); // Chiude il menu mobile se aperto
  };

  return (
    <nav className="fixed w-full z-50 top-0 start-0 border-b border-white/10 bg-dark-bg/80 backdrop-blur-md">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse group">
          <span className="self-center text-2xl font-bold whitespace-nowrap text-white tracking-tighter group-hover:text-neon-orange transition-colors flex items-center">
            DREAM
            <span className="relative ml-0.5 text-neon-orange inline-block">
              <span className="absolute inset-0 animate-[build-layer_30s_ease-out_infinite] bg-clip-text text-transparent bg-gradient-to-t from-neon-orange to-neon-fire z-10" style={{ clipPath: 'inset(0 0 0 0)' }}>3D</span>
              <span className="opacity-30">3D</span>
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-neon-orange shadow-[0_0_8px_#ff6b00] animate-[scan-line_30s_ease-in-out_infinite]"></span>
            </span>
          </span>
        </Link>
        
        <div className="flex md:order-2 space-x-3 md:space-x-4 rtl:space-x-reverse items-center">
          {/* Language Dropdown (Desktop) */}
          <div className="relative group hidden md:block">
            <button className="text-gray-300 hover:text-neon-orange transition-colors flex items-center gap-1">
              <Globe className="w-5 h-5" />
              <span className="text-sm font-bold uppercase">{i18n.language.split('-')[0]}</span>
            </button>
            <div className="absolute right-0 mt-2 w-32 bg-dark-surface border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
              <ul className="py-1">
                {languages.map((lang) => (
                  <li key={lang.code}>
                    <button
                      onClick={() => changeLanguage(lang.code)}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-white/5 hover:text-neon-orange transition-colors flex items-center gap-2 ${i18n.language.startsWith(lang.code) ? 'text-neon-orange font-bold' : 'text-gray-300'}`}
                    >
                      <span className="text-lg">{lang.flag}</span> {lang.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Mobile Language Toggle (Simple Cycle) */}
          <button 
            onClick={() => {
              const currentIndex = languages.findIndex(l => l.code === i18n.language.split('-')[0]);
              const nextIndex = (currentIndex + 1) % languages.length;
              changeLanguage(languages[nextIndex].code);
            }}
            className="md:hidden text-gray-300 hover:text-neon-orange transition-colors flex items-center gap-1"
          >
            <Globe className="w-5 h-5" />
            <span className="text-sm font-bold uppercase">{i18n.language.split('-')[0]}</span>
          </button>

          <Link to="/carrello" className="relative text-gray-300 hover:text-neon-orange transition-colors">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-neon-fire text-white text-xs font-bold px-1.5 py-0.5 rounded-full">0</span>
          </Link>
          {/* Mostra login solo se non autenticato, altrimenti mostra impostazioni profilo */}
          {!loading && !user && (
            <Link to="/login" className="text-gray-300 hover:text-neon-orange transition-colors hidden md:block">
              <User className="w-6 h-6" />
            </Link>
          )}
          {!loading && user && (
            <Link to="/user" className="text-gray-300 hover:text-neon-orange transition-colors hidden md:block flex items-center gap-2">
              <Settings className="w-6 h-6" />
              <span className="text-sm font-bold">{user.email}</span>
            </Link>
          )}
          <Link to="/preventivo" className="hidden md:flex">
            <Button variant="primary" size="sm">
              {t('navbar.quote')}
            </Button>
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-400 rounded-lg md:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <div className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isOpen ? 'block' : 'hidden'}`}>
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-700 rounded-lg bg-dark-surface md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`block py-2 px-3 rounded md:p-0 transition-colors ${
                    isActive(link.path)
                      ? 'text-neon-orange bg-gray-700 md:bg-transparent'
                      : 'text-gray-300 hover:text-white md:hover:text-neon-orange hover:bg-gray-700 md:hover:bg-transparent'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};
