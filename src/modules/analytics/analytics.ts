import { analyticsConfig } from './analyticsConfig';
import { initClarity } from './clarity';

/**
 * Google Analytics 4 and Microsoft Clarity Initialization
 * Integrates GA4 tracking script and Clarity script dynamically.
 */

export const initAnalytics = () => {
  if (!analyticsConfig.enabled) {
    console.log('Analytics is disabled via config.');
    return;
  }

  const { gaMeasurementId, clarityId } = analyticsConfig;

  // 1. Initialize Google Analytics (GA4)
  if (gaMeasurementId && gaMeasurementId !== 'G-XXXXXXXXXX') {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
    document.head.appendChild(script);

    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(args);
    }
    (window as any).gtag = gtag;
    (window as any).gtag('js', new Date());
    (window as any).gtag('config', gaMeasurementId);
    
    console.log('Google Analytics (GA4) initialized.');
  } else {
    console.warn('Google Analytics Measurement ID is missing or not configured.');
  }

  // 2. Initialize Microsoft Clarity
  // Ensure it runs after the page loads or directly if already loaded
  if (document.readyState === 'complete') {
    initClarity(clarityId);
  } else {
    window.addEventListener('load', () => initClarity(clarityId));
  }
};
