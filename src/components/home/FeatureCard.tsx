import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  color?: string; // Colore personalizzato per l'effetto (es. "orange", "blue", "purple")
}

export const FeatureCard = ({ icon, title, description, color = "neon-orange" }: FeatureCardProps) => {
  // Mappa colori per gradienti e ombre
  const getColorClasses = (c: string) => {
    switch(c) {
      case 'neon-blue': return 'group-hover:shadow-[0_0_25px_rgba(0,243,255,0.3)] border-neon-blue/20';
      case 'neon-purple': return 'group-hover:shadow-[0_0_25px_rgba(188,19,254,0.3)] border-neon-purple/20';
      case 'neon-green': return 'group-hover:shadow-[0_0_25px_rgba(0,255,157,0.3)] border-neon-green/20';
      default: return 'group-hover:shadow-[0_0_25px_rgba(255,107,0,0.3)] border-neon-orange/20'; // Orange default
    }
  };

  const getBgGradient = (c: string) => {
    switch(c) {
      case 'neon-blue': return 'from-neon-blue/5 to-transparent';
      case 'neon-purple': return 'from-neon-purple/5 to-transparent';
      case 'neon-green': return 'from-neon-green/5 to-transparent';
      default: return 'from-neon-orange/5 to-transparent';
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`bg-dark-surface p-8 rounded-2xl border border-white/5 transition-all duration-300 group relative overflow-hidden ${getColorClasses(color)}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${getBgGradient(color)} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-6 p-4 bg-white/5 rounded-full group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 text-white group-hover:text-white transition-colors">{title}</h3>
        <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">{description}</p>
      </div>
    </motion.div>
  );
};