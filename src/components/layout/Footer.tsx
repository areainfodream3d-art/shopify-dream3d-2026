import React from 'react';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, Share2, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';

export const Footer = () => {
  const { t } = useTranslation();
  
  const shareUrl = "https://www.dream-3d.com/"; // URL ufficiale del sito

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Dream3D - Stampa 3D Professionale',
          text: 'Dai forma alle tue idee con Dream3D. Stampa 3D di alta qualità in PLA e Resina.',
          url: shareUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copia negli appunti
      navigator.clipboard.writeText(shareUrl);
      alert('Link copiato negli appunti!');
    }
  };

  return (
    <footer className="bg-dark-surface border-t border-white/10 mt-20">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link to="/" className="flex items-center">
              <span className="self-center text-2xl font-bold whitespace-nowrap text-white">
                DREAM<span className="text-neon-orange">3D</span>
              </span>
            </Link>
            <p className="mt-4 text-gray-400 max-w-xs">
              {t('footer.description')}
            </p>
            
            {/* Share Button */}
            <div className="mt-6">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleShare}
                className="flex items-center gap-2 border-white/20 hover:border-neon-orange hover:text-neon-orange"
              >
                <Share2 className="w-4 h-4" />
                <span>{t('common.share')} Dream3D</span>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-white uppercase">{t('footer.resources')}</h2>
              <ul className="text-gray-400 font-medium space-y-4">
                <li>
                  <Link to="/shop" className="hover:text-neon-orange block py-1">{t('navbar.shop')}</Link>
                </li>
                <li>
                  <Link to="/commissioni" className="hover:text-neon-orange block py-1">{t('navbar.commissions')}</Link>
                </li>
                <li>
                  <Link to="/blog" className="hover:text-neon-orange block py-1">{t('common.blog')}</Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-white uppercase">{t('footer.legal')}</h2>
              <ul className="text-gray-400 font-medium space-y-4">
                <li>
                  <Link to="/privacy" className="hover:text-neon-orange block py-1">{t('common.privacy')}</Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-neon-orange block py-1">{t('common.terms')}</Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-white uppercase">{t('footer.contacts')}</h2>
              <ul className="text-gray-400 font-medium space-y-4">
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-neon-orange flex-shrink-0" />
                  <span>Treviso, Italia</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-neon-orange flex-shrink-0" />
                  <a href="mailto:areainfodream3d@gmail.com" className="hover:text-neon-orange transition-colors break-all">areainfodream3d@gmail.com</a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-neon-orange flex-shrink-0" />
                  <a href="tel:+393514609532" className="hover:text-neon-orange transition-colors">+39 351 460 9532</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-center">
            <div className="flex items-center gap-2 text-gray-300">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6 opacity-80" />
              <img src="https://cdn.icon-icons.com/icons2/2341/PNG/512/visa_payment_method_card_icon_142729.png" alt="Visa" className="h-4 bg-white px-1 rounded opacity-80" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5 bg-white px-1 rounded opacity-80" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple Pay" className="h-5 bg-white px-1 rounded opacity-80" />
            </div>
            <div className="flex items-center gap-2 text-neon-blue animate-pulse">
              <span className="text-sm font-bold uppercase tracking-wider">{t('footer.shipping')}</span>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-700 sm:mx-auto lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-400 sm:text-center">
            © 2026 <a href="https://www.dream-3d.com/" className="hover:underline">Dream3D™</a>. {t('footer.rights')}
          </span>
          <div className="flex mt-4 sm:justify-center sm:mt-0 space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Facebook className="w-5 h-5" />
              <span className="sr-only">Facebook page</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Instagram className="w-5 h-5" />
              <span className="sr-only">Instagram page</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
              <span className="sr-only">Twitter page</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
