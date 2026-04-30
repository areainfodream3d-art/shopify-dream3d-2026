import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Check, Box } from 'lucide-react';
import { Button } from '../ui/Button';
import { ProductViewer3D } from '../3d/ProductViewer3D';
import { shopify } from '../../lib/shopify';

interface ProductExpandedProps {
  product: any;
}

export const ProductExpanded = ({ product }: ProductExpandedProps) => {
  const { title, description, handle } = product;
  
  // Normalize variants
  const variants = product.variants && product.variants.edges 
    ? product.variants.edges.map((e: any) => e.node) 
    : (product.variants || []);
    
  // Normalize media
  const media = product.media && product.media.edges 
    ? product.media.edges.map((e: any) => e.node) 
    : (product.media || []);

  const [selectedVariant, setSelectedVariant] = useState<any>(variants[0] || null);
  const [adding, setAdding] = useState(false);
  const [activeVariantIndex, setActiveVariantIndex] = useState<number>(0);

  // Logic to find ALL 3D Model URLs and label them smartly (copied from ProductDetails)
  const variantsFound: { type: string, url: string, label: string }[] = [];

  if (media && media.length > 0) {
      for (const m of media) {
          if (m.mediaContentType === 'MODEL_3D' || m.mediaContentType === 'model_3d') {
              if (m.sources && m.sources.length > 0) {
                  const source = m.sources.find((s: any) => s.url && (s.url.toLowerCase().includes('.glb') || s.url.toLowerCase().includes('.gltf'))) 
                              || m.sources.find((s: any) => s.url && s.url.toLowerCase().includes('.stl'))
                              || m.sources.find((s: any) => s.url && !s.url.includes('.usdz'));
                  
                  if (source) {
                      const url = source.url;
                      const lowerUrl = url.toLowerCase();
                      const filename = source.filename || url.split('/').pop() || '';
                      let label = `Modello ${variantsFound.length + 1}`;
                      let type = 'glb';

                      if (lowerUrl.includes('texture') || filename.toLowerCase().includes('texture')) label = "Versione Colorata (GLB)";
                      else if (lowerUrl.includes('generate') || filename.toLowerCase().includes('generate')) label = "Versione Grezza (STL)"; 
                      else if (lowerUrl.endsWith('.stl')) { label = "Versione STL"; type = 'stl'; }
                      else if (lowerUrl.endsWith('.glb') || lowerUrl.endsWith('.gltf')) label = "Versione GLB";

                      if (!variantsFound.some(v => v.url === url)) {
                          variantsFound.push({ type, url, label });
                      }
                  }
              }
          }
      }
  }

  // Fallback image if no 3D model
  let image = 'https://placehold.co/600x400/1a1a1a/cccccc?text=No+Image';
  const images = product.images && product.images.edges ? product.images.edges.map((e: any) => e.node) : (product.images || []);
  if (images.length > 0) {
      image = images[0].url || images[0].src || image;
  }

  const addToCart = async () => {
    if (!selectedVariant) return;
    setAdding(true);
    try {
      let checkoutId = localStorage.getItem('checkoutId');
      if (!checkoutId) {
        const checkout = await shopify.checkout.create();
        checkoutId = checkout.id;
        localStorage.setItem('checkoutId', checkoutId as string);
      }
      
      await shopify.checkout.addLineItems(checkoutId as string, [{
          variantId: selectedVariant.id,
          quantity: 1,
      }]);
      
      const checkout = await shopify.checkout.fetch(checkoutId as string);
      window.location.href = checkout.webUrl;
    } catch (error) {
      console.error('Error adding to cart:', error);
      setTimeout(() => {
        alert("Prodotto aggiunto al carrello (Demo Mode)");
        setAdding(false);
      }, 1000);
      return;
    }
    setAdding(false);
  };

  const price = selectedVariant ? selectedVariant.price.amount : '0.00';
  const currency = selectedVariant ? selectedVariant.price.currencyCode : 'EUR';

  return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-dark-surface rounded-3xl overflow-hidden border border-white/5 shadow-2xl mb-12 flex flex-col lg:flex-row"
    >
        {/* Left Side: 3D Viewer or Image */}
        <div className="lg:w-3/5 h-[500px] lg:h-[600px] relative bg-black/50">
            {variantsFound.length > 0 ? (
                <div className="w-full h-full relative group">
                     <ProductViewer3D 
                        key={variantsFound[activeVariantIndex]?.url}
                        modelUrl={variantsFound[activeVariantIndex]?.url} 
                        className="!h-full !rounded-none !border-0"
                        enableZoom={true} // Enabled interaction directly
                        enableRotate={true}
                        enablePan={true}
                        autoRotate={true}
                        showControls={true}
                    />
                    
                    {/* Model Switcher Overlay */}
                    {variantsFound.length > 1 && (
                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-20 bg-black/60 backdrop-blur-md p-2 rounded-xl border border-white/10">
                            {variantsFound.map((variant, index) => (
                                <button 
                                    key={index}
                                    onClick={() => setActiveVariantIndex(index)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                                        activeVariantIndex === index
                                        ? 'bg-neon-orange text-black shadow-[0_0_15px_rgba(255,140,0,0.5)]' 
                                        : 'bg-white/10 text-gray-300 hover:text-white hover:bg-white/20'
                                    }`}
                                >
                                    <Box className="w-4 h-4" /> {variant.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <img src={image} alt={title} className="w-full h-full object-cover" />
            )}
        </div>

        {/* Right Side: Details & Purchase */}
        <div className="lg:w-2/5 p-8 lg:p-12 flex flex-col justify-center bg-gradient-to-br from-dark-surface to-black">
            <h2 className="text-4xl font-bold text-white mb-4">{title}</h2>
            
            <div className="text-3xl font-bold text-neon-orange mb-6">
                {new Intl.NumberFormat('it-IT', { style: 'currency', currency: currency }).format(parseFloat(price))}
            </div>

            <div className="prose prose-invert text-gray-300 mb-8 max-w-none">
                <p className="line-clamp-4 hover:line-clamp-none transition-all cursor-pointer" title="Clicca per espandere">
                    {description}
                </p>
            </div>

            {/* Variants Selector */}
            {variants.length > 1 && (
                <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Seleziona Variante</label>
                    <div className="flex flex-wrap gap-2">
                    {variants.map((variant: any) => (
                        <button
                            key={variant.id}
                            onClick={() => setSelectedVariant(variant)}
                            className={`px-4 py-2 rounded-lg text-sm transition-all border ${
                            selectedVariant?.id === variant.id
                                ? 'border-neon-orange bg-neon-orange/10 text-white'
                                : 'border-white/10 hover:border-white/30 text-gray-400'
                            }`}
                        >
                            {variant.title}
                        </button>
                        ))}
                    </div>
                </div>
            )}

            <Button 
                size="lg" 
                className="w-full mb-6 py-6 text-lg"
                onClick={addToCart}
                disabled={adding || !product.availableForSale}
            >
                {adding ? (
                <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black mr-3"></div>
                    Aggiungendo...
                </span>
                ) : !product.availableForSale ? (
                'Non Disponibile'
                ) : (
                <>
                    <ShoppingCart className="w-6 h-6 mr-3" /> Aggiungi al Carrello
                </>
                )}
            </Button>

            <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                <div className="flex items-center"><Check className="w-3 h-3 text-neon-orange mr-2" /> Spedizione Rapida</div>
                <div className="flex items-center"><Check className="w-3 h-3 text-neon-orange mr-2" /> Qualità Garantita</div>
                <div className="flex items-center"><Check className="w-3 h-3 text-neon-orange mr-2" /> Supporto 24/7</div>
                <div className="flex items-center"><Check className="w-3 h-3 text-neon-orange mr-2" /> Reso Facile</div>
            </div>
        </div>
    </motion.div>
  );
};
