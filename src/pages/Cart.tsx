import React, { useEffect, useState } from 'react';
import { shopify } from '../lib/shopify';
import { Button } from '../components/ui/Button';
import { ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface CartItem {
  id: string;
  title: string;
  quantity: number;
  variant: {
    price: { amount: string };
    image: { src: string };
    title: string;
    product: { title: string };
  };
}

export const Cart = () => {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    const checkoutId = localStorage.getItem('checkoutId');
    if (checkoutId) {
      try {
        const checkout = await shopify.checkout.fetch(checkoutId);
        setCart(checkout);
      } catch (error) {
        console.error('Error fetching cart:', error);
        // If checkout is expired or not found, clear local storage
        localStorage.removeItem('checkoutId');
      }
    }
    setLoading(false);
  };

  const removeItem = async (lineItemId: string) => {
    setIsUpdating(true);
    const checkoutId = localStorage.getItem('checkoutId');
    if (checkoutId) {
      // @ts-ignore - The SDK types might be incomplete for removeLineItems
      await shopify.checkout.removeLineItems(checkoutId, [lineItemId]);
      await fetchCart();
    }
    setIsUpdating(false);
  };

  const proceedToCheckout = () => {
    if (cart && cart.webUrl) {
      window.location.href = cart.webUrl;
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 container mx-auto px-4 min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-orange"></div>
      </div>
    );
  }

  if (!cart || !cart.lineItems || cart.lineItems.length === 0) {
    return (
      <div className="pt-32 pb-20 container mx-auto px-4 min-h-screen text-center">
        <div className="flex justify-center mb-6">
          <ShoppingCart className="w-24 h-24 text-gray-700" />
        </div>
        <h1 className="text-3xl font-bold mb-4">{t('cart.empty_title')}</h1>
        <p className="text-gray-400 mb-8">{t('cart.empty_desc')}</p>
        <Link to="/shop">
          <Button size="lg">
            {t('cart.start_shopping')} <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 container mx-auto px-4 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 flex items-center gap-4">
        {t('cart.title')} <span className="text-neon-orange text-2xl font-normal">({cart.lineItems.length} {t('cart.items')})</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-6">
          {cart.lineItems.map((item: CartItem) => (
            <div key={item.id} className="bg-dark-surface p-4 rounded-xl border border-white/5 flex gap-4 items-center group hover:border-neon-orange/30 transition-all">
              <div className="w-24 h-24 bg-black rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={item.variant.image?.src || 'https://placehold.co/100x100/1a1a1a/cccccc?text=No+Img'} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-grow">
                <h3 className="font-bold text-lg text-white mb-1">
                  {item.variant.product.title}
                </h3>
                <p className="text-sm text-gray-400 mb-2">{item.variant.title !== 'Default Title' ? item.variant.title : ''}</p>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-neon-orange">
                    €{item.variant.price.amount} x {item.quantity}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => removeItem(item.id)}
                disabled={isUpdating}
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                title="Rimuovi dal carrello"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-dark-surface p-6 rounded-2xl border border-white/10 sticky top-32">
            <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">{t('cart.summary_title')}</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-400">
                <span>{t('cart.subtotal')}</span>
                <span>€{cart.subtotalPrice.amount}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>{t('cart.shipping')}</span>
                <span className="text-xs">{t('cart.shipping_calculated')}</span>
              </div>
            </div>

            <div className="flex justify-between text-xl font-bold text-white mb-8 pt-4 border-t border-white/10">
              <span>{t('cart.total')}</span>
              <span className="text-neon-orange">€{cart.totalPrice.amount}</span>
            </div>

            <Button 
              size="lg" 
              className="w-full" 
              onClick={proceedToCheckout}
            >
              {t('cart.checkout')} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <p className="text-xs text-gray-500 text-center mt-4 flex items-center justify-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {t('cart.secure_payment')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
