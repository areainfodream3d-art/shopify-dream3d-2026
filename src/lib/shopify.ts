import Client from 'shopify-buy';

// Per configurare questo client, hai bisogno di:
// 1. Uno store Shopify
// 2. Una App privata (Storefront API Access Token)
// 3. Il dominio del tuo store (es. tuo-store.myshopify.com)

const domain = import.meta.env.VITE_SHOPIFY_DOMAIN || 'dream3d-italy.myshopify.com';
const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;

const client = Client.buildClient({
  domain,
  storefrontAccessToken: storefrontAccessToken || 'invalid_token_placeholder', // Fallback to avoid crash on init, but requests will fail
  apiVersion: '2024-01'
});

export const fetchProductMedia = async (handle: string) => {
  if (!storefrontAccessToken) {
    console.warn("Shopify Storefront Token is missing. Skipping media fetch.");
    return [];
  }

  const query = `
    query ProductMedia($handle: String!) {
      product(handle: $handle) {
        media(first: 10) {
          edges {
            node {
              mediaContentType
              ... on Model3d {
                sources {
                  url
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables: { handle } }),
    });
    
    const json = await res.json();
    
    if (json.errors) {
      // Log dettagliato dell'errore
      console.error("Shopify GraphQL Errors:", JSON.stringify(json.errors, null, 2));
      return [];
    }
    
    return json.data?.product?.media?.edges.map((e: any) => e.node) || [];
  } catch (e) {
    console.error("Failed to fetch media from Shopify:", e);
    return [];
  }
};

export const shopify = {
  products: {
    fetchAll: async (language = 'it') => {
      try {
        if (!storefrontAccessToken) return [];
        // Use custom GraphQL query to fetch products WITH media sources (3D models)
        // because client.product.fetchAll() often misses deep media details like sources.url
        const query = `
          query Products {
            products(first: 20) {
              edges {
                node {
                  id
                  title
                  handle
                  description
                  availableForSale
                  productType
                  tags
                  variants(first: 1) {
                    edges {
                      node {
                        price {
                          amount
                          currencyCode
                        }
                      }
                    }
                  }
                  images(first: 1) {
                    edges {
                      node {
                        url
                        altText
                      }
                    }
                  }
                  media(first: 20) {
                    edges {
                      node {
                        mediaContentType
                        ... on Model3d {
                          sources {
                            url
                            mimeType
                            format
                          }
                        }
                        previewImage {
                          url
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `;

        const res = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
            'Accept-Language': language, // Request translated content
          },
          body: JSON.stringify({ query }),
        });
        
        const json = await res.json();
        
        if (json.errors) {
          console.error("Shopify Products GraphQL Errors:", JSON.stringify(json.errors, null, 2));
          // Fallback to SDK if custom query fails
          const products = await client.product.fetchAll();
          return products;
        }

        return json.data?.products?.edges.map((e: any) => e.node) || [];
      } catch (error) {
        console.error('Error fetching Shopify products:', error);
        return [];
      }
    },
    fetchOne: async (handle: string, language = 'it') => {
      try {
        if (!storefrontAccessToken) return null;
        
        const query = `
          query Product($handle: String!) {
            product(handle: $handle) {
              id
              title
              handle
              description
              availableForSale
              productType
              tags
              variants(first: 20) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
              images(first: 20) {
                edges {
                  node {
                    url
                    src: url
                    altText
                  }
                }
              }
              media(first: 20) {
                edges {
                  node {
                    mediaContentType
                    ... on Model3d {
                      sources {
                        url
                        mimeType
                        format
                        filename
                      }
                    }
                    previewImage {
                      url
                    }
                  }
                }
              }
            }
          }
        `;

        const res = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
            'Accept-Language': language,
          },
          body: JSON.stringify({ query, variables: { handle } }),
        });

        const json = await res.json();

        if (json.errors) {
            console.error("Shopify Product GraphQL Errors:", JSON.stringify(json.errors, null, 2));
            // Fallback to SDK
            return await client.product.fetchByHandle(handle);
        }

        return json.data?.product || null;
      } catch (error) {
        console.error('Error fetching Shopify product:', error);
        return null;
      }
    }
  },
  checkout: {
    create: async () => {
      if (!storefrontAccessToken) throw new Error("Missing Shopify Token");
      return await client.checkout.create();
    },
    fetch: async (checkoutId: string) => {
      if (!storefrontAccessToken) return null;
      return await client.checkout.fetch(checkoutId);
    },
    addLineItems: async (checkoutId: string, lineItems: any[]) => {
      if (!storefrontAccessToken) return null;
      return await client.checkout.addLineItems(checkoutId, lineItems);
    },
    removeLineItems: async (checkoutId: string, lineItemIds: string[]) => {
      if (!storefrontAccessToken) return null;
      return await client.checkout.removeLineItems(checkoutId, lineItemIds);
    }
  }
};
