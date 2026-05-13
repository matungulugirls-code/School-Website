const SITE_URL = 'https://matungulu-girls.vercel.app';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/session/',
          '/MainDashboard',
          '/MainDashboard/',
          '/components/',
          '/pages/adminLogin',
          '/pages/forgotpassword',
          '/pages/resetpassword',
          '/*?*',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
