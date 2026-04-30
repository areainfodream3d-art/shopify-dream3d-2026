import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, ShieldCheck, Cpu, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useTranslation } from 'react-i18next';
import { FeatureCard } from '../components/home/FeatureCard';

const CategoryCard = ({ title, description, image, link }: { title: string, description: string, image: string, link: string }) => (
  <Link to={link} className="group relative overflow-hidden rounded-xl aspect-[4/3]">
    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url(${image})` }}></div>
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
    <div className="absolute bottom-0 left-0 p-6">
      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-neon-orange transition-colors">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  </Link>
);

export const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-dark-bg z-0">
          <img 
            src="https://cdn.shopify.com/s/files/1/0981/3465/5353/files/background.png?v=1771418206"
            alt="3D Printing Background"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/60 to-dark-bg/80"></div>
        </div>
        
        <div className="container mx-auto px-4 z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight relative"
          >
            <span className="block">{t('home.hero.title')}</span>
            <span className="relative inline-block mt-2">
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-orange/50 to-transparent blur-lg opacity-50 animate-pulse"></span>
              <span className="relative z-10 bg-gradient-to-r from-neon-orange via-white to-neon-orange bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]">
                {t('home.hero.subtitle')}
              </span>
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            {t('home.hero.description')}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col md:flex-row gap-4 justify-center"
          >
            <Link to="/shop">
              <Button size="lg" className="w-full md:w-auto">
                {t('home.hero.cta_products')} <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/commissioni">
              <Button variant="outline" size="lg" className="w-full md:w-auto hover:border-neon-orange hover:text-neon-orange">
                {t('home.hero.cta_commission')}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-dark-surface">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            {t('home.categories.title')} <span className="text-neon-orange">{t('home.categories.subtitle')}</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <CategoryCard 
              title={t('home.categories.pla.title')} 
              description={t('home.categories.pla.desc')}
              image="https://cdn.shopify.com/s/files/1/0981/3465/5353/files/nano-banana-pro-_nanobanana.io_-1771418569978.png?v=1771418903"
              link="/shop?material=pla"
            />
            <CategoryCard 
              title={t('home.categories.resin.title')} 
              description={t('home.categories.resin.desc')}
              image="https://cdn.shopify.com/s/files/1/0981/3465/5353/files/nano-banana-pro-_nanobanana.io_-1771419660375.png?v=1771419706"
              link="/shop?material=resina"
            />
            <CategoryCard 
              title={t('home.categories.commission.title')} 
              description={t('home.categories.commission.desc')}
              image="https://cdn.shopify.com/s/files/1/0981/3465/5353/files/nano-banana-pro-_nanobanana.io_-1771421558426.png?v=1771421591"
              link="/commissioni"
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-dark-bg">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">
            {t('home.features.title')} <span className="text-neon-orange">Dream3D</span>?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <FeatureCard 
              icon={<Zap className="w-12 h-12 text-neon-orange group-hover:text-white transition-colors" />}
              title={t('home.features.rapid_prod.title')}
              description={t('home.features.rapid_prod.desc')}
              color="neon-orange"
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-12 h-12 text-neon-blue group-hover:text-white transition-colors" />}
              title={t('home.features.quality.title')}
              description={t('home.features.quality.desc')}
              color="neon-blue"
            />
            <FeatureCard 
              icon={<Cpu className="w-12 h-12 text-neon-purple group-hover:text-white transition-colors" />}
              title={t('home.features.tech.title')}
              description={t('home.features.tech.desc')}
              color="neon-purple"
            />
            <FeatureCard 
              icon={<Truck className="w-12 h-12 text-neon-green group-hover:text-white transition-colors" />}
              title={t('home.features.global_ship.title')}
              description={t('home.features.global_ship.desc')}
              color="neon-green"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-dark-bg">
          <div className="absolute inset-0 bg-gradient-to-r from-neon-orange/10 to-transparent opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-orange to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center bg-dark-surface/50 backdrop-blur-md border border-white/10 p-12 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] relative group">
            
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-neon-orange rounded-tl-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-neon-orange rounded-br-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              {t('home.cta.title_part1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-orange to-orange-400">{t('home.cta.title_part2')}</span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-light">
              {t('home.cta.desc')} <span className="text-white font-medium">{t('home.cta.desc_highlight')}</span>.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/commissioni">
                <Button 
                  size="lg" 
                  className="bg-neon-orange text-black hover:bg-white hover:text-black font-bold px-10 py-6 text-lg rounded-full shadow-[0_0_20px_rgba(255,107,0,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all transform hover:-translate-y-1"
                >
                  {t('home.cta.button')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
