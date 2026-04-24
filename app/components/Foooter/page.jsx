'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiHome,
  FiBook,
  FiUsers,
  FiCalendar,
  FiImage,
  FiUserCheck,
  FiBookOpen,
  FiHelpCircle,
  FiGlobe,
  FiLock,
  FiShield,
  FiGithub,
  FiTarget,
  FiBriefcase,
  FiActivity,
  FiUserPlus,
  FiBell,
  FiCheckCircle,
  FiDownload,
  FiEye,
  FiX,
  FiTrendingUp,
  FiStar,
  FiHeart,
  FiArrowUp,
  FiAward,
  FiCompass,
} from 'react-icons/fi';
import {
  SiFacebook,
  SiYoutube,
  SiLinkedin,
  SiWhatsapp,
  SiInstagram,
} from 'react-icons/si';
import { FaLinkedin, FaTiktok, FaGraduationCap, FaChalkboardTeacher, FaFemale } from 'react-icons/fa';

// ----------------------------------------------------------------------
// Data Layer - Matungulu Girls Specific
// ----------------------------------------------------------------------

const QUICK_LINKS = [
  { name: 'Home', href: '/', icon: FiHome },
  { name: 'About Us', href: '/pages/AboutUs', icon: FiUsers },
  { name: 'Fees Structure', href: '/pages/School Fees', icon: FiBook },
  { name: 'Admissions', href: '/pages/admissions', icon: FiUserCheck },
  { name: 'Gallery', href: '/pages/gallery', icon: FiImage },
  { name: 'News & Events', href: '/pages/eventsandnews', icon: FiCalendar },
  { name: 'Contact Us', href: '/pages/contact', icon: FiPhone },
  { name: 'Alumni', href: '/pages/alumni', icon: FaGraduationCap },
];

const RESOURCES = [
  { name: 'Student Portal', href: '/pages/StudentPortal', icon: FiBookOpen },
  { name: 'Apply Now', href: '/pages/apply-for-admissions', icon: FiUserPlus },
  {
    name: 'Guidance & Counselling',
    href: '/pages/Guidance-and-Councelling',
    icon: FiHelpCircle,
  },
  { name: 'Staff Directory', href: '/pages/SchoolTeam', icon: FiUsers },
  { name: 'Admin Login', href: '/pages/adminLogin', icon: FiLock },
  { name: 'School Policies', href: '/pagesSchool Policies', icon: FiShield },
  { name: 'E-Learning Platform', href: '/pages/e-learning', icon: FiCompass },
];

// Social Media Links - Matungulu Girls
const SOCIAL_LINKS = [
  {
    icon: SiFacebook,
    href: 'https://facebook.com/matungulugirlshs',
    label: 'Facebook',
    color: '#1877F2',
  },

  {
    icon: FaLinkedin,
    href: 'https://linkedin.com/school/matungulugirlshs',
    label: 'LinkedIn',
    color: '#0A66C2',
  },
  {
    icon: SiYoutube,
    href: 'https://youtube.com/matungulugirlshs',
    label: 'YouTube',
    color: '#FF0000',
  },
  {
    icon: SiWhatsapp,
    href: 'https://wa.me/254720123456',
    label: 'WhatsApp',
    color: '#25D366',
  },
];

const CONTACT_INFO = [
  {
    icon: FiMapPin,
    text: 'Matungulu, Machakos County, Kenya',
    href: 'https://maps.google.com/?q=-1.1605,37.2349',
    detail: 'Along Tala Kangudo Road',
  },
  {
    icon: FiPhone,
    text: '+254 720 123 456',
    href: 'tel:+254720123456',
    detail: 'Main Office Line',
  },
  {
    icon: FiPhone,
    text: '+254 733 987 654',
    href: 'tel:+254733987654',
    detail: 'Admissions Office',
  },
  {
    icon: FiMail,
    text: 'matungulugirls@gmail.com',
    href: 'mailto:matungulugirls@gmail.com',
    detail: 'General Inquiries',
  },
  {
    icon: FiMail,
    text: 'admissions@matungulugirls.sc.ke',
    href: 'mailto:admissions@matungulugirls.sc.ke',
    detail: 'Admissions Office',
  },
  {
    icon: FiClock,
    text: 'Mon - Fri: 7:30 AM - 5:00 PM',
    href: '#',
    detail: 'Sat: 8:00 AM - 1:00 PM',
  },
];

// Achievements specific to Matungulu Girls
const ACHIEVEMENTS = [
  { value: 68, label: 'Years of Excellence', icon: FiAward },
  { value: 98, label: 'KCSE Pass Rate', icon: FiTrendingUp },
  { value: 1300, label: 'Students Enrolled', icon: FiUsers },
  { value: 45, label: 'Qualified Teachers', icon: FaChalkboardTeacher },
];

// ----------------------------------------------------------------------
// Components
// ----------------------------------------------------------------------

// Stats Counter Component
const StatCounter = ({ value, label, icon: Icon }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (count < value) {
        setCount(prev => Math.min(prev + Math.ceil(value / 50), value));
      }
    }, 30);
    return () => clearTimeout(timer);
  }, [count, value]);

  return (
    <div className="text-center group">
      <div className="flex justify-center mb-2">
        <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full group-hover:scale-110 transition-transform duration-300">
          <Icon className="text-white text-xl" />
        </div>
      </div>
      <div className="text-2xl font-bold text-white">{count}+</div>
      <div className="text-xs text-emerald-200 uppercase tracking-wide">{label}</div>
    </div>
  );
};

// Brand Section - Matungulu Girls Specific
const BrandSection = () => (
  <div className="space-y-6">
    <div className="flex flex-col items-center md:items-start gap-4 text-center md:text-left">
      <div className="relative">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-emerald-400 bg-white/10 shadow-lg shadow-emerald-500/20">
          <img
            src="/MatG.jpg"
            alt="Matungulu Girls Senior School Logo"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
          <FaFemale className="text-white text-xs" />
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-100 to-teal-100 bg-clip-text text-transparent">
          Matungulu Girls
        </h3>
        <p className="text-emerald-200/80 text-sm">Senior School</p>
        <p className="text-white/60 text-xs mt-1">Est. 1955</p>
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-3">
      {ACHIEVEMENTS.map((achievement, idx) => (
        <StatCounter 
          key={idx}
          value={achievement.value} 
          label={achievement.label} 
          icon={achievement.icon} 
        />
      ))}
    </div>
    
    <p className="text-gray-200 text-sm leading-relaxed">
      A  National  girls' school in Matungulu, Machakos County, dedicated to 
      empowering young women through quality education, leadership development, and 
      character formation since 1955. <span className="text-emerald-300 font-semibold">"Strive to Excel"</span>
    </p>
  </div>
);

// Contact Info - Boldened items
const ContactList = () => (
  <div className="space-y-3">
    {CONTACT_INFO.slice(0, 4).map((item, index) => {
      const Icon = item.icon;
      return (
        <a
          key={index}
          href={item.href}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-emerald-500/10 transition-all group"
        >
          <div className="p-2 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/30 transition-colors">
            <Icon className="text-white text-sm" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm truncate">{item.text}</p>
            {item.detail && (
              <p className="text-white text-xs">{item.detail}</p>
            )}
          </div>
        </a>
      );
    })}
  </div>
);

// Link Group Component
const LinkGroup = ({ title, icon: Icon, links }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 pb-2 border-b border-emerald-500/20">
      <Icon className="text-white text-lg" />
      <h4 className="text-lg font-semibold text-white">{title}</h4>
    </div>
    <div className="space-y-2">
      {links.map((link, idx) => {
        const LinkIcon = link.icon;
        return (
          <a
            key={idx}
            href={link.href}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors font-medium text-sm group"
          >
            <LinkIcon className="text-xs group-hover:translate-x-1 transition-transform" />
            <span>{link.name}</span>
          </a>
        );
      })}
    </div>
  </div>
);

// Social Links Group
const SocialLinksGroup = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 pb-2 border-b border-emerald-500/20">
      <FiHeart className="text-emerald-400 text-lg" />
      <h4 className="text-lg font-semibold text-white">Connect With Us</h4>
    </div>
    <div className="flex flex-wrap gap-3">
      {SOCIAL_LINKS.map((social, idx) => {
        const SocialIcon = social.icon;
        return (
          <a
            key={idx}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg"
            style={{ backgroundColor: social.color }}
          >
            <SocialIcon className="text-white text-2xl" />
          </a>
        );
      })}
    </div>
  </div>
);

// Newsletter Form
const NewsletterForm = ({ email, setEmail, isSubmitting, showSuccess, errorMsg, handleSubscribe }) => (
  <div className="p-5 bg-gradient-to-br from-emerald-950/50 to-teal-950/50 rounded-xl border border-emerald-500/20">
    <div className="text-center mb-4">
      <div className="inline-flex p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mb-3">
        <FiBell className="text-white text-lg" />
      </div>
      <h4 className="text-lg font-semibold text-white">School Newsletter</h4>
      <p className="text-white text-xs mt-1">Get academic events & announcements</p>
    </div>
    <form onSubmit={handleSubscribe} className="space-y-3">
      <div className="relative">
        <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 text-sm" />
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full pl-9 pr-3 py-2 bg-black/30 border border-emerald-500/30 rounded-lg text-white placeholder-emerald-300/40 focus:outline-none focus:border-emerald-400 transition-colors text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting || !email}
        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 disabled:opacity-50 text-white py-2 rounded-lg font-medium text-sm hover:shadow-lg transition-all"
      >
        {isSubmitting ? 'Subscribing...' : 'Subscribe'}
      </button>
    </form>
    {showSuccess && (
      <div className="mt-3 p-2 bg-emerald-500/20 border border-emerald-500 rounded-lg">
        <p className="text-emerald-300 text-xs text-center">✓ Successfully subscribed!</p>
      </div>
    )}
    {errorMsg && (
      <div className="mt-3 p-2 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-xs text-center">
        {errorMsg}
      </div>
    )}
  </div>
);

// Scroll to Top Button
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full shadow-lg hover:scale-110 transition-all z-50"
    >
      <FiArrowUp className="text-white text-xl" />
    </button>
  );
};

// Privacy Modal
const PrivacyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gradient-to-b from-emerald-950 to-slate-950 text-white rounded-2xl max-w-md w-full p-6 border border-emerald-500/30">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Privacy Policy</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full">
            <FiX className="text-white" />
          </button>
        </div>
        <div className="space-y-3 text-sm text-gray-300">
          <p>Matungulu Girls Senior School is committed to protecting your privacy and personal information.</p>
          <p>All data is collected and processed in compliance with the Kenyan Data Protection Act (2019).</p>
          <p className="text-emerald-300 text-xs">Last updated: {new Date().getFullYear()}</p>
        </div>
        <button onClick={onClose} className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 py-2 rounded-lg transition-colors">
          Close
        </button>
      </div>
    </div>
  );
};

// Sitemap Modal
const SitemapModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gradient-to-b from-emerald-950 to-slate-950 text-white rounded-2xl max-w-md w-full p-6 border border-emerald-500/30">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Site Navigation</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full">
            <FiX className="text-white" />
          </button>
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          <div className="space-y-2">
            <h3 className="text-emerald-400 text-sm font-semibold">Main Pages</h3>
            {QUICK_LINKS.map((link, idx) => (
              <a key={idx} href={link.href} onClick={onClose} className="block text-gray-300 hover:text-emerald-400 py-1 text-sm transition-colors">
                {link.name}
              </a>
            ))}
          </div>
          <div className="pt-3 space-y-2">
            <h3 className="text-emerald-400 text-sm font-semibold">Resources</h3>
            {RESOURCES.map((link, idx) => (
              <a key={idx} href={link.href} onClick={onClose} className="block text-gray-300 hover:text-emerald-400 py-1 text-sm transition-colors">
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// Main Footer Component - Matungulu Girls
// ----------------------------------------------------------------------
export default function ModernFooter() {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showSitemap, setShowSitemap] = useState(false);
  const currentYear = new Date().getFullYear();
  
  // Newsletter state
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const response = await fetch('/api/subscriber', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source: 'matungulu-footer' }),
      });
      const data = await response.json();
      if (data.success) {
        setShowSuccess(true);
        setEmail('');
        setTimeout(() => setShowSuccess(false), 5000);
        toast.success('Successfully subscribed to Matungulu Girls newsletter!', { icon: '🎓' });
      } else {
        setErrorMsg(data.error || 'Subscription failed');
      }
    } catch (error) {
      setErrorMsg('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <footer className="relative bg-gradient-to-br from-emerald-950 via-slate-950 to-emerald-950 text-white">
        <div className="relative z-10">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="max-w-7xl mx-auto">
              
              {/* Main Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                
                {/* Column 1 - Brand Section */}
                <BrandSection />
                
                {/* Column 2 - Quick Links */}
                <div className="space-y-8">
                  <LinkGroup title="Quick Links" icon={FiGlobe} links={QUICK_LINKS.slice(0, 4)} />
                </div>
                
                {/* Column 3 - Resources & Social */}
                <div className="space-y-8">
                  <LinkGroup title="Resources" icon={FiActivity} links={RESOURCES.slice(0, 4)} />
                  <SocialLinksGroup />
                </div>
                
                {/* Column 4 - Contact Info */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-emerald-500/20">
                      <FiMapPin className="text-emerald-400 text-lg" />
                      <h4 className="text-lg font-semibold text-white">Contact Info</h4>
                    </div>
                    <ContactList />
                  </div>
                </div>
              </div>

              {/* Newsletter Subscription Bar */}
              <div className="mt-12 sm:mt-16">
                <div className="bg-gradient-to-r from-emerald-900/50 to-teal-900/50 rounded-2xl shadow-xl p-6 md:p-8 border border-emerald-500/20">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
                    
                    <div className="text-center md:text-left space-y-2 w-full md:flex-1">
                      <h3 className="text-xl sm:text-2xl font-bold leading-tight">
                        Subscribe to <span className="text-emerald-400">Matungulu Girls</span> Newsletter
                      </h3>
                      <p className="text-white text-sm md:text-base max-w-md mx-auto md:mx-0">
                        Get the latest updates, events, and achievements from our school
                      </p>
                    </div>

                    <form onSubmit={handleSubscribe} className="flex flex-row w-full md:w-auto gap-2 items-center flex-nowrap">
                      <div className="relative flex-1 min-w-0">
                        <input
                          type="email"
                          placeholder="Email address"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm sm:text-base"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting || !email}
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold px-5 sm:px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex-shrink-0 text-sm sm:text-base flex items-center gap-2"
                      >
                        {isSubmitting && (
                          <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                          </svg>
                        )}
                        <span>Subscribe</span>
                      </button>
                    </form>
                  </div>

                  {/* Status Messages */}
                  {(showSuccess || errorMsg) && (
                    <div className="mt-4">
                      {showSuccess && (
                        <div className="p-3 bg-emerald-500/20 border border-emerald-500 rounded-lg text-emerald-300 text-sm text-center">
                          ✓ Successfully subscribed to Matungulu Girls newsletter!
                        </div>
                      )}
                      {errorMsg && (
                        <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm text-center">
                          {errorMsg}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Sitemap & Privacy Buttons */}
              <div className="flex flex-wrap gap-4 items-center justify-center mt-8">
                <button
                  onClick={() => setShowSitemap(true)}
                  className="text-white hover:text-emerald-400 font-medium transition-all text-sm"
                  type="button"
                >
                  Sitemap
                </button>
                <button
                  onClick={() => setShowPrivacy(true)}
                  className="text-white hover:text-emerald-400 font-medium transition-all text-sm"
                  type="button"
                >
                  Privacy Policy
                </button>
              </div>

              {/* Copyright & Credits */}
              <div className="mt-12 pt-6 border-t border-emerald-500/20">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-300/50">
                      Strive to Excel
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2">
                    <p className="text-[11px] font-bold text-white tracking-tight">
                      © {currentYear} Matungulu Girls Senior School. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-emerald-500/20">
                      <p className="text-[10px] font-bold text-white">
                        Developed by{" "}
                        <a 
                          href="https://www.linkedin.com/in/emmanuel-makau-40a12028b/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-white hover:text-emerald-300 transition-colors"
                        >
                          Emmanuel Makau
                        </a>
                      </p>
                      <div className="w-[1px] h-3 bg-emerald-500/20" />
                      <a 
                        href="https://github.com/Emmanuel10701" 
                        className="text-emerald-300/50 hover:text-white transition-all"
                        title="GitHub"
                      >
                        <FiGithub size={12} />
                      </a>
                      <a 
                        href="mailto:emmanuelmakau90@gmail.com" 
                        className="text-emerald-300/50 hover:text-white transition-all"
                        title="Email"
                      >
                        <FiMail size={12} />
                      </a>
                      <a 
                        href="tel:+254793472960" 
                        className="text-emerald-300/50 hover:text-white transition-all"
                        title="Call"
                      >
                        <FiPhone size={12} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
      <SitemapModal isOpen={showSitemap} onClose={() => setShowSitemap(false)} />
      <ScrollToTop />
    </>
  );
}