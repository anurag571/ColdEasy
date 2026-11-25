export interface ProductImageItem {
  url?: string;
  label: string;
  sublabel: string;
}

export interface ProductGalleryItem extends ProductImageItem {
  id: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  group: 'main' | 'other';
  mrp: number | null;
  price: number | null; // null if unknown
  saveAmount?: number;
  inStock: boolean;
  rating?: number;
  reviewCount?: string;
  emiEligible?: boolean;
  emiFromPerMonth?: string;
  images: {
    main: ProductImageItem;
    hover: ProductImageItem;
    gallery?: ProductGalleryItem[];
    variantGalleries?: {
      solar?: ProductGalleryItem[];
      grid?: ProductGalleryItem[];
    };
  };
  shortDescription: string;
  bestFor: string[];
  notFor: string[];
  specs: ProductSpec[];
  measurements?: ProductSpec[];
  materialsAndCare?: ProductSpec[];
  highlights?: string[];
  seecSection?: {
    headline: string;
    copy: string;
    learnMoreHref: string;
  };
  faqs: FaqItem[];
}

export const SHOW_RATINGS = false;
export const DEFAULT_REVIEW_COUNT = '[TBC]';

export const PRODUCTS: Product[] = [
  {
    id: 'coldeasy-box',
    slug: 'coldeasy-box',
    name: 'ColdEasy Box',
    group: 'main',
    mrp: 4999,
    price: 3990,
    saveAmount: 1009,
    inStock: true,
    rating: 4.9,
    emiEligible: false,
    shortDescription:
      'ColdEasy Box keeps fruits and vegetables fresh for longer without using electricity. It uses water-based cooling to lower temperature and maintain high humidity, which reduces spoilage and weight loss. The compact design suits retailers, vendors, and homes, and also works well during transport.',
    images: {
      main: {
        url: '/products/coldeasy-box/studio-front.jpg',
        label: 'ColdEasy Box – Studio',
        sublabel: 'Single crate studio view',
      },
      hover: {
        url: '/products/coldeasy-box/studio-angle.jpg',
        label: 'ColdEasy Box – Studio Perspective',
        sublabel: 'Single crate studio view',
      },
      gallery: [
        {
          id: 'box-hero',
          url: '/products/coldeasy-box/front.png',
          label: 'ColdEasy Box – Front View',
          sublabel: 'Single crate studio view',
        },
        {
          id: 'studio-shot',
          url: '/products/coldeasy-box/studio.jpg',
          label: 'ColdEasy Box – Studio',
          sublabel: 'Single crate studio view',
        },
        {
          id: 'studio-angle',
          url: '/products/coldeasy-box/studio-angle.jpg',
          label: 'ColdEasy Box – Studio Perspective',
          sublabel: 'Single crate studio view',
        },
        {
          id: 'assembled-box',
          url: '/products/coldeasy-box/exploded-poster.jpg',
          label: 'ColdEasy Box – Component View',
          sublabel: 'Exploded view of the ColdEasy Box',
        },
        {
          id: 'ready-unit',
          url: '/products/coldeasy-box/exploded-end.jpg',
          label: 'ColdEasy Box – Assembled',
          sublabel: 'Assembled ColdEasy Box',
        },
      ],
    },
    highlights: [
      'Tomato shelf life [TBC]',
      'Spinach shelf life [TBC]',
      'Shelf life [TBC]',
      'Capacity 25 kg',
      'Faster Cooling 3.5x',
      'Cooling Delta 12C',
      'Water-Based Cooling H2O',
      'Relative Humidity 90%',
    ],
    bestFor: [
      'Fruits (Apples, Mangoes, Oranges, Berries)',
      'Vegetables (Tomatoes, Capsicum, Greens, Cucumbers)',
      'Cut Flowers (Marigolds, Jasmine, Roses)',
    ],
    notFor: [
      'Raw Meat & Poultry (Requires sub-freezing)',
      'Fish & Seafood',
      'Dairy & Ice Products',
    ],
    specs: [
      {
        label: 'Features & Specs',
        value: 'Impact Resistant, No Electricity Required, Shatterproof, Stackable, Water based',
      },
    ],
    measurements: [
      { label: 'Item Dimensions', value: '65L x 45W x 45H cm' },
      { label: 'Capacity', value: '47 Litres' },
      { label: 'Item Weight', value: '6 kg 700 g' },
      { label: 'Number of Items', value: '1' },
      { label: 'Storage Volume', value: '47 Liters' },
      { label: 'Unit Count', value: '1.0 Count' },
      { label: 'Item Package Quantity', value: '1' },
    ],
    materialsAndCare: [
      { label: 'Material Type', value: 'Plastic' },
      { label: 'Material Features', value: 'Is food safe' },
    ],
    seecSection: {
      headline: 'Powered by Structurally Enhanced Evaporative Cooling Technology',
      copy: 'ColdEasy Box uses passive cooling technology to create a controlled storage environment for fresh produce. The system uses water evaporation and airflow to maintain lower storage temperatures and improved humidity levels. This helps slow down the deterioration of fruits and vegetables while preserving their freshness. Because the system does not rely on conventional refrigeration, it can operate efficiently in rural environments with minimal infrastructure.',
      learnMoreHref: '#/science',
    },
    faqs: [
      {
        question: 'What is SEEC?',
        answer:
          'It stands for Structurally Enhanced Evaporative Cooling, the same physics that cools your skin when sweat evaporates, built into a deployable system for farm and vendor use.',
      },
      {
        question: 'How does the ColdEasy Box work without electricity?',
        answer:
          'The wet SEEC pad draws in warm, dry air. Water evaporates and absorbs heat, dropping the temperature inside, with no compressor, refrigerant or electricity.',
      },
      {
        question: 'Can I store meat, fish or dairy?',
        answer: 'No. It works best for fruits, vegetables and flowers.',
      },
      {
        question: 'What water do I need?',
        answer: 'Room-temperature tap water.',
      },
    ],
  },
  {
    id: 'coldeasy-autobox-3',
    slug: 'coldeasy-autobox-3',
    name: 'ColdEasy AutoBox – 3 Box',
    group: 'main',
    mrp: 19999,
    price: 15490,
    saveAmount: 4509,
    inStock: true,
    rating: 4.87,
    emiEligible: true,
    emiFromPerMonth: '₹1,420',
    shortDescription:
      'Automated water distribution across three stacked crates. High-capacity cooling for retailers, mandi vendors and aggregation points.',
    images: {
      main: {
        url: '/products/coldeasy-autobox-3/ac-grid.jpg',
        label: 'ColdEasy AutoBox – 3 Box, AC Grid Setup',
        sublabel: 'Three stacked crates with wall-plug controller and water line',
      },
      hover: {
        url: '/products/coldeasy-autobox-3/ac-grid.jpg',
        label: 'ColdEasy AutoBox – 3 Box, AC Grid Setup',
        sublabel: 'Three stacked crates with wall-plug controller and water line',
      },
      gallery: [
        {
          id: 'autobox-3-ac-grid',
          url: '/products/coldeasy-autobox-3/ac-grid.jpg',
          label: 'ColdEasy AutoBox 3 – AC Grid Setup',
          sublabel: 'Three stacked crates with wall-plug controller and water line',
        },
        {
          id: 'autobox-3-solar',
          url: '/products/coldeasy-autobox-3/solar.jpeg',
          label: 'ColdEasy AutoBox 3 – Solar Powered Setup',
          sublabel:
            'Triple-tier evaporative cooling stack with solar panel and automated pump controller',
        },
        {
          id: 'autobox-3-grid-front',
          url: '/products/coldeasy-autobox-3/grid-front.jpeg',
          label: 'ColdEasy AutoBox 3 – AC Grid Front View',
          sublabel: 'Triple-tier stack configured for standard wall AC power',
        },
        {
          id: 'autobox-3-grid-angle',
          url: '/products/coldeasy-autobox-3/grid-angle.jpeg',
          label: 'ColdEasy AutoBox 3 – AC Grid Perspective',
          sublabel: '3/4 studio view showing vertical water distribution line and AC controller',
        },
        {
          id: 'autobox-3-studio',
          url: '/products/coldeasy-autobox-3/studio.jpg',
          label: 'ColdEasy AutoBox 3 – Studio',
          sublabel: 'Three-crate stack studio view',
        },
      ],
      variantGalleries: {
        solar: [
          {
            id: 'autobox-3-solar',
            url: '/products/coldeasy-autobox-3/solar.jpeg',
            label: 'ColdEasy AutoBox 3 – Solar Powered Setup',
            sublabel:
              'Triple-tier evaporative cooling stack with solar panel and automated pump controller',
          },
          {
            id: 'autobox-produce',
            url: '/products/coldeasy-autobox-3/studio.jpg',
            label: 'ColdEasy AutoBox – Internal Produce Trays',
            sublabel: 'Reinforced crate structure holding leafy greens and vegetables',
          },
          {
            id: 'autobox-3-grid-angle',
            url: '/products/coldeasy-autobox-3/grid-angle.jpeg',
            label: 'ColdEasy AutoBox 3 – AC Grid Perspective',
            sublabel: '3/4 studio view showing vertical water distribution line and AC controller',
          },
          {
            id: 'autobox-3-grid-front',
            url: '/products/coldeasy-autobox-3/grid-front.jpeg',
            label: 'ColdEasy AutoBox 3 – AC Grid Front View',
            sublabel: 'Triple-tier stack configured for standard wall AC power',
          },
        ],
        grid: [
          {
            id: 'autobox-3-ac-grid',
            url: '/products/coldeasy-autobox-3/ac-grid.jpg',
            label: 'ColdEasy AutoBox 3 – AC Grid Setup',
            sublabel: 'Three stacked crates with wall-plug controller and water line',
          },
          {
            id: 'autobox-3-grid-front',
            url: '/products/coldeasy-autobox-3/grid-front.jpeg',
            label: 'ColdEasy AutoBox 3 – AC Grid Front View',
            sublabel: 'Triple-tier stack configured for standard wall AC power',
          },
          {
            id: 'autobox-3-grid-angle',
            url: '/products/coldeasy-autobox-3/grid-angle.jpeg',
            label: 'ColdEasy AutoBox 3 – AC Grid Perspective',
            sublabel: '3/4 studio view showing vertical water distribution line and AC controller',
          },
          {
            id: 'autobox-produce',
            url: '/products/coldeasy-autobox-3/studio.jpg',
            label: 'ColdEasy AutoBox – Internal Produce Trays',
            sublabel: 'Reinforced crate structure holding leafy greens and vegetables',
          },
          {
            id: 'autobox-3-solar',
            url: '/products/coldeasy-autobox-3/solar.jpeg',
            label: 'ColdEasy AutoBox 3 – Solar Powered Setup',
            sublabel: 'Also available with off-grid solar panel and controller kit',
          },
        ],
      },
    },
    highlights: [
      'Tomato shelf life [TBC]',
      'Spinach shelf life [TBC]',
      'Shelf life [TBC]',
      'Capacity 25 kg per crate',
      'Faster Cooling 3.5x',
      'Cooling Delta 12C',
      'Water-Based Cooling H2O',
      'Relative Humidity 90%',
      'Shelf life [TBC]',
      'SOLAR POWERED (Runs on clean, renewable solar energy)',
      'AUTO WATERING (Waters the crates automatically as per schedule)',
      '3 CRATES CAPACITY (3 stacked crates for maximum storage)',
      'MOTOR + TANK SYSTEM (Powerful motor in bottom tank for efficient flow)',
      'TIME & LABOUR SAVING (No manual watering, no extra effort)',
    ],
    bestFor: [
      'Bulk Mandi Produce Batches',
      'Farmer Producer Collectives',
      'Daily Farm Collection Points',
    ],
    notFor: ['Processed Dairy & Liquid Milk', 'Frozen Fish & Poultry'],
    specs: [
      // TODO(client): confirmed specs for AutoBox 3
      { label: 'Specs', value: 'Details to be added' },
    ],
    measurements: [
      { label: 'Capacity', value: '129 litres' },
      { label: 'Item Dimensions', value: '65L x 45W x 115.5H cm' },
      { label: 'Item Weight', value: '26 kg 500 g' },
      { label: 'Unit Count', value: '1 Count' },
      { label: 'Size', value: 'Large' },
    ],
    materialsAndCare: [
      { label: 'Material Type', value: 'Plastic' },
      { label: 'Material Features', value: 'Reusable' },
      { label: 'Is the item dishwasher safe?', value: 'No' },
      { label: 'Is the item microwaveable?', value: 'No' },
    ],
    faqs: [
      {
        question: 'How is water automated across 3 crates?',
        answer:
          'The automated watering system distributes water to all three crates as per schedule without manual refilling.',
      },
      {
        question: 'Can the crates be detached?',
        answer: 'Yes, crates can be separated for loading and market display.',
      },
    ],
  },
  {
    id: 'coldeasy-autobox-2',
    slug: 'coldeasy-autobox-2',
    name: 'ColdEasy AutoBox – 2 Box',
    group: 'main',
    mrp: 14999,
    price: 12990,
    saveAmount: 2009,
    inStock: false, // ALWAYS sold out per client brief
    rating: 4.85,
    emiEligible: false,
    shortDescription:
      'Automated water feed for two stacked crates. Compact footprint for roadside stalls and retail store display.',
    images: {
      main: {
        url: '/products/coldeasy-autobox-2/solar.jpg',
        label: 'ColdEasy AutoBox – 2 Box, Solar Powered Setup',
        sublabel: 'Two stacked crates with solar panel, cables, and pump controller',
      },
      hover: {
        url: '/products/coldeasy-autobox-2/solar.jpg',
        label: 'ColdEasy AutoBox – 2 Box, Solar Powered Setup',
        sublabel: 'Two stacked crates with solar panel, cables, and pump controller',
      },
      gallery: [
        {
          id: 'autobox-2-solar',
          url: '/products/coldeasy-autobox-2/solar.jpg',
          label: 'ColdEasy AutoBox 2 – Solar Powered Setup',
          sublabel: 'Two stacked crates with solar panel, cables, and pump controller',
        },
      ],
      variantGalleries: {
        solar: [
          {
            id: 'autobox-2-solar',
            url: '/products/coldeasy-autobox-2/solar.jpg',
            label: 'ColdEasy AutoBox 2 – Solar Powered Setup',
            sublabel: 'Two stacked crates with solar panel, cables, and pump controller',
          },
        ],
        grid: [
          {
            id: 'autobox-2-grid',
            label: 'Images coming soon',
            sublabel: 'ColdEasy has not supplied an AutoBox 2 AC grid photo',
          },
        ],
      },
    },
    highlights: [
      'Tomato shelf life [TBC]',
      'Spinach shelf life [TBC]',
      'Shelf life [TBC]',
      'Faster Cooling 3.5x',
      'Cooling Delta 12C',
      'Water-Based Cooling H2O',
      'Relative Humidity 90%',
      'Shelf life [TBC]',
      'SOLAR POWERED (Runs on clean, renewable solar energy)',
      'AUTO WATERING (Waters the crates automatically as per schedule)',
      '2 CRATES CAPACITY',
      'MOTOR + TANK SYSTEM (Powerful motor in bottom tank for efficient flow)',
      'TIME & LABOUR SAVING (No manual watering, no extra effort)',
    ],
    bestFor: ['Roadside Pushcarts', 'Neighbourhood Retail Kiosks', 'Daily Retail Displays'],
    notFor: ['Frozen Poultry & Fish', 'Dairy Products'],
    specs: [
      // TODO(client): confirmed specs for AutoBox 2
      { label: 'Specs', value: 'Details to be added' },
    ],
    measurements: [
      { label: 'Capacity', value: '86 litres' },
      { label: 'Item Dimensions', value: '65L x 45W x 80H cm' },
      { label: 'Item Weight', value: '18 kg' },
      { label: 'Unit Count', value: '1 Count' },
    ],
    materialsAndCare: [
      { label: 'Material Type', value: 'Plastic' },
      { label: 'Material Features', value: 'Reusable' },
      { label: 'Is the item dishwasher safe?', value: 'No' },
      { label: 'Is the item microwaveable?', value: 'No' },
    ],
    faqs: [
      {
        question: 'When will AutoBox – 2 Box be restocked?',
        answer:
          'Our manufacturing batch is currently in production. Use the "Notify me" button to receive an alert on WhatsApp the instant stock goes live.',
      },
    ],
  },
  {
    id: 'coldeasy-breezey',
    slug: 'coldeasy-breezey',
    name: 'ColdEasy Breezy',
    group: 'other',
    mrp: null,
    price: null, // Price coming soon per brief
    inStock: true,
    shortDescription:
      'Complete space cooling and continuous fresh air ventilation with outdoor evaporative unit, insulated air channel, and 360° ceiling diffuser.',
    images: {
      main: {
        url: '/products/coldeasy-breezy/poster.jpeg',
        label: 'ColdEasy Breezy – Hardware Kit',
        sublabel: 'Outdoor evaporative unit, insulated air channel, and 360° ceiling diffuser',
      },
      hover: {
        url: '/products/coldeasy-breezy/poster.jpeg',
        label: 'ColdEasy Breezy – Clean Hardware System',
        sublabel: 'Outdoor evaporative unit, insulated air channel, and 360° ceiling diffuser',
      },
      gallery: [
        {
          id: 'breezy-hardware-kit',
          url: '/products/coldeasy-breezy/hardware-kit.jpeg',
          label: 'ColdEasy Breezy – Complete Hardware System',
          sublabel: 'Outdoor evaporative unit, flexible insulated duct, and 360° diffuser',
        },
        {
          id: 'breezy-overview-poster',
          url: '/products/coldeasy-breezy/installation-poster.jpeg',
          label: 'ColdEasy Breezy – Architectural Installation',
          sublabel: 'Outdoor Unit (01), Insulated Air Channel (02), and 360° Ceiling Diffuser (03)',
        },
        {
          id: 'breezy-installation-clean',
          url: '/products/coldeasy-breezy/installation.jpg',
          label: 'ColdEasy Breezy – Space Cooling Layout',
          sublabel: 'Continuous ventilation for produce packing sheds and work areas',
        },
      ],
    },
    bestFor: [
      'Farm Packing Sheds & Collection Centres',
      'Rural Workspaces & Processing Sheds',
      'Homesteads & High-Heat Work Areas',
      'Mandi Kiosks & Produce Retail Hubs',
    ],
    notFor: [
      'Airtight sealed walk-in freezers (requires passive air relief)',
      'Sub-zero frozen meat & ice storage',
    ],
    specs: [
      // TODO(client): Breezy full specs
      { label: 'Specifications', value: 'Details coming soon' },
    ],
    faqs: [
      {
        question: 'How does ColdEasy Breezy work?',
        answer:
          'ColdEasy Breezy mounts an evaporative cooling unit outdoors. Chilled, fresh air passes through an insulated air duct into the room, where a 360° ceiling diffuser disperses it evenly.',
      },
    ],
  },
  {
    id: 'coldeasy-mushroom-maker',
    slug: 'coldeasy-mushroom-maker',
    name: 'ColdEasy Mushroom Maker',
    group: 'other',
    mrp: null,
    price: null, // Price coming soon per brief
    inStock: true,
    shortDescription:
      'Controlled micro-climate evaporative chamber maintaining high relative humidity for mushroom cultivation.',
    images: {
      main: {
        url: '/products/coldeasy-mushroom-maker/studio.jpg',
        label: 'ColdEasy Mushroom Maker – Chamber View',
        sublabel: 'Precision temperature and humidity-controlled chamber',
      },
      hover: {
        url: '/products/coldeasy-mushroom-maker/facility.jpeg',
        label: 'ColdEasy Mushroom Maker – Commercial Facility',
        sublabel: 'Cultivation environment maintaining high relative humidity',
      },
      gallery: [
        {
          id: 'chamber-cross-section',
          url: '/products/coldeasy-mushroom-maker/chamber.jpg',
          label: 'ColdEasy Mushroom Maker – Cross-Section',
          sublabel: 'Controlled microclimate chamber',
        },
      ],
    },
    bestFor: [
      'Oyster Mushroom Cultivation',
      'Milky Mushroom Micro-units',
      'Homestead growers & SHGs',
    ],
    notFor: ['Dry grain storage', 'Non-humidity crops'],
    specs: [
      // TODO(client): Mushroom Maker full specs
      { label: 'Specifications', value: 'Details coming soon' },
    ],
    faqs: [
      {
        question: 'Can this maintain the high humidity mushrooms require?',
        answer:
          'Yes, the ColdEasy Mushroom Maker creates an enclosed microclimate maintaining high relative humidity suitable for mushroom cultivation.',
      },
    ],
  },
  {
    id: 'coldeasy-onion-keeper',
    slug: 'coldeasy-onion-keeper',
    name: 'ColdEasy Onion Keeper',
    group: 'other',
    mrp: null,
    price: null, // Price coming soon per brief
    inStock: true,
    shortDescription:
      'Specialised dry-airflow evaporative storage avoiding rotting and premature sprouting in bulk onions and garlic.',
    images: {
      main: {
        url: '/products/coldeasy-onion-keeper/exterior.jpg',
        label: 'ColdEasy Onion Keeper – Exterior',
        sublabel: 'Storage building with side cooling units and an open onion bay',
      },
      hover: {
        url: '/products/coldeasy-onion-keeper/store.jpg',
        label: 'ColdEasy Onion Keeper – Onion store',
        sublabel: 'Open store filled with onions and a row of cooling units',
      },
      gallery: [
        {
          id: 'onion-exterior',
          url: '/products/coldeasy-onion-keeper/exterior.jpg',
          label: 'ColdEasy Onion Keeper – Exterior',
          sublabel: 'Storage building with side cooling units and an open onion bay',
        },
        {
          id: 'onion-store',
          url: '/products/coldeasy-onion-keeper/store.jpg',
          label: 'ColdEasy Onion Keeper – Onion store',
          sublabel: 'Open store filled with onions and a row of cooling units',
        },
      ],
    },
    bestFor: ['Red & White Onions', 'Garlic Bulbs', 'Shallots & Root Vegetables'],
    notFor: ['High-moisture leafy greens', 'Cut Flowers'],
    specs: [
      // TODO(client): Onion Keeper full specs
      { label: 'Specifications', value: 'Details coming soon' },
    ],
    faqs: [
      {
        question: 'Why do onions need specialised airflow?',
        answer:
          'Onions require low surface moisture and continuous air circulation to prevent fungal rot and sprouting.',
      },
    ],
  },
];

export interface ComparisonItem {
  status: 'positive' | 'negative' | 'neutral';
  text: string;
}

export interface ComparisonPoint {
  id: string;
  fridge: ComparisonItem;
  coldEasy: ComparisonItem;
}

export const COMPARISON_POINTS: ComparisonPoint[] = [
  {
    id: 'power',
    fridge: { status: 'negative', text: 'Requires electricity' },
    coldEasy: { status: 'positive', text: 'Works without electricity' },
  },
  {
    id: 'meat-fish',
    fridge: { status: 'positive', text: 'Can store meat, fish & dairy products' },
    coldEasy: { status: 'negative', text: 'Not designed for meat & fish' },
  },
  {
    id: 'ethylene',
    fridge: { status: 'negative', text: 'Ethylene can accumulate and accelerates ripening' },
    coldEasy: {
      status: 'positive',
      text: 'Constant airflow allows ethylene-rich air to escape and keeps produce fresh',
    },
  },
  {
    id: 'mobility',
    fridge: { status: 'negative', text: 'Stationary' },
    coldEasy: { status: 'positive', text: 'Portable & easy to deploy' },
  },
  {
    id: 'cooling-type',
    fridge: { status: 'neutral', text: 'Compressor-based cooling' },
    coldEasy: { status: 'neutral', text: 'Evaporation-based cooling' },
  },
];

export interface VideoSourcesConfig {
  video1080: string;
  video720: string;
  poster: string;
  endFrame: string;
}

export const VIDEO_SOURCES: VideoSourcesConfig = {
  video1080: '/assets/aistudio/Coldeasy_box_extended_final_cut.mp4?v=final',
  video720: '/assets/aistudio/Coldeasy_box_extended_final_cut.mp4?v=final',
  poster: '/video/coldeasy-box-exploded-poster.jpg',
  endFrame: '/video/coldeasy-box-exploded-end-frame.jpg',
};

export interface HowItWorksStep {
  id: number;
  start: number; // in seconds
  end: number; // in seconds
  title: string;
  description: string;
}

// Marks follow Coldeasy_final_cut.mp4 (56.2s).
export const HARDWARE_VIDEO_DURATION = 56.2;

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    id: 1,
    start: 0,
    end: 1.2,
    title: 'Full Product',
    description: 'The complete ColdEasy Box unit ready for deployment at field or market.',
  },
  {
    id: 2,
    start: 1.2,
    end: 6.6,
    title: '360° Rotation',
    description: 'Seamless ergonomic exterior with durable produce storage chamber.',
  },
  {
    id: 3,
    start: 6.6,
    end: 15.6,
    title: 'Lid + Box + Water Tank Separate',
    description: 'Modular sub-assemblies separate smoothly without tools.',
  },
  {
    id: 4,
    start: 15.6,
    end: 18.4,
    title: 'Lid and Tank Disappear',
    description: 'Revealing the inner honeycomb SEEC evaporative core.',
  },
  {
    id: 5,
    start: 18.4,
    end: 21,
    title: 'Cooling Pad Slides Out Halfway',
    description:
      'SEEC cooling pad with high-surface wicking media for optimal moisture absorption.',
  },
  {
    id: 6,
    start: 21,
    end: 33,
    title: 'Water Trickles Down',
    description: 'Tap water trickles evenly through the honeycomb matrix by gravity.',
  },
  {
    id: 7,
    start: 33,
    end: 39,
    title: 'Air Flow & Evaporation',
    description: 'Outside air → wet pad → evaporation → cooler air blankets produce.',
  },
  {
    id: 8,
    start: 39,
    end: 45.6,
    title: 'Reassemble',
    description: 'Parts slot firmly back into place as a compact, self-contained unit.',
  },
  {
    id: 9,
    start: 45.6,
    end: 56.3,
    title: 'Cooling Without Electricity',
    description: 'Pure thermodynamic cooling: zero motor, zero fan, zero electricity.',
  },
];

export interface TestimonialStory {
  id: string;
  customerName: string;
  location: string;
  fpoRole?: string;
  crop?: string;
  quote: string;
  description: string;
  storyUrl: string;
  videoUrl?: string;
  image?: string;
  photoPlaceholder?: boolean;
}

// 4 Verified Real Customer Stories from the client brief
export const TESTIMONIAL_STORIES: TestimonialStory[] = [
  {
    id: 'gunja-devi',
    customerName: 'Gunja Devi',
    location: 'Patna, Bihar',
    fpoRole: 'Vegetable Vendor',
    crop: 'Vegetables & Leafy Greens',
    quote:
      '"ColdEasy helped preserve produce quality and maintain market earnings without reliance on electricity."',
    description: 'Improving livelihood resilience for smallholder vegetable retailers.',
    storyUrl: 'https://www.coldeasy.in/deployment-story/improving-livelihood-resilience',
    image: '/stories/gunja-devi.jpg',
  },
  {
    id: 'sobha-devi',
    customerName: 'Sobha Devi',
    location: 'Gaya, Bihar',
    fpoRole: 'Produce Seller',
    crop: 'Fresh Produce',
    quote:
      '"With evaporative storage, daily produce retains its weight and firmness through long market hours."',
    description: 'Reducing post-harvest loss and protecting vendor margins in regional markets.',
    storyUrl: 'https://www.coldeasy.in/deployment-story/improving-livelihood-resilience',
    photoPlaceholder: true, // TODO(client): Provide actual photo of Sobha Devi
  },
  {
    id: 'lathabhai-jadhav',
    customerName: 'Lathabhai Jadhav',
    location: 'Latur, Maharashtra',
    fpoRole: 'Farmer & Vendor',
    crop: 'Farm Produce',
    quote: '"Affordable storage without conventional refrigeration."',
    description: 'Practical field cooling solution keeping produce market-ready.',
    storyUrl: 'https://www.youtube.com/shorts/R679p8fJiF4',
    videoUrl: 'https://www.youtube.com/shorts/R679p8fJiF4',
    photoPlaceholder: true, // TODO(client): Provide actual photo of Lathabhai Jadhav
  },
  {
    id: 'vannama-lakshmi',
    customerName: 'Vannama & Lakshmi',
    location: 'Andhra Pradesh',
    fpoRole: 'Community Producers',
    crop: 'Daily Harvest',
    quote: '"Everyday efficiency with the ColdEasy Box."',
    description:
      'Decentralized cooling enabling smallholder producers to protect their harvest value.',
    storyUrl: 'https://www.coldeasy.in/deployment-story/everyday-efficiency-coldeasy-box',
    photoPlaceholder: true, // TODO(client): Provide actual photo of Vannama & Lakshmi
  },
];

// 8 Verified FAQs from the client brief
export const FAQS: FaqItem[] = [
  {
    question: 'What is SEEC?',
    answer:
      'It stands for Structurally Enhanced Evaporative Cooling, the same physics that cools your skin when sweat evaporates, built into a deployable system for farm and vendor use.',
  },
  {
    question: 'How does the ColdEasy Box work without electricity?',
    answer:
      'The wet SEEC pad draws in warm, dry air. Water evaporates and absorbs heat, dropping the temperature inside, with no compressor, refrigerant or electricity.',
  },
  {
    question: 'Can I store meat, fish or dairy?',
    answer: 'No. It works best for fruits, vegetables and flowers.',
  },
  {
    question: 'What water do I need?',
    answer: 'Room-temperature tap water.',
  },
  {
    question: 'Can it be used during transport?',
    answer: 'Yes, it is lightweight and portable.',
  },
  {
    question: 'Does the moisture cause pests or fungus?',
    answer: 'Continuous airflow helps prevent this.',
  },
  {
    question: 'How do I become a distributor?',
    answer:
      'You can apply online at our Become a Distributor page or connect directly with our partnership team on WhatsApp (+91 91829 68542).',
  },
  {
    question: 'Do you offer EMI?',
    answer:
      "EMI is available on eligible products at checkout, subject to your bank's eligibility.",
  },
];

export const FREE_SHIPPING_THRESHOLD = 5000;
export const EMI_THRESHOLD = 15000;

// Impact figures have no source yet (11:I-01).
export const IMPACT_METRICS = [
  { label: 'Units deployed', value: '[TBC]' },
  { label: 'Households impacted', value: '[TBC]' },
  { label: 'Tonnes food waste avoided', value: '[TBC]' },
  { label: 'Income protected / generated', value: '[TBC]' },
];

export interface TeamMember {
  name: string;
  role: string;
  photo: string;
  linkedin?: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Vishal Singhal',
    role: 'CEO',
    photo: '/assets/team/vishal_singhal.jpg',
    linkedin: 'https://www.linkedin.com/search/results/all/?keywords=Vishal%20Singhal%20Temperate',
  },
  {
    name: 'Rishabh Anand',
    role: 'PM – New Product Development',
    photo: '/assets/team/rishabh_anand.jpg',
    linkedin: 'https://www.linkedin.com/search/results/all/?keywords=Rishabh%20Anand%20Temperate',
  },
  {
    name: 'Abdul Nazim',
    role: 'PM – R&D',
    photo: '/assets/team/abdul_nazim.jpg',
    linkedin: 'https://www.linkedin.com/search/results/all/?keywords=Abdul%20Nazim%20Temperate',
  },
  {
    name: 'Vijay Nakkala',
    role: 'Engineer',
    photo: '/assets/team/vijay_nakkala.jpg',
    linkedin: 'https://www.linkedin.com/search/results/all/?keywords=Vijay%20Nakkala%20Temperate',
  },
  {
    name: 'Sanchi Madan',
    role: 'Impact and Partnerships Manager',
    photo: '/assets/team/sanchi_madan.jpg',
    linkedin: 'https://www.linkedin.com/search/results/all/?keywords=Sanchi%20Madan%20Temperate',
  },
  {
    name: 'Saptarshi Paul',
    role: "Marketing & Founder's Office",
    photo: '/assets/team/saptarshi_paul.jpg',
    linkedin: 'https://www.linkedin.com/search/results/all/?keywords=Saptarshi%20Paul%20Temperate',
  },
  {
    name: 'Bala Karthik',
    role: 'Engineer',
    photo: '/assets/team/bala_karthik.jpg',
    linkedin: 'https://www.linkedin.com/search/results/all/?keywords=Bala%20Karthik%20Temperate',
  },
  {
    name: 'P Manoj Kumar',
    role: 'Technician',
    photo: '/assets/team/p_manoj_kumar.jpg',
  },
  {
    name: 'Krishna Verma',
    role: 'Technician',
    photo: '/assets/team/krishna_verma.jpg',
  },
  {
    name: 'Anil Yadav',
    role: 'Technician',
    photo: '/assets/team/anil_yadav.jpg',
  },
  {
    name: 'Bhim Kumar Verma',
    role: 'Technician',
    photo: '/assets/team/bhim_kumar_verma.jpg',
  },
];

// Lead form benefit points
export const FORM_BENEFITS = {
  distributor: [
    'Distributor terms [TBC]',
    'Dedicated technical, marketing, and display demonstration kits',
    'Priority batch allocation and local logistics routing support',
  ],
  partner: [
    'Co-designed field pilots for smallholder aggregation hubs',
    'Customized reporting for CSR and climate resilience mandates',
    'Direct technical training for rural extension officers and FPO staff',
  ],
  affiliate: [
    'Commission [TBC]',
    'Custom tracked links and WhatsApp promotional creatives',
    'Payout [TBC]',
  ],
  bulk: [
    'Volume-based tier discounts for FPOs, mandis, and retail chains',
    'Dedicated logistics planning for multi-district bulk consignments',
    'Custom branding and crate serialization options available',
  ],
};

export const INDIAN_STATES_AND_UTS = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

export const MOCK_PINCODE_LOOKUP: Record<
  string,
  { city: string; state: string; serviceable: boolean; estimateDays: string }
> = {
  '560001': { city: 'Bengaluru', state: 'Karnataka', serviceable: true, estimateDays: '3–5 days' },
  '500001': { city: 'Hyderabad', state: 'Telangana', serviceable: true, estimateDays: '2–4 days' },
  '400001': { city: 'Mumbai', state: 'Maharashtra', serviceable: true, estimateDays: '3–5 days' },
  '422001': { city: 'Nashik', state: 'Maharashtra', serviceable: true, estimateDays: '3–5 days' },
  '563101': { city: 'Kolar', state: 'Karnataka', serviceable: true, estimateDays: '3–5 days' },
  '515001': {
    city: 'Anantapur',
    state: 'Andhra Pradesh',
    serviceable: true,
    estimateDays: '3–5 days',
  },
  '110001': { city: 'New Delhi', state: 'Delhi', serviceable: true, estimateDays: '4–6 days' },
  '600001': { city: 'Chennai', state: 'Tamil Nadu', serviceable: true, estimateDays: '3–5 days' },
  '700001': { city: 'Kolkata', state: 'West Bengal', serviceable: true, estimateDays: '4–6 days' },
  '411001': { city: 'Pune', state: 'Maharashtra', serviceable: true, estimateDays: '3–5 days' },
};

export function lookupPincode(pin: string) {
  const clean = pin.trim();
  if (clean.startsWith('79')) {
    return {
      pincode: clean,
      city: 'Remote Region',
      state: 'Northeast Region',
      serviceable: false,
      estimateDays: 'Unavailable',
    };
  }
  if (MOCK_PINCODE_LOOKUP[clean]) {
    return {
      pincode: clean,
      ...MOCK_PINCODE_LOOKUP[clean],
    };
  }
  return {
    pincode: clean,
    city: 'Local Mandi Hub',
    state: 'State Hub',
    serviceable: true,
    estimateDays: '4–7 days',
  };
}

export interface FitQuestion {
  id: 'crops' | 'volume' | 'mobility';
  label: string;
  options: {
    label: string;
    value: string;
  }[];
}

export const FIT_QUESTIONS: FitQuestion[] = [
  {
    id: 'crops',
    label: 'What do you store?',
    options: [
      { label: 'Tomatoes & Mixed Vegetables', value: 'mixed_veg' },
      { label: 'Leafy Greens', value: 'greens' },
      { label: 'Cut Flowers', value: 'flowers' },
      { label: 'Onions & Garlic', value: 'onions' },
      { label: 'Mushrooms', value: 'mushrooms' },
    ],
  },
  {
    id: 'volume',
    label: 'How much per day?',
    options: [
      { label: '1–2 Crates (25–50 kg)', value: 'small' },
      { label: '3+ Crates (75+ kg)', value: 'large' },
    ],
  },
  {
    id: 'mobility',
    label: 'Do you need to move it?',
    options: [
      { label: 'Yes, on cart or transport', value: 'mobile' },
      { label: 'Stationary at shop or farm shed', value: 'stationary' },
    ],
  },
];

export function getRecommendedProduct(answers: Record<string, string>): {
  product: Product;
  reason: string;
} {
  if (answers.crops === 'onions') {
    const prod = PRODUCTS.find((p) => p.slug === 'coldeasy-onion-keeper') || PRODUCTS[0];
    return {
      product: prod,
      reason: 'Specialised dry airflow preventing sprouting in bulk onions and garlic.',
    };
  }
  if (answers.crops === 'mushrooms') {
    const prod = PRODUCTS.find((p) => p.slug === 'coldeasy-mushroom-maker') || PRODUCTS[0];
    return {
      product: prod,
      reason: 'Maintains enclosed microclimate with high relative humidity.',
    };
  }
  if (answers.volume === 'large') {
    const prod = PRODUCTS.find((p) => p.slug === 'coldeasy-autobox-3') || PRODUCTS[0];
    return {
      product: prod,
      reason: 'High capacity 3-crate configuration with automated water delivery.',
    };
  }

  const defaultProd = PRODUCTS.find((p) => p.slug === 'coldeasy-box') || PRODUCTS[0];
  return {
    product: defaultProd,
    reason:
      'Versatile portable water-based cooling crate suited for daily harvesting and market stalls.',
  };
}
