import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { Send, MapPin, Mail, Phone, User } from 'lucide-react';

export const AboutAndContact = () => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      alert(t('commission.fill_all') || "Per favore compila tutti i campi.");
      return;
    }
    
    setSending(true);
    try {
        const response = await fetch("https://formspree.io/f/mojnnave", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                message,
                type: 'Contact Page Message'
            })
        });

        if (response.ok) {
            alert(t('commission.success_msg') || "Messaggio inviato con successo!");
            setName('');
            setEmail('');
            setMessage('');
        } else {
            alert(t('commission.error_msg') || "Errore nell'invio.");
        }
    } catch (error) {
        alert(t('commission.error_conn') || "Errore di connessione.");
    } finally {
        setSending(false);
    }
  };

  return (
  <div className="pt-32 pb-20 container mx-auto px-4 min-h-screen">
    {/* About Section */}
    <div className="flex flex-col md:flex-row gap-12 items-center mb-32">
      <div className="w-full md:w-1/2 relative group">
        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <img 
            src="https://cdn.shopify.com/s/files/1/0981/3465/5353/files/nano-banana-pro-_nanobanana.io_-1771432019191.png?v=1771432054" 
            alt="Dream3D Workshop" 
            className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
          />
          {/* Effetto luci arancioni in movimento */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-orange/20 to-transparent mix-blend-overlay animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,107,0,0.1),transparent_70%)] animate-pulse pointer-events-none"></div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -z-10 top-10 -left-10 w-32 h-32 bg-neon-orange/20 rounded-full blur-3xl"></div>
        <div className="absolute -z-10 -bottom-10 -right-10 w-40 h-40 bg-neon-blue/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="w-full md:w-1/2">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('about.title')} <span className="text-neon-orange">Dream3D</span>?</h1>
        <p className="text-lg text-gray-300 mb-6 leading-relaxed">
          {t('about.desc1')}
        </p>
        <p className="text-lg text-gray-300 mb-8 leading-relaxed">
          {t('about.desc2')}
        </p>
        <div className="grid grid-cols-2 gap-6">
          <div className="border-l-4 border-neon-orange pl-4">
            <div className="text-3xl font-bold text-white mb-1">2+</div>
            <div className="text-sm text-gray-400">{t('about.experience')}</div>
          </div>
          <div className="border-l-4 border-neon-orange pl-4">
            <div className="text-3xl font-bold text-white mb-1">50+</div>
            <div className="text-sm text-gray-400">{t('about.clients')}</div>
          </div>
        </div>
      </div>
    </div>

    {/* Contact Section */}
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center">{t('contact.title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-dark-surface p-6 rounded-xl border border-white/5 text-center hover:border-neon-orange/30 transition-colors group hover:-translate-y-1 duration-300">
          <div className="w-12 h-12 bg-dark-bg rounded-full flex items-center justify-center mx-auto mb-4 text-neon-orange group-hover:scale-110 transition-transform">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-white">{t('contact.email')}</h3>
          <p className="text-gray-400 mb-4 text-sm">{t('contact.email_desc')}</p>
          <a href="mailto:areainfodream3d@gmail.com" className="text-neon-orange hover:text-white transition-colors text-sm break-all">areainfodream3d@gmail.com</a>
        </div>
        
        <div className="bg-dark-surface p-6 rounded-xl border border-white/5 text-center hover:border-neon-orange/30 transition-colors group hover:-translate-y-1 duration-300">
          <div className="w-12 h-12 bg-dark-bg rounded-full flex items-center justify-center mx-auto mb-4 text-neon-orange group-hover:scale-110 transition-transform">
            <Phone className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-white">{t('contact.phone')}</h3>
          <p className="text-gray-400 mb-4 text-sm">{t('contact.phone_desc')}</p>
          <a href="tel:+393514609532" className="text-neon-orange hover:text-white transition-colors">+39 351 460 9532</a>
        </div>
        
        <div className="bg-dark-surface p-6 rounded-xl border border-white/5 text-center hover:border-neon-orange/30 transition-colors group hover:-translate-y-1 duration-300">
          <div className="w-12 h-12 bg-dark-bg rounded-full flex items-center justify-center mx-auto mb-4 text-neon-orange group-hover:scale-110 transition-transform">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-white">{t('contact.location')}</h3>
          <p className="text-gray-400 mb-4 text-sm">{t('contact.location_desc')}</p>
          <span className="text-white block">Treviso, Italia</span>
        </div>
      </div>

      <div className="bg-dark-surface p-8 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-orange/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <h2 className="text-2xl font-bold mb-8 text-center relative z-10">{t('contact.form_title')}</h2>
        <form className="max-w-2xl mx-auto space-y-6 relative z-10" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">{t('contact.name')}</label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-neon-orange transition-colors" />
                <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-dark-bg border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-neon-orange outline-none transition-all focus:shadow-[0_0_10px_rgba(255,107,0,0.2)]" 
                    placeholder={t('contact.name_placeholder')} 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">{t('contact.email')}</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-neon-orange transition-colors" />
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-dark-bg border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-neon-orange outline-none transition-all focus:shadow-[0_0_10px_rgba(255,107,0,0.2)]" 
                    placeholder={t('contact.email_placeholder')} 
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">{t('contact.message')}</label>
            <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neon-orange outline-none transition-all focus:shadow-[0_0_10px_rgba(255,107,0,0.2)] h-40 resize-none" 
                placeholder={t('contact.message_placeholder')} 
            />
          </div>
          <div className="text-center">
            <Button size="lg" className="w-full md:w-auto px-12 shadow-[0_0_15px_rgba(255,107,0,0.3)] hover:shadow-[0_0_25px_rgba(255,107,0,0.5)]" disabled={sending}>
              {sending ? t('commission.sending') || "Invio..." : <>{t('contact.submit')} <Send className="w-4 h-4 ml-2" /></>}
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
};
