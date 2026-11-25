import React, { useState, useEffect, useRef } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { TopBar } from './components/TopBar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { TrackingDebugPanel } from './components/TrackingDebugPanel';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { ThemeToggleFloatingButton } from './components/ThemeToggleFloatingButton';

// Pages
import { HomePage } from './pages/HomePage';
import { ProductsListPage } from './pages/ProductsListPage';
import { ProductPage } from './pages/ProductPage';
import { SciencePage } from './pages/SciencePage';
import { ImpactPage } from './pages/ImpactPage';
import { CustomerStoryDetailPage } from './pages/CustomerStoryDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LeadFormPage } from './pages/LeadFormPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { PolicyPage } from './pages/PolicyPage';
import { NotFoundPage } from './pages/NotFoundPage';

import { CheckCircle2 } from 'lucide-react';

function AppContent() {
  const [currentRoute, setCurrentRoute] = useState(window.location.hash || '#/');
  const routeRef = useRef(currentRoute);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const isAboutFamily = (hash: string) =>
      hash.startsWith('#/about') || hash === '#about' || hash.startsWith('#partners-');

    const handleHashChange = () => {
      const hash = window.location.hash || '#/';
      const previous = routeRef.current;
      routeRef.current = hash;
      setCurrentRoute(hash);
      if (isAboutFamily(previous) && isAboutFamily(hash)) return;
      if (new URLSearchParams(hash.split('?')[1] || '').get('section')) return;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const isCheckoutView =
    currentRoute.startsWith('#/checkout') || currentRoute.startsWith('#checkout');

  const renderCurrentView = () => {
    // Normalise route and parse query string if any
    const rawHash = currentRoute || '#/';
    const [pathPart, queryPart] = rawHash.split('?');
    const path = pathPart.replace(/\/$/, '') || '#/';

    const searchParams = new URLSearchParams(queryPart || '');
    const productQuery = searchParams.get('product') || undefined;

    // 1. Home
    if (path === '#' || path === '#/' || path === '') {
      return <HomePage onShowToast={showToast} />;
    }

    // 2. Products List
    if (path === '#/products' || path === '#products') {
      return <ProductsListPage onShowToast={showToast} />;
    }

    // 3. Product Detail: #/products/:slug or legacy #coldeasy-box
    if (path.startsWith('#/products/')) {
      const slug = path.replace('#/products/', '');
      return <ProductPage slug={slug} onShowToast={showToast} />;
    }
    if (path === '#coldeasy-box' || path === '#product') {
      return <ProductPage slug="coldeasy-box" onShowToast={showToast} />;
    }

    // 4. Cart Page
    if (path === '#/cart' || path === '#cart') {
      return <CartPage />;
    }

    // 5. Checkout Flow (Prompt 3.1)
    if (path === '#/checkout' || path === '#checkout') {
      return <CheckoutPage />;
    }

    // 6. Order Confirmation Flow: #/order/:orderId (Prompt 3.3)
    if (path.startsWith('#/order/')) {
      const orderId = path.replace('#/order/', '');
      return <OrderConfirmationPage orderId={orderId} />;
    }

    // 7. Track Order Page: #/track (Prompt 3.3)
    if (path === '#/track' || path === '#track') {
      return <TrackOrderPage />;
    }

    // 8. Calculator route: #/calculator (disabled per client brief)
    if (path === '#/calculator' || path === '#calculator') {
      return <NotFoundPage />;
    }

    // 9. Science Page
    if (path === '#/science' || path === '#science') {
      return <SciencePage />;
    }

    // 9. Customer Story Detail: #/story/:id or #/impact/stories/:id
    if (path.startsWith('#/story/') || path.startsWith('#/impact/stories/')) {
      const storyId = path.replace('#/story/', '').replace('#/impact/stories/', '');
      return <CustomerStoryDetailPage storyId={storyId} />;
    }

    // 10. Impact Page
    if (path === '#/impact' || path === '#impact') {
      return <ImpactPage />;
    }

    // 11. About Page, including a shared partner category such as #/about/partners-csr
    if (
      path === '#/about' ||
      path === '#about' ||
      path.startsWith('#/about/partners-') ||
      path.startsWith('#partners-')
    ) {
      return <AboutPage />;
    }

    // 12. Contact Page
    if (path === '#/contact' || path === '#contact') {
      return <ContactPage />;
    }

    // 13. Partner & Enquiry Forms
    if (path === '#/partner/distributor' || path === '#distributor') {
      return <LeadFormPage formType="distributor" />;
    }
    if (path === '#/partner/partner' || path === '#partner') {
      return <LeadFormPage formType="partner" />;
    }
    if (path === '#/partner/affiliate' || path === '#affiliate') {
      return <LeadFormPage formType="affiliate" />;
    }
    if (path === '#/enquiry/bulk' || path === '#bulk') {
      return <LeadFormPage formType="bulk" initialProductSlug={productQuery} />;
    }

    // 14. Policies (Prompt 3.6)
    if (path === '#/terms' || path === '#terms') {
      return <PolicyPage type="terms" />;
    }
    if (path === '#/privacy' || path === '#privacy') {
      return <PolicyPage type="privacy" />;
    }
    if (path === '#/refund-policy' || path === '#refund-policy') {
      return <PolicyPage type="refund" />;
    }
    if (path === '#/shipping-policy' || path === '#shipping-policy') {
      return <PolicyPage type="shipping" />;
    }

    // 15. 404 Page (Prompt 3.6)
    return <NotFoundPage />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream text-ink font-body selection:bg-marigold-light selection:text-ink">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 right-4 sm:right-8 z-50 bg-[#18140E] text-[#EDE8DE] px-5 py-3 rounded-full shadow-2xl border border-white/20 flex items-center gap-3 animate-in fade-in slide-in-from-top-3 duration-300 font-heading text-xs uppercase tracking-wider"
        >
          <CheckCircle2 className="w-4 h-4 text-leaf" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Header System (hidden on checkout page to avoid distraction as specified in Prompt 3.1) */}
      {!isCheckoutView && (
        <>
          <TopBar onShowToast={showToast} />
          <Header currentRoute={currentRoute} />
        </>
      )}

      {/* Main Content Area */}
      <main className="flex-1">{renderCurrentView()}</main>

      {/* Global Footer (hidden on checkout page which has its own legal footer) */}
      {!isCheckoutView && <Footer />}

      {/* Slide-in Cart Drawer */}
      <CartDrawer />

      {/* Tracking Debug Panel (activates when ?debug=1 is in URL) */}
      <TrackingDebugPanel />

      {/* Floating WhatsApp Action Button */}
      <WhatsAppFloatingButton />

      {/* Floating Theme Quick Switch Button */}
      <ThemeToggleFloatingButton />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
