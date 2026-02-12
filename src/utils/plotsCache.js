/**
 * Plots API prefetch cache.
 * Called on landing page load so data is ready when user navigates to /plots or /plot/:slug.
 */
const API_URL = import.meta.env.VITE_API_URL || '';

let cachedPlots = null;
let fetchPromise = null;

/** Start prefetching all plots from API (no-op if no API_URL or already fetching) */
export function prefetchPlots() {
  if (!API_URL || fetchPromise) return fetchPromise;

  fetchPromise = fetch(`${API_URL}/api/plots?limit=100`)
    .then(res => res.ok ? res.json() : Promise.reject())
    .then(data => {
      cachedPlots = data.plots || data;
      return cachedPlots;
    })
    .catch(() => {
      fetchPromise = null;
      return null;
    });

  return fetchPromise;
}

/** Get cached plots array (null if not yet fetched) */
export function getCachedPlots() {
  return cachedPlots;
}

/** Await the in-flight fetch (returns cached plots or null) */
export function awaitPlots() {
  return fetchPromise || Promise.resolve(null);
}

/** Find a single plot by slug from cache */
export function getCachedPlot(slug) {
  if (!cachedPlots) return null;
  return cachedPlots.find(p => p.slug === slug) || null;
}
