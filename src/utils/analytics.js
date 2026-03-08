const API_URL = import.meta.env.VITE_API_URL || '';

function getDevice() {
  const ua = navigator.userAgent;
  if (/Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(ua)) return 'Mobile';
  return 'Desktop';
}

export function trackEvent(type, data = {}) {
  if (!API_URL) return;
  try {
    fetch(`${API_URL}/api/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        plotTitle: data.plotTitle || '',
        plotSlug: data.plotSlug || '',
        page: data.page || window.location.pathname,
        device: getDevice(),
      }),
    }).catch(() => {});
  } catch (e) {
    // Silent fail
  }
}
