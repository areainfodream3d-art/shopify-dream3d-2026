import { Product } from '../types';

export const enrichProductWithMockMedia = (product: any) => {
    // Find mock product by slug/handle or ID similarity
    // @ts-ignore - mockProducts has extra media field
    const mockMatch = mockProducts.find(m => 
        m.slug === product.handle || 
        product.handle.includes(m.slug) || 
        (m.name && product.title && m.name.toLowerCase() === product.title.toLowerCase())
    );

    const hasReal3D = product.media && product.media.edges && product.media.edges.some((e: any) => e.node.mediaContentType === 'MODEL_3D' || e.node.mediaContentType === 'model_3d');

    // Force inject mock 3D media if real 3D is missing, even if there are images
    // NOTE: This will make the 3D model appear INSTEAD of the image in the main view
    // @ts-ignore
    const shouldInject3D = !hasReal3D && mockMatch && mockMatch.media && mockMatch.media.length > 0;

    if (shouldInject3D) {
        console.log(`Injecting mock 3D media for ${product.title}`);
        // Transform mock media to Shopify structure if needed, or append to edges
        // @ts-ignore
        const mockMediaEdges = mockMatch.media.map((m: any) => ({
            node: {
                ...m,
                mediaContentType: 'MODEL_3D' // Ensure type is set
            }
        }));
        
        if (!product.media) product.media = { edges: [] };
        if (!product.media.edges) product.media.edges = [];
        
        // Add mock media to the beginning to prioritize it over images
        product.media.edges = [...mockMediaEdges, ...product.media.edges];
    }
    
    // If product has no images AND no 3D model (even after injection try), try to use mock data image
    const hasRealImages = product.images && product.images.edges && product.images.edges.length > 0;
    
    if (!hasRealImages && !hasReal3D && !shouldInject3D && mockMatch && mockMatch.image_url) {
        // Inject mock image
        if (!product.images) product.images = { edges: [] };
        if (!product.images.edges) product.images.edges = [];
        product.images.edges.push({ node: { url: mockMatch.image_url, src: mockMatch.image_url } });
    } else if (hasRealImages && !shouldInject3D && !hasReal3D) {
        // This is the case where we have real images and NO 3D model.
        // We do NOTHING here, because we want the real image to be shown by the UI component naturally.
    }

    return product;
};

export const mockProducts: Product[] = [
  {
    id: 'shopify-goblin-1',
    slug: 'savage-fantasy-goblin-texture',
    name: 'Savage Fantasy Goblin (Textured)',
    description: 'Modello 3D dettagliato di un Goblin selvaggio, completo di texture.',
    price: 0,
    material: 'pla',
    category: 'Fantasy',
    specifications: {},
    stock: 1,
    featured: true,
    customizable: false,
    image_url: 'https://placehold.co/600x600/1a1a1a/cccccc?text=Goblin+Textured',
    created_at: new Date().toISOString(),
    // @ts-ignore - Adding custom field for demo
    media: [
      {
        mediaContentType: 'MODEL_3D',
        sources: [
            { url: 'https://cdn.shopify.com/3d/models/914d99122463475e/Meshy_AI_Savage_fantasy_goblin_0218210157_texture.glb' }
        ],
        previewImage: { image: { src: 'https://placehold.co/600x600/1a1a1a/cccccc?text=Goblin+3D' } }
      }
    ]
  },
  {
    id: 'shopify-goblin-2',
    slug: 'savage-fantasy-goblin-generate',
    name: 'Savage Fantasy Goblin (Generate)',
    description: 'Versione generata del Goblin selvaggio.',
    price: 0,
    material: 'resina',
    category: 'Fantasy',
    specifications: {},
    stock: 1,
    featured: true,
    customizable: false,
    image_url: 'https://placehold.co/600x600/1a1a1a/cccccc?text=Goblin+Generate',
    created_at: new Date().toISOString(),
    // @ts-ignore
    media: [
      {
        mediaContentType: 'MODEL_3D',
        sources: [
            { url: 'https://cdn.shopify.com/3d/models/7a4f31f68b7dc651/Meshy_AI_Savage_fantasy_goblin_0218210203_generate.glb' },
            // Add fake STL for testing switch
            { url: 'https://example.com/fake-goblin.stl' } 
        ],
        previewImage: { image: { src: 'https://placehold.co/600x600/1a1a1a/cccccc?text=Goblin+3D' } }
      }
    ]
  },
  {
    id: 'shopify-scheletro-1',
    slug: 'soldato-scheletrico-texture',
    name: 'Soldato Scheletrico (Textured)',
    description: 'Modello 3D di un soldato scheletrico oscuro, dettagliato e texturizzato.',
    price: 0,
    material: 'resina',
    category: 'Fantasy',
    specifications: {},
    stock: 1,
    featured: true,
    customizable: false,
    image_url: 'https://placehold.co/600x600/1a1a1a/cccccc?text=Scheletro+Textured',
    created_at: new Date().toISOString(),
    // @ts-ignore - Adding custom field for demo
    media: [
      {
        mediaContentType: 'MODEL_3D',
        sources: [
            { url: 'https://cdn.shopify.com/3d/models/cc12f495c4712739/Meshy_AI_Soldato_scheletrico_f_0218213956_texture.glb' }
        ],
        previewImage: { image: { src: 'https://placehold.co/600x600/1a1a1a/cccccc?text=Scheletro+3D' } }
      }
    ]
  },
  {
    id: 'shopify-scheletro-2',
    slug: 'soldato-scheletrico-generate',
    name: 'Soldato Scheletrico (Generate)',
    description: 'Versione generata del soldato scheletrico oscuro.',
    price: 0,
    material: 'pla',
    category: 'Fantasy',
    specifications: {},
    stock: 1,
    featured: true,
    customizable: false,
    image_url: 'https://placehold.co/600x600/1a1a1a/cccccc?text=Scheletro+Generate',
    created_at: new Date().toISOString(),
    // @ts-ignore
    media: [
      {
        mediaContentType: 'MODEL_3D',
        sources: [{ url: 'https://cdn.shopify.com/3d/models/a9b636c752d4c70c/Meshy_AI_Soldato_scheletrico_f_0218210116_generate.glb' }],
        previewImage: { image: { src: 'https://placehold.co/600x600/1a1a1a/cccccc?text=Scheletro+3D' } }
      }
    ]
  },
  {
    id: '1',
    slug: 'dragon-pla-articulated',
    name: 'Drago Articolato',
    description: 'Splendido drago articolato stampato in 3D, perfetto come decorazione o giocattolo antistress. Stampato in PLA di alta qualità con finitura setosa.',
    price: 29.99,
    material: 'pla',
    category: 'Giocattoli',
    specifications: {
      "Dimensioni": "20cm lunghezza",
      "Peso": "50g",
      "Colore": "Multicolore cangiante"
    },
    stock: 10,
    featured: true,
    customizable: true,
    image_url: 'https://images.unsplash.com/photo-1698651833866-224424847526?q=80&w=2070&auto=format&fit=crop',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    slug: 'vaso-geometrico',
    name: 'Vaso Geometrico Moderno',
    description: 'Vaso dal design geometrico unico, stampato in PLA effetto marmo. Ideale per piante grasse o come oggetto di design.',
    price: 34.99,
    material: 'pla',
    category: 'Arredamento',
    specifications: {
      "Altezza": "15cm",
      "Diametro": "10cm",
      "Impermeabile": "Sì (trattato)"
    },
    stock: 5,
    featured: true,
    customizable: false,
    image_url: 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?q=80&w=2070&auto=format&fit=crop',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    slug: 'miniature-guerriero-fantasy',
    name: 'Guerriero Fantasy',
    description: 'Miniatura in resina ad alta risoluzione per giochi da tavolo. Dettagli incredibili, fornita non dipinta e pronta per il primer.',
    price: 12.99,
    material: 'resina',
    category: 'Miniature',
    specifications: {
      "Scala": "32mm",
      "Materiale": "Resina grigia 8k",
      "Base inclusa": "Sì"
    },
    stock: 100,
    featured: true,
    customizable: false,
    image_url: 'https://images.unsplash.com/photo-1596496050844-4610268d330c?q=80&w=2071&auto=format&fit=crop',
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    slug: 'supporto-cuffie',
    name: 'Supporto Cuffie Gaming',
    description: 'Supporto per cuffie robusto e stabile, stampato in PETG per maggiore resistenza. Design minimale che si adatta a qualsiasi scrivania.',
    price: 24.99,
    material: 'pla',
    category: 'Accessori Tech',
    specifications: {
      "Materiale": "PETG Carbon Fiber",
      "Colore": "Nero Opaco",
      "Compatibilità": "Universale"
    },
    stock: 15,
    featured: false,
    customizable: true,
    image_url: 'https://images.unsplash.com/photo-1612815154858-60aa4c4603e1?q=80&w=2070&auto=format&fit=crop',
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    slug: 'busto-personaggio',
    name: 'Busto Personaggio Sci-Fi',
    description: 'Busto da collezione in resina, scala 1:10. Perfetto per pittori ed esposizione.',
    price: 45.00,
    material: 'resina',
    category: 'Collezionismo',
    specifications: {
      "Altezza": "12cm",
      "Materiale": "Resina Tough",
      "Finitura": "Grigio neutro"
    },
    stock: 3,
    featured: true,
    customizable: false,
    image_url: 'https://images.unsplash.com/photo-1606229365485-93a3b8ee0385?q=80&w=2070&auto=format&fit=crop',
    created_at: new Date().toISOString()
  },
  {
    id: '6',
    slug: 'ingranaggi-funzionali',
    name: 'Set Ingranaggi Prototipo',
    description: 'Set di ingranaggi funzionali per prototipazione meccanica. Stampati in Nylon per alta resistenza all\'usura.',
    price: 19.99,
    material: 'pla',
    category: 'Prototipazione',
    specifications: {
      "Modulo": "1.5",
      "Denti": "Varie configurazioni",
      "Materiale": "Nylon PA12"
    },
    stock: 20,
    featured: false,
    customizable: true,
    image_url: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f138?q=80&w=2070&auto=format&fit=crop',
    created_at: new Date().toISOString()
  }
];

export const commissionExamples = [
  {
    id: 1,
    title: "Prototipo Industriale",
    image: "https://images.unsplash.com/photo-1581093458791-9f302e683057?q=80&w=2070&auto=format&fit=crop",
    desc: "Realizzazione di componenti meccanici funzionali"
  },
  {
    id: 2,
    title: "Cosplay Armor",
    image: "https://images.unsplash.com/photo-1535581652167-3d6b986b7972?q=80&w=2070&auto=format&fit=crop",
    desc: "Parti di armatura su misura per cosplay"
  },
  {
    id: 3,
    title: "Modellismo Architettonico",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
    desc: "Plastici dettagliati per studi di architettura"
  }
];
