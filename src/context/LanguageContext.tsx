import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'coldeasy_lang';

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // TopBar & Header
    'topbar.signup_learn': 'Sign up to LEARN MORE',
    'topbar.signup_btn': 'Sign up',
    'topbar.tagline': 'Let your harvest wait for the right price.',
    'topbar.connect_wa': 'Connect on WhatsApp',
    'topbar.cart': 'Cart',
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.science': 'Science',
    'nav.impact': 'Impact',
    'nav.about': 'About Us',
    'nav.contact': 'Contact Us',
    'nav.track': 'Track Order',
    'nav.buy_box': 'Buy ColdEasy Box',

    // Hero Section
    'hero.badge': 'Zero Electricity Post-Harvest Cooling',
    'hero.headline': 'Picked fresh. Kept fresh. Zero electricity.',
    'hero.subhead': 'The ColdEasy Box keeps produce cool from farm to market.',
    'hero.desc':
      'Keeps fruit and vegetables fresh without electricity. Designed for smallholder farmers, street vendors, and retail kiosks across India.',
    'hero.cta_buy': 'BUY NOW',
    'hero.cta_wa': 'Connect on WhatsApp',
    'hero.trust_1': '✓ Passive SEEC Tech',
    'hero.trust_2': '✓ 100% Food Safe',
    'hero.trust_3': '✓ Built for Indian Climates',
    'hero.image_alt': 'ColdEasy Box - Passive SEEC evaporative cooling crate with fresh harvest',

    // Best Sellers Section
    'bestsellers.title': 'BEST SELLERS',
    'bestsellers.subtitle': 'Explore our deployable evaporative cooling models.',
    'bestsellers.view_all': 'VIEW PRODUCTS',

    // Comparison Section
    'comparison.title': 'FRIDGE VS COLDEASY BOX',
    'comparison.subtitle':
      'Designed specifically for farm-fresh fruits, vegetables and flowers where compressors fail or cost too much.',
    'comparison.fridge_title': 'Conventional Fridge',
    'comparison.fridge_subtitle': 'High power, sealed environment',
    'comparison.coldeasy_title': 'ColdEasy Box',
    'comparison.coldeasy_subtitle': 'Passive evaporative cooling',
    'comparison.pt1_fridge': 'Needs electricity',
    'comparison.pt1_coldeasy': 'Works without electricity',
    'comparison.pt2_fridge': 'Can store meat, fish and dairy',
    'comparison.pt2_coldeasy': 'Not designed for meat and fish',
    'comparison.pt3_fridge': 'Ethylene builds up and speeds ripening',
    'comparison.pt3_coldeasy': 'Constant airflow lets ethylene escape and keeps produce fresh',
    'comparison.pt4_fridge': 'Stationary',
    'comparison.pt4_coldeasy': 'Portable and easy to deploy',
    'comparison.pt5_fridge': 'Compressor-based cooling',
    'comparison.pt5_coldeasy': 'Evaporation-based cooling',

    // How ColdEasy Works
    'works.title': 'HOW COLDEASY WORKS',
    'works.subtitle':
      'Passive evaporative cooling (SEEC: Structurally Enhanced Evaporative Cooling) powered purely by thermodynamic airflow.',
    'works.step1_title': 'The ColdEasy Box',
    'works.step1_desc': 'Lightweight insulated crate ready at farm field or retail vendor stall.',
    'works.step2_title': 'Add tap water to the tank',
    'works.step2_desc':
      'Fill the integrated water reservoir with regular room-temperature tap water.',
    'works.step3_title': 'Water soaks SEEC cooling pad',
    'works.step3_desc': 'Capillary action naturally saturates the high-surface cooling pad.',
    'works.step4_title': 'Airflow & Evaporation',
    'works.step4_desc':
      'Warm outside air passes through wet pad; latent heat is absorbed as water evaporates.',
    'works.step5_title': 'Cool humid microclimate',
    'works.step5_desc': 'Keeps produce crisp and prevents moisture loss with temperature drop.',
    'works.conclusion': 'Cooling without electricity.',
    'works.note': 'Full 3D animation coming in a later phase.',

    // Testimonials
    'testimonials.title': 'CUSTOMER TESTIMONIALS',
    'testimonials.subtitle': 'Real stories. Real experiences. Real impact.',
    'testimonials.subheading_right': 'Ground Reality & Field Trials',
    'testimonials.marquee_hint': 'Scrolls continuously • Pause on hover',
    'testimonials.know_more': 'Know more →',

    // Media Section
    'media.title_prefix': "ColdEasy's",
    'media.title_suffix': 'Media Presence',
    'media.read_feature': 'Read Feature',

    // FAQs Section
    'faqs.title': 'FREQUENTLY ASKED QUESTIONS',
    'faqs.subtitle':
      'Everything you need to know about SEEC cooling, produce suitability, and daily operations.',

    // Footer
    'footer.tagline': 'Let your harvest wait for the right price.',
    'footer.product_of': 'Product of Temperate',
    'footer.nav_heading': 'Navigation',
    'footer.partner_heading': 'Partner With Us',
    'footer.distributor': 'Become a Distributor',
    'footer.partner': 'Become a Partner',
    'footer.affiliate': 'Become an Affiliate Partner',
    'footer.payment_gateway': 'Payment Gateway',
    'footer.secure_razorpay': 'Secure payments by Razorpay',
    'footer.copyright': '© 2026 ColdEasy. All Rights Reserved.',

    // Product Page Key Labels
    'product.in_stock': 'In Stock & Ready to Deploy',
    'product.out_of_stock': 'OUT OF STOCK',
    'product.no_electricity': 'No electricity',
    'product.portable': 'Portable',
    'product.tap_water': 'Tap water only',
    'product.best_for': 'Best For',
    'product.not_for': 'Not For',
    'product.specs': 'Specifications',
    'product.add_to_cart': 'ADD TO CART',
    'product.buy_now': 'BUY NOW',
    'product.bulk_enquiry_prompt': 'Need for FPO or bulk mandi orders? Submit a Bulk enquiry →',
    'product.chat_questions': 'Questions? Chat with us',
    'product.secure_payment': 'Secure payment',
    'product.delivery_pan_india': 'Delivery across India',
    'product.support_wa': 'Support on WhatsApp',

    // Cart
    'cart.empty_title': 'Your cart is empty',
    'cart.empty_desc':
      'Explore our passive evaporative cooling crates designed for fresh Indian produce.',
    'cart.shop_btn': 'Shop ColdEasy',
    'cart.subtotal': 'Subtotal',
    'cart.proceed_checkout': 'Proceed to checkout',
    'cart.check_delivery': 'Check Delivery Availability',
  },
  hi: {
    // TopBar & Header
    'topbar.signup_learn': 'अधिक जानकारी के लिए साइन अप करें',
    'topbar.signup_btn': 'साइन अप',
    'topbar.tagline': 'अपनी फसल को सही दाम मिलने तक ताज़ा रखें।',
    'topbar.connect_wa': 'व्हाट्सएप पर जुड़ें',
    'topbar.cart': 'कार्ट',
    'nav.home': 'होम',
    'nav.products': 'उत्पाद',
    'nav.science': 'शीतलन विज्ञान',
    'nav.impact': 'ज़मीनी प्रभाव',
    'nav.about': 'हमारे बारे में',
    'nav.contact': 'संपर्क करें',
    'nav.track': 'ऑर्डर ट्रैक करें',
    'nav.buy_box': 'कोल्डईज़ी बॉक्स खरीदें',

    // Hero Section
    'hero.badge': 'बिना बिजली की फसल कटाई बाद शीतलन तकनीक',
    'hero.headline': 'ताज़ा तुड़ाई। रहे ताज़ा। बिना बिजली।',
    'hero.subhead': 'कोल्डईज़ी बॉक्स खेत से मंडी तक उपज को ठंडा रखता है।',
    'hero.desc':
      'फल और सब्ज़ियों को बिना बिजली ताज़ा रखता है। भारत भर के छोटे किसानों, सब्ज़ी विक्रेताओं और कृषि मंडियों के लिए विशेष रूप से निर्मित।',
    'hero.cta_buy': 'अभी खरीदें',
    'hero.cta_wa': 'व्हाट्सएप पर बात करें',
    'hero.trust_1': '✓ पैसिव SEEC तकनीक',
    'hero.trust_2': '✓ 100% खाद्य सुरक्षित',
    'hero.trust_3': '✓ भारतीय मौसम के अनुकूल',
    'hero.image_alt': 'कोल्डईज़ी बॉक्स - ताज़ी फसल के साथ बिना बिजली वाष्पीकरणीय शीतलन क्रेट',

    // Best Sellers Section
    'bestsellers.title': 'सबसे लोकप्रिय उत्पाद',
    'bestsellers.subtitle': 'हमारे सहज वाष्पीकरणीय शीतलन क्रेट्स देखें।',
    'bestsellers.view_all': 'सभी उत्पाद देखें',

    // Comparison Section
    'comparison.title': 'फ्रिज बनाम कोल्डईज़ी बॉक्स',
    'comparison.subtitle':
      'विशेष रूप से ताज़े फल, सब्ज़ियों और फूलों के लिए डिज़ाइन किया गया जहाँ बिजली या फ्रिज की लागत बहुत अधिक है।',
    'comparison.fridge_title': 'पारंपरिक फ्रिज',
    'comparison.fridge_subtitle': 'उच्च बिजली खपत, बंद वातावरण',
    'comparison.coldeasy_title': 'कोल्डईज़ी बॉक्स',
    'comparison.coldeasy_subtitle': 'बिना बिजली वाष्पीकरणीय शीतलन',
    'comparison.pt1_fridge': 'बिजली की आवश्यकता होती है',
    'comparison.pt1_coldeasy': 'बिना बिजली के काम करता है',
    'comparison.pt2_fridge': 'मांस, मछली और दूध रखा जा सकता है',
    'comparison.pt2_coldeasy': 'मांस-मछली के लिए नहीं बनाया गया',
    'comparison.pt3_fridge': 'एथिलीन गैस जमा होकर जल्दी सड़ाती है',
    'comparison.pt3_coldeasy': 'निरंतर प्राकृतिक वायु प्रवाह गैस को बाहर निकालता है',
    'comparison.pt4_fridge': 'एक ही जगह स्थिर रहता है',
    'comparison.pt4_coldeasy': 'हल्का और खेत से मंडी ले जाने में आसान',
    'comparison.pt5_fridge': 'कंप्रेसर आधारित शीतलन',
    'comparison.pt5_coldeasy': 'वाष्पीकरण (Evaporation) आधारित शीतलन',

    // How ColdEasy Works
    'works.title': 'कोल्डईज़ी कैसे काम करता है',
    'works.subtitle': 'वाष्पीकरण के प्राकृतिक भौतिक विज्ञान (SEEC) द्वारा संचालित निरंतर प्राकृतिक शीतलन।',
    'works.step1_title': 'कोल्डईज़ी बॉक्स',
    'works.step1_desc': 'खेत में कटाई के समय या सब्ज़ी ठेले पर उपयोग के लिए तैयार हल्का इंसुलेटेड क्रेट।',
    'works.step2_title': 'टैंक में सादा पानी भरें',
    'works.step2_desc': 'इनबिल्ट पानी की टंकी में सामान्य नल का पानी डालें।',
    'works.step3_title': 'SEEC पैड पानी सोखता है',
    'works.step3_desc': 'केपिलरी क्रिया से शीतलन पैड की दीवारें समान रूप से भीग जाती हैं।',
    'works.step4_title': 'हवा और वाष्पीकरण',
    'works.step4_desc': 'गर्म बाहरी हवा गीले पैड से गुजरती है और वाष्पीकरण से हवा ठंडी हो जाती है।',
    'works.step5_title': 'ठंडी और नम हवा',
    'works.step5_desc': 'उत्पाद की नमी और ताज़गी बनाए रखता है और तापमान में गिरावट लाता है।',
    'works.conclusion': 'बिना बिजली के प्राकृतिक शीतलन।',
    'works.note': 'पूर्ण 3D एनिमेशन अगले चरण में उपलब्ध होगा।',

    // Testimonials
    'testimonials.title': 'किसानों और विक्रेताओं के अनुभव',
    'testimonials.subtitle': 'सच्ची कहानियाँ। वास्तविक अनुभव। ज़मीनी प्रभाव।',
    'testimonials.subheading_right': 'ज़मीनी परीक्षण और किसानों की प्रतिक्रिया',
    'testimonials.marquee_hint': 'लगातार चलता है • रोकने के लिए उंगली रखें',
    'testimonials.know_more': 'विस्तार से पढ़ें →',

    // Media Section
    'media.title_prefix': 'कोल्डईज़ी',
    'media.title_suffix': 'मीडिया में',
    'media.read_feature': 'पूरी रिपोर्ट पढ़ें',

    // FAQs Section
    'faqs.title': 'अक्सर पूछे जाने वाले सवाल',
    'faqs.subtitle': 'SEEC शीतलन, उपयुक्त फसलों और दैनिक उपयोग से जुड़े महत्वपूर्ण उत्तर।',

    // Footer
    'footer.tagline': 'अपनी फसल को सही दाम मिलने तक ताज़ा रखें।',
    'footer.product_of': 'टेम्परेट (Temperate) का उत्पाद',
    'footer.nav_heading': 'नेविगेशन',
    'footer.partner_heading': 'हमारे साथ जुड़ें',
    'footer.distributor': 'वितरक (Distributor) बनें',
    'footer.partner': 'पार्टनर बनें',
    'footer.affiliate': 'एफिलिएट पार्टनर बनें',
    'footer.payment_gateway': 'सुरक्षित भुगतान',
    'footer.secure_razorpay': 'Razorpay द्वारा सुरक्षित भुगतान',
    'footer.copyright': '© 2026 कोल्डईज़ी। सर्वाधिकार सुरक्षित।',

    // Product Page Key Labels
    'product.in_stock': 'उपलब्ध (In Stock) • तुरंत डिलीवरी',
    'product.out_of_stock': 'स्टॉक समाप्त (Out of Stock)',
    'product.no_electricity': 'शून्य बिजली',
    'product.portable': 'आसानी से ले जाने योग्य',
    'product.tap_water': 'सिर्फ सादा नल का पानी',
    'product.best_for': 'इनके लिए सबसे उत्तम',
    'product.not_for': 'इनके लिए उपयुक्त नहीं',
    'product.specs': 'तकनीकी विवरण',
    'product.add_to_cart': 'कार्ट में जोड़ें',
    'product.buy_now': 'अभी खरीदें',
    'product.bulk_enquiry_prompt': 'FPO या थोक मंडी ऑर्डर के लिए बल्क इन्क्वायरी फॉर्म भरें →',
    'product.chat_questions': 'कोई सवाल है? व्हाट्सएप पर पूछें',
    'product.secure_payment': 'सुरक्षित भुगतान',
    'product.delivery_pan_india': 'अखिल भारतीय डिलीवरी',
    'product.support_wa': 'व्हाट्सएप सपोर्ट',

    // Cart
    'cart.empty_title': 'आपकी कार्ट खाली है',
    'cart.empty_desc': 'ताज़े भारतीय फल और सब्ज़ियों के लिए हमारे प्राकृतिक शीतलन क्रेट्स देखें।',
    'cart.shop_btn': 'कोल्डईज़ी क्रेट्स देखें',
    'cart.subtotal': 'कुल योग (Subtotal)',
    'cart.proceed_checkout': 'चेकआउट के लिए आगे बढ़ें',
    'cart.check_delivery': 'पिनकोड से डिलीवरी जांचें',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'hi' || saved === 'en') {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = TRANSLATIONS[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    if (TRANSLATIONS.en[key]) {
      return TRANSLATIONS.en[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
