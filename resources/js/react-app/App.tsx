import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PackageSection from './components/PackageSection';
import BandwidthCalculator from './components/BandwidthCalculator';
import ServicesSection from './components/ServicesSection';
import CoverageChecker from './components/CoverageChecker';
import GallerySection from './components/GallerySection';
import ReviewsSection from './components/ReviewsSection';
import FaqSection from './components/FaqSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import SpeedTestModal from './components/SpeedTestModal';
import VoucherRechargeModal from './components/VoucherRechargeModal';
import PackageOrderModal from './components/PackageOrderModal';
import AllPackagesPage from './components/AllPackagesPage';
import WarningView from './components/WarningView';
import { defaultPackages, defaultReviews } from './data/defaultData';
import { PackageItem } from './types/site';
import './styles/monochrome.css';

export const App: React.FC = () => {
  const initialData = typeof window !== 'undefined' ? window.__INITIAL_DATA__ || {} : {};

  // Resolve initial active page based on window.location or initialData
  const getInitialView = () => {
    if (initialData.initialPage) return initialData.initialPage;
    if (typeof window === 'undefined') return 'home';
    const path = window.location.pathname;
    if (path.includes('all-packages')) return 'packages';
    if (path.includes('warning')) return 'warning';
    if (path.includes('voucher') || path.includes('recharge')) return 'voucher';
    return 'home';
  };

  const [activePage, setActivePage] = useState<string>(getInitialView);
  const [isSpeedTestOpen, setIsSpeedTestOpen] = useState<boolean>(false);
  const [isRechargeOpen, setIsRechargeOpen] = useState<boolean>(activePage === 'voucher');
  const [selectedPackageForOrder, setSelectedPackageForOrder] = useState<PackageItem | null>(null);

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.includes('all-packages')) setActivePage('packages');
      else if (path.includes('warning')) setActivePage('warning');
      else if (path.includes('voucher')) setIsRechargeOpen(true);
      else setActivePage('home');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update browser URL on page change without reload
  const navigateTo = (page: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let newUrl = '/';
    if (page === 'packages') newUrl = '/all-packages';
    else if (page === 'warning') newUrl = '/warning';

    if (window.location.pathname !== newUrl) {
      window.history.pushState({}, '', newUrl);
    }
  };

  const siteData = initialData.siteData || {};
  const siteName = siteData.site_name || 'Smart ISP';
  const siteLogo = siteData.site_logo ? `/images/${siteData.site_logo}` : null;
  const sitePhone = siteData.site_phone || '+880 1700-000000';

  // Merge packages: database packages or curated default packages
  const packages: PackageItem[] =
    initialData.packages && initialData.packages.length > 0
      ? initialData.packages
      : defaultPackages;

  // Merge reviews
  const reviews =
    initialData.reviews && initialData.reviews.length > 0
      ? initialData.reviews
      : defaultReviews;

  const handleSelectPackage = (pkg: PackageItem) => {
    setSelectedPackageForOrder(pkg);
  };

  const handleOrderCustom = (customPlan: PackageItem) => {
    setSelectedPackageForOrder(customPlan);
  };

  const handleOrderInArea = (areaName: string) => {
    setSelectedPackageForOrder({
      package: `Fiber Connection in ${areaName}`,
      price: 1000,
      speed: '50 Mbps',
    });
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] selection:bg-white/20 selection:text-white">
      {/* Top Fixed Frosted Navigation */}
      {activePage !== 'warning' && (
        <Navbar
          siteName={siteName}
          siteLogo={siteLogo}
          activePage={activePage}
          setActivePage={navigateTo}
          onOpenSpeedTest={() => setIsSpeedTestOpen(true)}
          onOpenRecharge={() => setIsRechargeOpen(true)}
        />
      )}

      {/* Main Content Router */}
      <main>
        {activePage === 'home' && (
          <>
            <Hero
              onOpenSpeedTest={() => setIsSpeedTestOpen(true)}
              onOpenRecharge={() => setIsRechargeOpen(true)}
              onSelectPackages={() => navigateTo('packages')}
            />

            <PackageSection
              packages={packages}
              onSelectPackage={handleSelectPackage}
              onShowAllPackages={() => navigateTo('packages')}
            />

            <BandwidthCalculator onOrderCustom={handleOrderCustom} />

            <ServicesSection />

            <CoverageChecker onOrderInArea={handleOrderInArea} />

            <GallerySection galleryItems={siteData.gallery_items || []} />

            <ReviewsSection reviews={reviews} />

            <FaqSection />

            <ContactSection siteData={siteData} />
          </>
        )}

        {activePage === 'packages' && (
          <AllPackagesPage
            packages={packages}
            onSelectPackage={handleSelectPackage}
            onBackToHome={() => navigateTo('home')}
          />
        )}

        {activePage === 'warning' && (
          <WarningView
            onOpenRecharge={() => setIsRechargeOpen(true)}
            onBackToHome={() => navigateTo('home')}
            sitePhone={sitePhone}
          />
        )}
      </main>

      {/* Footer */}
      {activePage !== 'warning' && (
        <Footer
          siteName={siteName}
          siteLogo={siteLogo}
          setActivePage={navigateTo}
        />
      )}

      {/* Modals */}
      <SpeedTestModal
        isOpen={isSpeedTestOpen}
        onClose={() => setIsSpeedTestOpen(false)}
      />

      <VoucherRechargeModal
        isOpen={isRechargeOpen}
        onClose={() => setIsRechargeOpen(false)}
      />

      <PackageOrderModal
        isOpen={!!selectedPackageForOrder}
        onClose={() => setSelectedPackageForOrder(null)}
        selectedPackage={selectedPackageForOrder}
      />
    </div>
  );
};

export default App;
