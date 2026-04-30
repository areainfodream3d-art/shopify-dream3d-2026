import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Send, MessageSquare, Upload, CreditCard } from 'lucide-react';
import { commissionExamples } from '../data/mockData';
import { Commission3DViewer } from '../components/3d/Commission3DViewer';
import { useTranslation } from 'react-i18next';
import { PayPalPayment } from '../components/ui/PayPalPayment';

export const Commission = () => {
  const { t } = useTranslation();
  const [customModelUrl, setCustomModelUrl] = useState<string | null>(null);
  const [modelName, setModelName] = useState("Drago dell'Etere");
  const [modelDesc, setModelDesc] = useState('"Drago, dungeon, tesori"');
  
  const [ideaText, setIdeaText] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactDesc, setContactDesc] = useState("");
  const [sending, setSending] = useState(false);

  // PayPal State
  const [showPayment, setShowPayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomModelUrl(url);
      setModelName(file.name.replace(/\.[^/.]+$/, ""));
      setModelDesc("Modello caricato dall'utente");
    }
  };

  const handleSendIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaText.trim()) return;
    
    setSending(true);
    
    try {
      // Use Formspree for Idea submission
      // Using same ID as contact form for now: mojnnave
      const response = await fetch("https://formspree.io/f/mojnnave", { 
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          message: ideaText,
          type: 'New Idea Submission'
        })
      });

      if (response.ok) {
        alert(`Grazie! Abbiamo ricevuto la tua idea: "${ideaText}". Ti contatteremo presto.`);
        setIdeaText("");
      } else {
        alert("C'è stato un problema nell'invio. Riprova più tardi.");
      }
    } catch (error) {
      alert("Errore di connessione.");
    } finally {
      setSending(false);
    }
  };

  const handleSendContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactDesc.trim()) {
        alert("Per favore compila tutti i campi.");
        return;
    }

    setSending(true);
    
    try {
      // Use Formspree for Contact submission
      // ID: mojnnave
      const response = await fetch("https://formspree.io/f/mojnnave", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          message: contactDesc,
          type: 'Quote Request'
        })
      });

      if (response.ok) {
        alert(t('commission.success_msg'));
        setContactName("");
        setContactEmail("");
        setContactDesc("");
      } else {
        const data = await response.json();
        console.error('Formspree error:', data);
        alert(t('commission.error_msg'));
      }
    } catch (error) {
      console.error('Network error:', error);
      alert(t('commission.error_conn'));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="pt-32 pb-20 container mx-auto px-4 min-h-screen">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Realizza la tua <span className="text-neon-orange">Idea</span></h1>
        <p className="text-xl text-gray-300">
          {t('commission.subtitle')}
        </p>
      </div>

      <div className="mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl font-bold mb-6">{t('commission.title')}</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {t('commission.subtitle')}
            </p>
            
            <div className="flex flex-col gap-4">
              <div className="mt-4 p-4 bg-dark-surface rounded-xl border border-white/10">
                <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-neon-orange" /> {t('commission.upload_title')}
                </h3>
                <p className="text-sm text-gray-400 mb-3">{t('commission.upload_desc')}</p>
                <input 
                  type="file" 
                  accept=".glb,.gltf" 
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-neon-orange/10 file:text-neon-orange
                    hover:file:bg-neon-orange/20
                    cursor-pointer"
                />
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <Commission3DViewer 
              modelUrl={customModelUrl || "https://models.readyplayer.me/64f0263b86504a507755607e.glb"} 
              modelName={modelName}
              modelDesc={modelDesc}
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mb-20">
        <div className="bg-dark-surface p-8 rounded-2xl border border-white/5 shadow-xl">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 justify-center text-center">
            <MessageSquare className="text-neon-orange" /> {t('commission.quote_title')}
          </h2>
          <form onSubmit={handleSendContact} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">{t('commission.name')}</label>
              <input 
                type="text" 
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-orange outline-none transition-colors" 
                placeholder={t('commission.name_placeholder')}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">{t('commission.email')}</label>
              <input 
                type="email" 
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-orange outline-none transition-colors" 
                placeholder={t('commission.email_placeholder')}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">{t('commission.desc')}</label>
              <textarea 
                value={contactDesc}
                onChange={(e) => setContactDesc(e.target.value)}
                className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-orange outline-none transition-colors h-32" 
                placeholder={t('commission.desc_placeholder')}
                required
              />
            </div>
            <Button className="w-full" type="submit" disabled={sending}>
              {sending ? t('commission.sending') : <>{t('commission.send')} <Send className="w-4 h-4 ml-2" /></>}
            </Button>
          </form>
        </div>
      </div>

      {/* Payment Section */}
      <div className="max-w-4xl mx-auto mb-20 relative">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-neon-orange/5 blur-3xl rounded-full -z-10"></div>
        
        <div className="bg-dark-surface/80 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/10 shadow-[0_0_40px_rgba(255,107,0,0.1)] text-center relative overflow-hidden group hover:border-neon-orange/30 transition-all duration-500">
           {/* Animated border gradient */}
           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-orange/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>

           <div className="relative z-10">
             <div className="w-16 h-16 bg-gradient-to-br from-neon-orange to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3 group-hover:rotate-0 transition-transform duration-300">
               <CreditCard className="w-8 h-8 text-white" />
             </div>
             
             <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
               {t('commission.payment_title') || "Area Pagamenti"}
             </h2>
             <p className="text-gray-400 mb-8 max-w-lg mx-auto text-lg leading-relaxed">
               {t('commission.payment_desc') || "Hai ricevuto un preventivo? Completa il pagamento dell'acconto o del saldo in modo sicuro e veloce."}
             </p>
             
             {!showPayment ? (
               <Button 
                  size="xl" 
                  onClick={() => setShowPayment(true)}
                  className="bg-gradient-to-r from-neon-orange to-red-500 hover:from-neon-orange/90 hover:to-red-500/90 text-white border-0 shadow-[0_0_20px_rgba(255,107,0,0.4)] hover:shadow-[0_0_30px_rgba(255,107,0,0.6)] transform hover:-translate-y-1 transition-all duration-300 px-12 py-6 text-lg rounded-full"
               >
                  {t('commission.pay_now') || "Procedi al Pagamento Sicuro"}
               </Button>
             ) : (
               <div className="max-w-md mx-auto animate-in fade-in zoom-in-95 duration-500 bg-black/40 p-8 rounded-2xl border border-white/5 backdrop-blur-sm">
                  {!paymentSuccess ? (
                      <div className="space-y-8">
                          <div className="relative">
                              <label className="block text-sm font-bold text-neon-orange uppercase tracking-wider mb-3">{t('commission.payment_amount') || "Importo da pagare"}</label>
                              <div className="relative flex items-center justify-center">
                                <span className="absolute left-4 text-2xl text-gray-500">€</span>
                                <input 
                                    type="number" 
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                    className="w-full bg-dark-bg/50 border border-white/20 rounded-xl px-12 py-4 text-white text-center text-3xl font-bold focus:border-neon-orange focus:ring-2 focus:ring-neon-orange/20 outline-none transition-all placeholder-gray-700" 
                                    placeholder="0.00"
                                    min="1"
                                    step="0.01"
                                />
                              </div>
                          </div>
                          
                          <div className={`transition-all duration-500 ${paymentAmount && parseFloat(paymentAmount) > 0 ? 'opacity-100 translate-y-0' : 'opacity-50 grayscale pointer-events-none'}`}>
                              <PayPalPayment 
                                  amount={paymentAmount} 
                                  onSuccess={(details) => {
                                      setPaymentSuccess(true);
                                      console.log("Payment successful", details);
                                      // alert(`Pagamento di €${paymentAmount} completato con successo! Grazie ${details.payer.name.given_name}.`);
                                  }}
                                  onError={(err) => {
                                      alert("Errore durante il pagamento. Riprova.");
                                  }}
                              />
                          </div>
                          
                          <button 
                              onClick={() => setShowPayment(false)}
                              className="text-sm text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto group/back"
                          >
                              <span className="group-hover/back:-translate-x-1 transition-transform">←</span> {t('common.back') || "Torna indietro"}
                          </button>
                      </div>
                  ) : (
                      <div className="text-center py-4">
                          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-300 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                              <Send className="w-10 h-10 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-3">{t('commission.payment_success_title') || "Pagamento Ricevuto!"}</h3>
                          <p className="text-gray-300 mb-8">{t('commission.payment_success_desc') || "Grazie! La transazione è andata a buon fine. Abbiamo inviato la ricevuta alla tua email."}</p>
                          <Button 
                            variant="outline"
                            onClick={() => {
                              setPaymentSuccess(false);
                              setShowPayment(false);
                              setPaymentAmount("");
                            }}
                          >
                              {t('commission.new_payment') || "Effettua un altro pagamento"}
                          </Button>
                      </div>
                  )}
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};
