# Integrazione con Shopify (Headless Commerce)

Hai realizzato un sito web moderno in React (Next.js/Vite). Per "metterlo su Shopify", la strada migliore non è caricarlo come tema classico (che usa Liquid), ma usare l'approccio **Headless**.

In questo scenario:
1. **Frontend**: Il tuo sito React rimane dove è (es. su Vercel).
2. **Backend**: Shopify gestisce i prodotti, il carrello e il checkout.
3. **Collegamento**: Il sito parla con Shopify tramite le **Storefront API**.

## 🚀 Passaggi per l'integrazione

### 1. Prepara il tuo Store Shopify
1. Accedi al pannello admin di Shopify.
2. Vai su **Impostazioni** > **App e canali di vendita** > **Develop apps**.
3. Clicca **Create an app** (chiamala "Dream3D Headless").
4. In **Configuration** > **Storefront API integration**, seleziona:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_tags`
   - `unauthenticated_read_content`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`
5. Clicca **Save** e poi **Install app**.
6. Copia lo **Storefront API access token**.

### 2. Configura le Variabili d'Ambiente
Nel tuo file `.env` (o nelle impostazioni di Vercel), aggiungi:

```env
VITE_SHOPIFY_DOMAIN=il-tuo-shop.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=incolla-qui-il-tuo-token
```

### 3. Sostituisci Supabase con Shopify
Ho già installato la libreria `shopify-buy` e creato il file `src/lib/shopify.ts`.

Ora devi modificare le pagine (es. `src/pages/Shop.tsx`) per usare `shopifyClient` invece di `supabase`.

**Esempio di modifica in Shop.tsx:**

```typescript
import { shopifyClient } from '../lib/shopify';

// ... dentro il componente
useEffect(() => {
  const loadProducts = async () => {
    const products = await shopifyClient.product.fetchAll();
    // Converti i dati di Shopify nel formato che usa la tua UI
    const formattedProducts = products.map(p => ({
      id: p.id,
      name: p.title,
      price: p.variants[0].price.amount,
      image: p.images[0]?.src,
      // ... altri campi
    }));
    setProducts(formattedProducts);
  };
  loadProducts();
}, []);
```

### 4. Gestione del Checkout
Con Shopify Headless, non costruisci tu la pagina di pagamento.
1. L'utente aggiunge prodotti al carrello (gestito nel tuo sito React).
2. Quando clicca "Procedi al pagamento", crei un checkout tramite API.
3. Reindirizzi l'utente alla `webUrl` fornita da Shopify (una pagina sicura gestita da loro).

```typescript
const proceedToCheckout = async () => {
  const checkout = await shopifyClient.checkout.create();
  // Aggiungi items...
  window.location.href = checkout.webUrl; // Porta l'utente su Shopify per pagare
};
```

## Vantaggi di questo approccio
- **Design Totale**: Mantieni il controllo completo sull'UI/UX che abbiamo creato.
- **Performance**: Il sito React è molto più veloce di un tema Liquid standard.
- **Sicurezza**: I pagamenti sono gestiti interamente sui server sicuri di Shopify.
