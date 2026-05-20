import KcsePerformancePage from '../../components/kcse-performance/page';

export const metadata = {
  title: 'KCSE Performance | Matungulu Girls Senior School',
  description:
    'View Matungulu Girls Senior School KCSE performance, mean score, target mean, previous mean and the latest official KCSE results PDF.',
  alternates: {
    canonical: 'https://matungulu-girls.vercel.app/pages/KCSE-Performance',
  },
  openGraph: {
    title: 'KCSE Performance - Matungulu Girls Senior School',
    description:
      'Official KCSE performance page with school mean score, target mean and results document.',
    url: 'https://matungulu-girls.vercel.app/pages/KCSE-Performance',
    siteName: 'Matungulu Girls Senior School',
    images: [
      {
        url: '/Matungulu/9.jpeg',
        width: 1200,
        height: 630,
        alt: 'Matungulu Girls Senior School KCSE Performance',
      },
    ],
    locale: 'en_KE',
    type: 'website',
  },
};

export default function Page() {
  return <KcsePerformancePage />;
}
