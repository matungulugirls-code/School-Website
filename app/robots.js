const SITE_URL = 'https://matungulugirls.school';

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
          '/pages/studentpasswordreset',
          '/*?*',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
