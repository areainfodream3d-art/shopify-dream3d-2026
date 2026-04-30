import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ShoppingBag } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { shopify } from '../lib/shopify';
import { ProductCard } from '../components/shop/ProductCard';
import { mockProducts, enrichProductWithMockMedia } from '../data/mockData';
import { useTranslation } from 'react-i18next';

export const Shop = () => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Pass current language to Shopify
        const fetchedProducts = await shopify.products.fetchAll(i18n.language);
        
        // Log products to debug media
        console.log("Fetched Products for Shop:", fetchedProducts);

        // Se non ci sono prodotti da Shopify (o errore), usiamo i mock data
        if (!fetchedProducts || fetchedProducts.length === 0) {
           console.log("No products from Shopify, using mock data + goblins");
           setProducts(mockProducts);
        } else {
           // Enrich real products with mock media if needed
           const enrichedProducts = fetchedProducts.map(enrichProductWithMockMedia);
           setProducts(enrichedProducts);
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
        // Fallback to mock data on error
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [i18n.language]);

  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title ? product.title.toLowerCase().includes(searchTerm.toLowerCase()) : product.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Check if the selected category is 'all'
    if (selectedCategory === 'all') return matchesSearch;

    // Normalize category for comparison
    const categoryLower = selectedCategory.toLowerCase();

    // Check tags (array of strings)
    const hasTag = product.tags && Array.isArray(product.tags) && product.tags.some((tag: string) => tag.toLowerCase() === categoryLower);
    
    // Check productType
    const matchesType = product.productType && product.productType.toLowerCase() === categoryLower;

    // Check collections (if available in product object, usually handled via tags or separate query in Shopify)
    // For now we rely on tags and productType which is common for simple filtering
    
    return matchesSearch && (hasTag || matchesType);
  });

  return (
    <div className="min-h-screen bg-dark-bg text-gray-100">
      {/* Hero Section Compact */}
      <div className="relative pt-24 pb-8 bg-gradient-to-b from-black/50 to-dark-bg overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1633412802994-5c058f151b66?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 blur-sm pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-left"
            >
              <h1 className="text-3xl md:text-5xl font-bold mb-2">
                Dream3D <span className="text-neon-orange">Shop</span>
              </h1>
              <p className="text-gray-400 max-w-lg text-sm md:text-base">
                {t('shop.subtitle')}
              </p>
            </motion.div>

            {/* Compact Search & Filter */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full md:w-auto flex flex-col sm:flex-row gap-3 bg-dark-surface/80 backdrop-blur-md p-3 rounded-xl border border-white/5 shadow-lg"
            >
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                    type="text"
                    placeholder={t('shop.search_placeholder')}
                    className="w-full bg-black/40 border border-gray-700/50 rounded-lg pl-9 pr-3 py-2 text-sm focus:border-neon-orange focus:ring-1 focus:ring-neon-orange outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {['all', 'pla', 'resin'].map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                        selectedCategory === category
                            ? 'bg-neon-orange text-black'
                            : 'bg-black/40 text-gray-400 hover:text-white border border-gray-700/50'
                        }`}
                    >
                        {category === 'all' ? t('shop.filter_all') : category === 'pla' ? t('shop.filter_pla') : t('shop.filter_resin')}
                    </button>
                    ))}
                </div>
            </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-dark-surface rounded-2xl h-[400px] border border-white/5"></div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-white/5 p-8 rounded-full mb-6">
              <ShoppingBag className="w-16 h-16 text-gray-600" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {searchTerm ? t('shop.no_products') : t('shop.coming_soon')}
            </h2>
            <p className="text-gray-400 max-w-md mx-auto mb-8">
              {searchTerm 
                ? t('shop.no_products_desc')
                : t('shop.coming_soon_desc')}
            </p>
            {!searchTerm && (
              <Button variant="primary" onClick={() => window.location.href = '/commissioni'}>
                {t('shop.request_commission')}
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
