import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://goacres.in';
const DEFAULT_IMAGE = 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/29/89/f6/img-20160930-094803-largejpg.jpg?w=1200&h=-1&s=1';

const SEO = ({ title, description, path = '/', image, type = 'website', jsonLd }) => {
  const fullTitle = title
    ? `${title} | GOACRES`
    : 'GOACRES | Premium Plots & Land in Rourkela, Odisha';
  const fullUrl = `${SITE_URL}${path}`;
  const ogImage = image || DEFAULT_IMAGE;

  const defaultDescription = 'GOACRES - Rourkela ka sabse trusted land listing platform. Residential, commercial aur farm house plots. Real Estate Advisor se connect karo.';
  const desc = description || defaultDescription;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={fullUrl} />

      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
