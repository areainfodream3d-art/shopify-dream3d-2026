import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Box } from 'lucide-react';
import { Button } from '../ui/Button';
import { ProductViewer3D } from '../3d/ProductViewer3D';
import { useTranslation } from 'react-i18next';

interface ProductCardProps {
  product: any; // Using any for now as we don't have full Shopify types available
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { t } = useTranslation();
  const { title, handle } = product;
  
  // Safely handle GraphQL edges/node structure or normalized array
  const variants = product.variants && product.variants.edges 
    ? product.variants.edges.map((e: any) => e.node) 
    : (product.variants || []);
    
  const images = product.images && product.images.edges 
    ? product.images.edges.map((e: any) => e.node) 
    : (product.images || []);
    
  const media = product.media && product.media.edges 
    ? product.media.edges.map((e: any) => e.node) 
    : (product.media || []);

  const price = variants && variants[0] ? variants[0].price.amount : '0.00';
  const currency = variants && variants[0] ? variants[0].price.currencyCode : 'EUR';
  
  // Logic to find the best image to show
  let image = ''; // Default to empty string instead of placeholder URL
  let has3DModel = false;
  let modelUrl = undefined;

  // 1. Try standard images
  if (images && images.length > 0) {
    // Shopify Storefront API 2024-01 returns 'url', older SDK might return 'src'
    image = images[0].url || images[0].src || '';
  } 
  // 2. Try media preview images (often 3D models have a preview)
  else if (media && media.length > 0) {
    const preview = media.find((m: any) => m.preview?.image?.url || m.previewImage?.image?.src || m.image?.src);
    if (preview) {
      image = preview.preview?.image?.url || preview.previewImage?.image?.src || preview.image?.src || '';
    }
  }

  // Check if there is a 3D model available and get its URL
  if (media && media.length > 0) {
    // 1. Try to find GLB/GLTF explicitly by extension in sources
    // Prefer "texture" or "color" in filename if available for better preview
    // ALSO check for generic GLB if no specific keyword match
    let bestGlb = null;
    let anyGlb = null;
    
    // Debug
    // console.log(`Checking media for ${title}`, media);

    for (const m of media) {
        if (m.sources) {
            const glbCandidates = m.sources.filter((s: any) => s.url && (s.url.toLowerCase().includes('.glb') || s.url.toLowerCase().includes('.gltf')));
            for (const glb of glbCandidates) {
                if (!anyGlb) anyGlb = glb; // Keep track of at least one GLB
                
                if (glb.url.toLowerCase().includes('texture') || glb.url.toLowerCase().includes('color')) {
                    bestGlb = glb; // Found a preferred one
                    break; 
                }
            }
        }
        if (bestGlb) break;
    }

    if (bestGlb) {
        has3DModel = true;
        modelUrl = bestGlb.url;
    } else if (anyGlb) {
        // Fallback to ANY GLB found if no "texture" one exists
        has3DModel = true;
        modelUrl = anyGlb.url;
    }

    // 2. If no GLB, check for STL
    if (!has3DModel) {
        for (const m of media) {
            if (m.sources) {
                const stlSource = m.sources.find((s: any) => s.url && s.url.includes('.stl'));
                if (stlSource) {
                    has3DModel = true;
                    modelUrl = stlSource.url;
                    break;
                }
            }
        }
    }

    // 3. Fallback if no specific extension found but media type is MODEL_3D
    // AND check for ANY source url even if media type is wrong, as a last resort
    if (!has3DModel) {
        const modelMedia = media.find((m: any) => m.mediaContentType === 'MODEL_3D' || m.mediaContentType === 'model_3d');
        if (modelMedia && modelMedia.sources && modelMedia.sources.length > 0) {
            // Filter again just to be safe, or take first if no extension match (risky but better than nothing)
            const source = modelMedia.sources.find((s: any) => s.url && !s.url.includes('.usdz')) || modelMedia.sources[0];
            if (source) {
                has3DModel = true;
                modelUrl = source.url;
            }
        } else {
            // Extreme fallback: check ALL media for ANY GLB/STL url
            for (const m of media) {
                if (m.sources) {
                    const fallbackSource = m.sources.find((s: any) => s.url && (s.url.toLowerCase().includes('.glb') || s.url.toLowerCase().includes('.gltf') || s.url.toLowerCase().includes('.stl')));
                    if (fallbackSource) {
                        has3DModel = true;
                        modelUrl = fallbackSource.url;
                        break;
                    }
                }
            }
        }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group bg-dark-surface rounded-2xl overflow-hidden border border-white/5 hover:border-neon-orange/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,107,0,0.15)] flex flex-col h-full"
    >
      <div className="relative aspect-square overflow-hidden bg-black/50 block">
        {/* Always try to show 3D Viewer or a placeholder for it */}
        {has3DModel && modelUrl ? (
            <div className="w-full h-full relative z-10">
                <ProductViewer3D 
                    modelUrl={modelUrl} 
                    className="!h-full !rounded-none !border-0" 
                    enableZoom={true}
                    enableRotate={true}
                    enablePan={true}
                    showControls={true}
                    autoRotate={true}
                />
                {/* Removed overlay link to allow interaction with 3D model directly */}
                {/* Navigation is handled by clicking the title or buttons below */}
            </div>
        ) : image ? (
            <Link to={`/shop/${handle}`} className="block w-full h-full">
                <img
                src={image}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                <Button variant="secondary" size="sm" className="pointer-events-none">
                    <Eye className="w-4 h-4 mr-2" /> {t('common.details')}
                </Button>
                </div>
            </Link>
        ) : (
             // Fallback only if NO 3D Model AND NO Image is available
             <Link to={`/shop/${handle}`} className="block w-full h-full relative group">
                <div className="w-full h-full bg-dark-surface flex flex-col items-center justify-center border border-white/5">
                    <Box className="w-16 h-16 text-gray-700 group-hover:text-neon-orange transition-colors mb-4" />
                    <span className="text-gray-500 font-bold uppercase tracking-widest text-xs group-hover:text-white transition-colors">
                        {t('common.view_product')}
                    </span>
                </div>
            </Link>
        )}
        
        {/* Badge per disponibilità */}
        {!product.availableForSale && (
          <div className="absolute top-4 right-4 bg-red-500/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm z-20 pointer-events-none">
            {t('common.sold_out')}
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow relative z-20 bg-dark-surface">
        <div className="mb-4 flex-grow">
          <Link to={`/shop/${handle}`} className="block group-hover:text-neon-orange transition-colors">
            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                {title}
            </h3>
          </Link>
          <p className="text-gray-400 text-sm line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          <div className="text-xl font-bold text-white">
            {new Intl.NumberFormat('it-IT', { style: 'currency', currency: currency }).format(parseFloat(price))}
          </div>
          
          <Link to={`/shop/${handle}`}>
            <Button variant="outline" size="sm" className="hover:bg-neon-orange hover:text-black hover:border-neon-orange">
              <Eye className="w-4 h-4 mr-2" /> {t('common.details')}
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
