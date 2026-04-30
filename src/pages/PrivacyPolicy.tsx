import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-24 min-h-screen bg-dark-bg text-gray-300">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white mb-8">{t('privacy.title')}</h1>
          
          <div className="prose prose-invert max-w-none space-y-8">
            <p className="text-lg">{t('privacy.intro')}</p>

            <section>
              <h2 className="text-2xl font-semibold text-neon-orange mb-4">{t('privacy.section1_title')}</h2>
              <p>{t('privacy.section1_content')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neon-orange mb-4">{t('privacy.section2_title')}</h2>
              <p>{t('privacy.section2_content')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neon-orange mb-4">{t('privacy.section3_title')}</h2>
              <p>{t('privacy.section3_content')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neon-orange mb-4">{t('privacy.contact_title')}</h2>
              <p>{t('privacy.contact_content')}</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};