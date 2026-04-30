import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { shopify, fetchProductMedia } from '../lib/shopify';
import { Button } from '../components/ui/Button';
import { ShoppingCart, ArrowLeft, Check, Box } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductViewer3D } from '../components/3d/ProductViewer3D';
import { mockProducts } from '../data/mockData';
import { useTranslation } from 'react-i18next';

export const ProductDetails = () => {
  const { t, i18n } = useTranslation();
  const { slug } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'image' | '3d'>('image');
  const [modelUrl, setModelUrl] = useState<string | undefined>(undefined);
  // Using an array to store multiple model variants if needed, or stick to simple logic
  // But to fix the specific issue of "2 and 2" but all GLB, we need to detect by filename
  const [modelVariants, setModelVariants] = useState<{ type: string, url: string, label: string }[]>([]);
  const [activeVariantIndex, setActiveVariantIndex] = useState<number>(0);
  
  const [mainImage, setMainImage] = useState<string>('');

  useEffect(() => {
    if (slug) {
      fetchProduct(slug);
    }
  }, [slug, i18n.language]);

  const fetchProduct = async (handle: string) => {
    setLoading(true);
    try {
      // 1. Fetch main product details using SDK (reliable)
      const item = await shopify.products.fetchOne(handle, i18n.language);
      
      if (item) {
        // SDK already returns array for images/variants usually, but we handle edges if needed just in case
        const variants = item.variants.edges ? item.variants.edges.map((e: any) => e.node) : item.variants;
        const images = item.images.edges ? item.images.edges.map((e: any) => e.node) : item.images;
        
        // 2. Fetch Media explicitly using custom query (for 3D models)
        // because SDK might not return it
        let media = item.media;
        if (!media || (media.edges && media.edges.length === 0) || (Array.isArray(media) && media.length === 0)) {
            const fetchedMedia = await fetchProductMedia(handle);
            if (fetchedMedia && fetchedMedia.length > 0) {
                media = fetchedMedia;
            }
        } else {
             media = item.media.edges ? item.media.edges.map((e: any) => e.node) : item.media;
        }
        
        const normalizedItem = { ...item, variants, images, media };
        
        setProduct(normalizedItem);
        if (variants && variants.length > 0) {
          setSelectedVariant(variants[0]);
        }
        
        // Logic to find ALL 3D Model URLs and label them smarty
        let foundImage = 'https://placehold.co/600x600/1a1a1a/cccccc?text=No+Image';
        const variantsFound: { type: string, url: string, label: string }[] = [];

        if (media && media.length > 0) {
            // Iterate through ALL media items to find models
            for (const m of media) {
                if (m.mediaContentType === 'MODEL_3D' || m.mediaContentType === 'model_3d') {
                    if (m.sources && m.sources.length > 0) {
                        // Prefer GLB/GLTF, then STL, avoid USDZ
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
                            else if (lowerUrl.includes('generate') || filename.toLowerCase().includes('generate')) label = "Versione Grezza (STL)"; // As per user indication
                            else if (lowerUrl.endsWith('.stl')) { label = "Versione STL"; type = 'stl'; }
                            else if (lowerUrl.endsWith('.glb') || lowerUrl.endsWith('.gltf')) label = "Versione GLB";

                            // Avoid duplicates
                            if (!variantsFound.some(v => v.url === url)) {
                                variantsFound.push({ type, url, label });
                            }
                        }
                    }
                }
            }
        }
        
        // Set Main Image (prioritize images array, then media preview)
        if (images && images.length > 0) {
            // Check both src (SDK) and url (GraphQL)
            foundImage = images[0].src || images[0].url || foundImage;
        } else if (media && media.length > 0) {
             const preview = media.find((m: any) => m.preview?.image?.url || m.previewImage?.image?.src || m.image?.src);
             if (preview) {
                foundImage = preview.preview?.image?.url || preview.previewImage?.image?.src || preview.image?.src || foundImage;
             }
        }

        setModelVariants(variantsFound);
        setMainImage(foundImage);

        // Determine active model and view mode
        if (variantsFound.length > 0) {
            console.log("Found models:", variantsFound);
            setActiveVariantIndex(0);
            setViewMode('3d');
        } else if (!images || images.length === 0) {
             // Keep it on image mode if no models, but if no images either... well, stay on image mode with placeholder
        }

      } else {
        throw new Error("Product not found in Shopify");
      }
    } catch (error) {
      console.log("Using mock product data for", handle);
      const mockItem = mockProducts.find(p => p.slug === handle);
      if (mockItem) {
        // Map mock item to Shopify structure
        const mappedItem = {
          id: mockItem.id,
          title: mockItem.name,
          handle: mockItem.slug,
          description: mockItem.description,
          images: [{ src: mockItem.image_url }],
          variants: [{ 
            id: mockItem.id, 
            title: 'Default', 
            price: { amount: mockItem.price.toString(), currencyCode: 'EUR' } 
          }],
          productType: mockItem.material.toUpperCase(),
          availableForSale: mockItem.stock > 0
        };
        setProduct(mappedItem);
        setSelectedVariant(mappedItem.variants[0]);
        setMainImage(mockItem.image_url);
      } else {
        setProduct(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    if (!selectedVariant) return;
    
    setAdding(true);
    try {
      // In a real app, you would manage a cart ID in local storage or context
      let checkoutId = localStorage.getItem('checkoutId');
      
      if (!checkoutId) {
        const checkout = await shopify.checkout.create();
        checkoutId = checkout.id;
        localStorage.setItem('checkoutId', checkoutId as string);
      }
      
      const lineItemsToAdd = [
        {
          variantId: selectedVariant.id,
          quantity: 1,
        }
      ];

      await shopify.checkout.addLineItems(checkoutId as string, lineItemsToAdd);
      
      // Redirect to checkout immediately for simplicity in this demo
      // Or show a success message/toast
      const checkout = await shopify.checkout.fetch(checkoutId as string);
      window.location.href = checkout.webUrl;
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Mock cart action for demo
      setTimeout(() => {
        alert("Prodotto aggiunto al carrello (Demo Mode)");
        setAdding(false);
      }, 1000);
      return;
    }
    setAdding(false);
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 container mx-auto px-4 min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-orange"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 pb-20 container mx-auto px-4 min-h-screen text-center flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">{t('common.product_not_found')}</h1>
        <p className="text-gray-400 mb-8">{t('common.product_not_found_desc')}</p>
        <Link to="/shop">
          <Button variant="outline">{t('common.back_to_shop')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 container mx-auto px-4 min-h-screen">
      <Link to="/shop" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> {t('common.back_to_shop')}
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Media Viewer (Image or 3D) */}
        <div className="flex flex-col gap-4">
          <div className="bg-dark-surface rounded-2xl overflow-hidden border border-white/5 relative group min-h-[400px] max-h-[600px]">
            {viewMode === 'image' ? (
              <div className="w-full h-full relative">
                <img 
                  src={mainImage} 
                  alt={product.title} 
                  className="w-full h-full object-cover"
                />
                {product.productType && (
                  <span className="absolute top-4 left-4 bg-neon-orange/20 text-neon-orange text-sm font-bold px-3 py-1 rounded backdrop-blur-sm border border-neon-orange/30">
                    {product.productType}
                  </span>
                )}
              </div>
            ) : (
              <ProductViewer3D 
                key={modelVariants[activeVariantIndex]?.url || 'empty'} // Force re-render when type changes
                modelUrl={modelVariants[activeVariantIndex]?.url} 
              />
            )}
          </div>

          {/* Toggle Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
             {/* Show "Foto" button if there are images or we are in image mode */}
             {((product.images && product.images.length > 0) || (modelVariants.length === 0)) && (
                 <button 
                    onClick={() => setViewMode('image')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        viewMode === 'image' 
                        ? 'bg-white text-black' 
                        : 'bg-dark-surface text-gray-400 hover:text-white border border-white/10'
                    }`}
                >
                    {t('common.photo')}
                </button>
             )}

             {/* Show Model buttons */}
             {modelVariants.map((variant, index) => (
                <button 
                key={index}
                onClick={() => {
                    setActiveVariantIndex(index);
                    setViewMode('3d');
                }}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                    viewMode === '3d' && activeVariantIndex === index
                    ? 'bg-neon-orange text-black shadow-[0_0_15px_rgba(255,140,0,0.5)]' 
                    : 'bg-dark-surface text-gray-400 hover:text-white border border-white/10'
                }`}
                >
                <Box className="w-4 h-4" /> {variant.label}
                </button>
             ))}
          </div>
        </div>

        {/* Dettagli Prodotto */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.title}</h1>
          
          <div className="text-3xl font-bold text-neon-orange mb-6">
            €{selectedVariant?.price.amount}
          </div>

          <div className="prose prose-invert max-w-none mb-8 text-gray-300">
            <p>{product.description}</p>
          </div>

          {/* Varianti (se presenti) */}
          {product.variants.length > 1 && (
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-400 mb-2">{t('common.select_variant')}</label>
              <div className="flex flex-wrap gap-3">
              {product.variants.map((variant: any) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-4 py-2 rounded-lg border transition-all ${
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

          <div className="flex gap-4">
            <Button 
              size="lg" 
              className="flex-1"
              onClick={addToCart}
              disabled={adding || !product.availableForSale}
            >
              {adding ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black mr-2"></div>
                  {t('common.adding')}
                </span>
              ) : !product.availableForSale ? (
                t('common.not_available')
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 mr-2" /> {t('common.add_to_cart')}
                </>
              )}
            </Button>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 gap-4">
            <div className="flex items-center text-sm text-gray-400">
              <Check className="w-4 h-4 text-neon-orange mr-2" /> {t('product.shipping_fast')}
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <Check className="w-4 h-4 text-neon-orange mr-2" /> {t('product.quality_guaranteed')}
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <Check className="w-4 h-4 text-neon-orange mr-2" /> {t('product.support_247')}
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <Check className="w-4 h-4 text-neon-orange mr-2" /> {t('product.easy_return')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
