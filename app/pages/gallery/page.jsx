// app/pages/gallery/page.jsx - This is a SERVER COMPONENT (no 'use client')
import ClientGallery from '../../components/gg/page';
import { Metadata } from 'next';

export const metadata = {
  title: 'Matungulu Girls Senior School Gallery - C1 Institution',
  description: 'Explore the official gallery of Matungulu Girls Senior School, a proud C1 institution in Matungulu, Machakos County. View photos of classrooms, laboratories, sports day, graduation ceremonies, teaching moments, and school events.',
  keywords: [
    "Matungulu Girls Senior School photos",
    "Matungulu Girls High School pictures",
    "Matungulu Girls images",
    "Matungulu High School gallery",
    "Matungulu Girls school grounds photos",
    "Matungulu Girls classrooms photos",
    "Matungulu Girls teaching moments",
    "Matungulu Girls laboratories pictures",
    "Matungulu Girls sports day images",
    "Matungulu Girls graduation ceremony photos",
    "Matungulu Girls general school activities",
    "Schools in Matungulu East photos",
    "Machakos County school pictures",
    "Kenya secondary school images",
    "Eastern province education photos",
    "Matungulu Girls prize giving day photos",
    "Matungulu Girls academic day pictures",
    "Matungulu Girls music festival images",
    "Matungulu Girls drama festival photos",
    "Matungulu Girls school compound images",
    "Matungulu Girls dormitories photos",
    "Matungulu Girls dining hall pictures",
    "Matungulu Girls library images",
    "Matungulu Girls computer lab photos",
    "Matungulu Girls teachers photos",
    "Matungulu Girls students pictures",
    "Matungulu Girls alumni images",
    "Matungulu Girls staff gallery",
    "Matungulu Girls class of 2024 photos",
    "Matungulu Girls old school photos",
    "Matungulu Girls historical images",
    "Matungulu Girls school pictures",
    "Matungulu Girls high school images",
    "Matungulu Girls school gallery",
    "Matungulu Girls C1 school photos"
  ].join(', '),
  
  openGraph: {
    title: 'Matungulu Girls Senior School - Photo Gallery | C1 Institution',
    description: 'Browse through our collection of school photos, events, and memorable moments at this prestigious C1 girls senior school.',
    url: 'https://matungulu-girls.vercel.app/pages/gallery',
    siteName: 'Matungulu Girls Senior School',
    images: [
      {
        url: '/seo/matungulu-girls.png',
        width: 1200,
        height: 630,
        alt: 'Matungulu Girls Senior School Gallery - C1 Institution',
      },
    ],
    locale: 'en_KE',
    type: 'website',
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Matungulu Girls Senior School Gallery | C1 Institution',
    description: 'Browse through our collection of school photos, events, and memorable moments.',
    images: ['/seo/matungulu-girls.png'],
  },
  
  alternates: {
    canonical: 'https://matungulu-girls.vercel.app/pages/gallery',
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function GalleryPage() {
  return <ClientGallery />;
}