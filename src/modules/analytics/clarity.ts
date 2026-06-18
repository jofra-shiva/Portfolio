/**
 * Microsoft Clarity Initialization
 * Loads the Clarity script dynamically and ensures it runs after page load.
 */

export const initClarity = (clarityId) => {
  if (!clarityId || clarityId === 'XXXXXXXXXX') {
    console.warn('Microsoft Clarity ID is missing or not configured.');
    return;
  }

  // Check if already initialized
  if (window.clarity) return;

  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", clarityId);
  
  console.log('Microsoft Clarity initialized.');
};
