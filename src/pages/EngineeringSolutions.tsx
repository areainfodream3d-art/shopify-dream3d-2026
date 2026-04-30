import React, { useState } from 'react';
import Printer3DAnimation from '../components/ui/Printer3DAnimation';
import { mockProducts } from '../data/mockData';

const sectors = [
  { name: 'Alimenti e Bevande', icon: '🍞' },
  { name: 'Acciaio', icon: '🔩' },
  { name: 'Chimica', icon: '⚗️' },
  { name: 'Imballaggi', icon: '📦' },
  { name: 'Riciclaggio', icon: '♻️' },
  { name: 'Agricoltura', icon: '🌾' },
];

const services = [
  {
    title: 'Progettazione Meccanica',
    desc: 'Dall’idea al modello 3D, sviluppiamo soluzioni su misura per ogni esigenza industriale.'
  },
  {
    title: 'Impianti Chiavi in Mano',
    desc: 'Gestione completa del progetto: progettazione, realizzazione e avviamento di impianti industriali.'
  },
  {
    title: 'Automazione Industriale',
    desc: 'Soluzioni di automazione per aumentare efficienza, sicurezza e affidabilità dei processi.'
  },
  {
    title: 'Macchine Speciali',
    desc: 'Progettazione e costruzione di macchinari personalizzati per esigenze specifiche.'
  },
  {
    title: 'Ricerca & Sviluppo',
    desc: 'Innovazione continua per offrire tecnologie all’avanguardia e soluzioni uniche.'
  },
  {
    title: 'Produzione & Fabbricazione',
    desc: 'Dalla prototipazione rapida alla produzione in serie, con materiali di alta qualità.'
  },
];


export default function EngineeringSolutions() {
  // Preventivo form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactDesc, setContactDesc] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactDesc.trim()) {
      alert("Per favore compila tutti i campi.");
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
          name: contactName,
          email: contactEmail,
          message: contactDesc,
          type: 'Quote Request (Engineering Solutions)'
        })
      });
      if (response.ok) {
        setSent(true);
        setContactName("");
        setContactEmail("");
        setContactDesc("");
      } else {
        alert("Errore nell'invio. Riprova più tardi.");
      }
    } catch (error) {
      alert("Errore di connessione.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="max-w-5xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-center mb-6 text-neon-orange">Soluzioni Ingegneristiche</h1>
      <p className="text-center text-lg text-gray-300 mb-12">
        Dall’ideazione alla produzione, Dream3D offre servizi di ingegneria industriale, automazione e progettazione su misura per ogni settore.
      </p>
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {services.map((service) => (
          <div key={service.title} className="bg-dark-surface rounded-xl shadow-lg p-6 border border-white/10 hover:border-neon-orange transition-colors">
            <h2 className="text-xl font-semibold text-neon-orange mb-2">{service.title}</h2>
            <p className="text-gray-200">{service.desc}</p>
          </div>
        ))}
      </div>
      <h2 className="text-2xl font-bold text-center mb-4 text-neon-orange">Settori Serviti</h2>
      <div className="flex flex-wrap justify-center gap-6 mb-16">
        {sectors.map((sector) => (
          <div key={sector.name} className="flex flex-col items-center bg-dark-surface rounded-lg p-4 w-36 border border-white/10">
            <span className="text-4xl mb-2">{sector.icon}</span>
            <span className="text-gray-200 text-center">{sector.name}</span>
          </div>
        ))}
      </div>


      {/* Portfolio PDF */}
      <div className="max-w-3xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-center mb-4 text-neon-orange mt-20">Portfolio Design Macchina</h2>
        <div className="flex flex-col md:flex-row items-center gap-6 bg-dark-surface rounded-xl p-6 border border-white/10 shadow-lg">
          <iframe
            src="/macchina-design-portfolio.pdf"
            title="Portfolio Design Macchina"
            className="w-full md:w-1/2 h-80 rounded border border-white/10"
            loading="lazy"
          />
          <div className="flex-1 flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold text-neon-orange mb-2">Scarica o visualizza il portfolio completo</h3>
            <p className="text-gray-300 text-sm mb-4 text-center md:text-left">
              Scopri alcuni progetti di design e ingegnerizzazione realizzati da Dream3D. Il PDF contiene immagini, descrizioni e dettagli tecnici delle nostre soluzioni.
            </p>
            <a
              href="/macchina-design-portfolio.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-5 py-2 bg-neon-orange text-black font-bold rounded hover:bg-neon-fire transition-colors"
            >
              Visualizza/Scarica PDF
            </a>
          </div>
        </div>
      </div>

      {/* Portfolio Modelli */}
      <h2 className="text-2xl font-bold text-center mb-4 text-neon-orange mt-20">Portfolio Modelli 3D</h2>
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {mockProducts.slice(0, 6).map((model) => (
          <div key={model.id} className="bg-dark-surface rounded-xl shadow-lg p-4 border border-white/10 hover:border-neon-orange transition-colors flex flex-col items-center">
            <img src={model.image_url} alt={model.name} className="w-full h-48 object-cover rounded mb-3 border border-white/10" loading="lazy" />
            <h3 className="text-lg font-semibold text-neon-orange mb-1 text-center">{model.name}</h3>
            <p className="text-gray-300 text-sm text-center mb-2">{model.description}</p>
            <span className="text-xs text-gray-400 mb-1">Materiale: {model.material?.toUpperCase()}</span>
            <span className="text-xs text-gray-400">Categoria: {model.category}</span>
          </div>
        ))}
      </div>

      {/* Preventivo Section */}
      <div className="max-w-2xl mx-auto bg-dark-surface p-8 rounded-2xl border border-white/5 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 justify-center text-center text-neon-orange">
          Richiedi un Preventivo
        </h2>
        {sent ? (
          <div className="text-green-500 text-center text-lg font-semibold py-8">Grazie! La tua richiesta è stata inviata.</div>
        ) : (
        <form onSubmit={handleSendContact} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Nome</label>
            <input 
              type="text" 
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-orange outline-none transition-colors" 
              placeholder="Il tuo nome"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input 
              type="email" 
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-orange outline-none transition-colors" 
              placeholder="tua@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Descrizione Progetto</label>
            <textarea 
              value={contactDesc}
              onChange={(e) => setContactDesc(e.target.value)}
              className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-orange outline-none transition-colors h-32" 
              placeholder="Descrivi cosa vorresti realizzare..."
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-neon-orange text-black font-bold rounded hover:bg-neon-fire transition-colors disabled:opacity-60"
            disabled={sending}
          >
            {sending ? 'Invio in corso...' : 'Invia Richiesta'}
          </button>
        </form>
        )}
      </div>
    </section>
  );
}
