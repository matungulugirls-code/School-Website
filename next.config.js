/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  staticPageGenerationTimeout: 300,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      { source: '/about', destination: '/pages/AboutUs', permanent: true },
      { source: '/admissions', destination: '/pages/admissions', permanent: true },
      { source: '/school-fees', destination: '/pages/School%20Fees', permanent: true },
      { source: '/fees', destination: '/pages/School%20Fees', permanent: true },
      { source: '/school-team', destination: '/pages/SchoolTeam', permanent: true },
      { source: '/staff', destination: '/pages/SchoolTeam', permanent: true },
      { source: '/departments', destination: '/pages/Departments', permanent: true },
      { source: '/academics', destination: '/pages/Departments', permanent: true },
      { source: '/guidance', destination: '/pages/Guidance-and-Councelling', permanent: true },
      { source: '/guidance-counselling', destination: '/pages/Guidance-and-Councelling', permanent: true },
      { source: '/guidance-and-counselling', destination: '/pages/Guidance-and-Councelling', permanent: true },
      { source: '/guidance-and-coucelling', destination: '/pages/Guidance-and-Councelling', permanent: true },
      { source: '/achievements', destination: '/pages/Achievements', permanent: true },
      { source: '/school-magazine', destination: '/pages/School%20Magazine', permanent: true },
      { source: '/school-policies', destination: '/pages/School%20Policies', permanent: true },
      { source: '/clubs', destination: '/pages/Clubs', permanent: true },
      { source: '/societies', destination: '/pages/Societies', permanent: true },
      { source: '/student-council', destination: '/pages/Societies', permanent: true },
      { source: '/clubs-and-societies', destination: '/pages/Societies', permanent: true },
      { source: '/boarding', destination: '/pages/Boarding', permanent: true },
      { source: '/computer-lab', destination: '/pages/Boarding', permanent: true },
      { source: '/farm', destination: '/pages/Farm', permanent: true },
      { source: '/security', destination: '/pages/Security', permanent: true },
      { source: '/careers', destination: '/pages/careers', permanent: true },
      { source: '/career', destination: '/pages/careers', permanent: true },
      { source: '/gallery', destination: '/pages/gallery', permanent: true },
      { source: '/kcse', destination: '/kcse-performance', permanent: true },
      { source: '/kcse-perfomance', destination: '/kcse-performance', permanent: true },
      { source: '/kcse-perfronace', destination: '/kcse-performance', permanent: true },
      { source: '/kcse-results', destination: '/kcse-performance', permanent: true },
      { source: '/page/KCSE-Performance', destination: '/kcse-performance', permanent: true },
      { source: '/page/KCSE-Perfomance', destination: '/kcse-performance', permanent: true },
      { source: '/page/KCSE-Perfronace', destination: '/kcse-performance', permanent: true },
      { source: '/page/kcse-performance', destination: '/kcse-performance', permanent: true },
      { source: '/page/kcse-perfomance', destination: '/kcse-performance', permanent: true },
      { source: '/page/kcse-perfronace', destination: '/kcse-performance', permanent: true },
      { source: '/pages/KCSE-Performance', destination: '/kcse-performance', permanent: true },
      { source: '/pages/KCSE-Perfomance', destination: '/kcse-performance', permanent: true },
      { source: '/pages/KCSE-Perfronace', destination: '/kcse-performance', permanent: true },
      { source: '/pages/kcse-performance', destination: '/kcse-performance', permanent: true },
      { source: '/pages/kcse-perfomance', destination: '/kcse-performance', permanent: true },
      { source: '/pages/kcse-perfronace', destination: '/kcse-performance', permanent: true },
      { source: '/pages/kcse-results', destination: '/kcse-performance', permanent: true },
      { source: '/news-events', destination: '/pages/eventsandnews', permanent: true },
      { source: '/events', destination: '/pages/eventsandnews', permanent: true },
      { source: '/eventsandnews', destination: '/pages/eventsandnews', permanent: true },
      { source: '/contact', destination: '/pages/contact', permanent: true },
      { source: '/contact-us', destination: '/pages/contact', permanent: true },
      { source: '/student-portal', destination: '/pages/StudentPortal', permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*', // allows any external domain
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000', 
        pathname: '/**',
      },
    ],
    domains: ['localhost'], // fallback for older Next.js versions
  },
};

module.exports = nextConfig;
