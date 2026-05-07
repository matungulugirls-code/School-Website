'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowLeft, FiLayers, FiUsers, FiX, FiChevronRight } from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';

const getImageUrl = (image) => {
  if (!image || typeof image !== 'string') return null;
  const trimmed = image.trim();
  if (!trimmed) return null;
  if (trimmed.includes('cloudinary.com')) return trimmed;
  if (trimmed.startsWith('/') || trimmed.startsWith('http')) return trimmed;
  if (trimmed.startsWith('data:image')) return trimmed;
  return trimmed;
};

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-[32px] border border-[#d9d0c3] bg-[#fcfaf6] shadow-2xl">
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d9d0c3] bg-white/90 text-[#172033] shadow-sm backdrop-blur-sm"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 py-5 border-b border-[#d9d0c3] bg-white">
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-400">School Hub</p>
          <h3 className="mt-2 text-xl font-black text-[#172033] truncate">{title}</h3>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-88px)]">{children}</div>
      </div>
    </div>
  );
};

const HubCard = ({ item, typeLabel, onView }) => {
  const imageUrl = getImageUrl(item?.image);
  const contact = item?.contactName || item?.contactPhone || item?.contactEmail || '';

  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-[#d9d0c3] bg-white shadow-[0_28px_70px_-52px_rgba(15,23,42,0.5)] transition-all duration-300 hover:-translate-y-1">
      <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(135deg,#172033_0%,#2d4258_62%,#f2c357_160%)]" />

      <div className="relative p-5 pt-6">
        <div className="relative h-40 overflow-hidden rounded-[22px] border border-white/60 bg-slate-100 shadow-sm">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={item?.title || 'Item'}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
              <FiUsers className="text-slate-400" size={22} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/60 via-transparent to-transparent" />
          <div className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-800 border border-white/60 backdrop-blur-sm">
            {typeLabel}
          </div>
        </div>

        <div className="mt-5">
          <h3 className="text-base font-black text-[#172033] truncate">{item?.title}</h3>
          {item?.shortDescription && (
            <p className="mt-2 text-sm font-semibold text-slate-600 leading-6 line-clamp-3">
              {item.shortDescription}
            </p>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {contact && (
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-extrabold text-slate-800">
              Patron/Leader: {contact}
            </span>
          )}
        </div>

        <button
          onClick={onView}
          className="mt-5 w-full rounded-2xl bg-[#172033] px-4 py-3 text-sm font-extrabold text-white hover:bg-[#2d2d44] flex items-center justify-center gap-2"
        >
          View Details <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default function ClubsAndSocietiesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [clubs, setClubs] = useState([]);
  const [societies, setSocieties] = useState([]);

  const [activeModalItem, setActiveModalItem] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');

        const [clubsRes, societiesRes] = await Promise.all([
          fetch('/api/schoolhub?type=CLUB'),
          fetch('/api/schoolhub?type=SOCIETY'),
        ]);

        const clubsData = await clubsRes.json();
        const societiesData = await societiesRes.json();

        if (!clubsRes.ok || !clubsData.success) {
          throw new Error(clubsData.error || `Failed to load clubs (${clubsRes.status})`);
        }
        if (!societiesRes.ok || !societiesData.success) {
          throw new Error(societiesData.error || `Failed to load societies (${societiesRes.status})`);
        }

        setClubs(Array.isArray(clubsData.items) ? clubsData.items : []);
        setSocieties(Array.isArray(societiesData.items) ? societiesData.items : []);
      } catch (e) {
        setError(e?.message || 'Failed to load clubs and societies.');
        setClubs([]);
        setSocieties([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalItems = useMemo(() => (clubs.length + societies.length), [clubs, societies]);

  return (
    <div className="min-h-screen bg-[#fcfaf6] text-[#172033]">
      <Modal
        open={!!activeModalItem}
        onClose={() => setActiveModalItem(null)}
        title={activeModalItem?.title || 'Details'}
      >
        {activeModalItem?.image && (
          <div className="relative h-56 overflow-hidden rounded-[26px] border border-[#d9d0c3] bg-white shadow-sm">
            <img src={getImageUrl(activeModalItem.image)} alt={activeModalItem.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/60 via-transparent to-transparent" />
          </div>
        )}

        {activeModalItem?.description && (
          <p className="mt-5 text-sm font-semibold text-slate-700 leading-7">
            {activeModalItem.description}
          </p>
        )}

        {(activeModalItem?.contactName || activeModalItem?.contactPhone || activeModalItem?.contactEmail) && (
          <div className="mt-5 rounded-[22px] border border-slate-200 bg-white p-4">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Contact</p>
            <p className="mt-2 text-sm font-semibold text-slate-700">
              {activeModalItem.contactName || '—'}
            </p>
            {(activeModalItem.contactPhone || activeModalItem.contactEmail) && (
              <p className="mt-1 text-sm font-semibold text-slate-700">
                {[activeModalItem.contactPhone, activeModalItem.contactEmail].filter(Boolean).join(' • ')}
              </p>
            )}
          </div>
        )}

        {Array.isArray(activeModalItem?.details) && activeModalItem.details.length > 0 && (
          <div className="mt-5 space-y-3">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">More Information</p>
            <div className="grid grid-cols-1 gap-3">
              {activeModalItem.details.map((sec, idx) => (
                <div key={idx} className="rounded-[22px] border border-slate-200 bg-white p-4">
                  <p className="text-sm font-black text-[#172033]">{sec?.title || `Section ${idx + 1}`}</p>
                  {sec?.content && <p className="mt-2 text-sm font-semibold text-slate-700 leading-7">{sec.content}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <header className="border-b border-[#d9d0c3] bg-white/90 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#172033] via-[#2d4258] to-[#f2c357] p-[1px]">
              <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center">
                <Image src="/MatG.jpg" alt="Logo" width={28} height={28} className="rounded-xl object-cover" />
              </div>
            </div>
            <div>
              <p className="text-sm font-black tracking-tight">Clubs & Societies</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
                Matungulu Girls Senior School
              </p>
            </div>
          </Link>

          <Link
            href="/pages/SchoolTeam"
            className="rounded-2xl border border-[#d9d0c3] bg-white px-4 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-slate-700 hover:bg-slate-50 flex items-center gap-2"
          >
            <FiArrowLeft /> Back
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="relative overflow-hidden rounded-[32px] border border-[#d9d0c3] bg-white shadow-[0_30px_90px_-70px_rgba(15,23,42,0.7)]">
          <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(135deg,#172033_0%,#2d4258_62%,#f2c357_160%)]" />
          <div className="relative p-7 sm:p-10">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-400">School Hub</p>
            <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#172033]">
              Clubs & Societies
            </h1>
            <p className="mt-3 text-sm sm:text-base font-semibold text-slate-600 max-w-3xl leading-7">
              Discover co-curricular opportunities, leadership experiences, and student communities.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-extrabold text-slate-700">
              <FiLayers /> {totalItems} Items
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-8 rounded-[28px] border border-[#d9d0c3] bg-white p-10 text-center text-slate-600 font-semibold">
            Loading clubs and societies…
          </div>
        ) : (
          <>
            <section id="clubs" className="mt-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-[#172033] text-white flex items-center justify-center">
                  <FiUsers className="text-sm" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-black uppercase tracking-[0.18em] text-slate-700">Clubs</h2>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">{clubs.length} available</p>
                </div>
                <div className="flex-1 h-px bg-slate-200/70" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {clubs.map((item) => (
                  <HubCard
                    key={item.id}
                    item={item}
                    typeLabel="Club"
                    onView={() => setActiveModalItem(item)}
                  />
                ))}
                {clubs.length === 0 && (
                  <div className="sm:col-span-2 xl:col-span-3 rounded-[28px] border border-[#d9d0c3] bg-white p-10 text-center text-slate-600 font-semibold">
                    No clubs available yet.
                  </div>
                )}
              </div>
            </section>

            <section id="societies" className="mt-12">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-[#172033] text-white flex items-center justify-center">
                  <FaGraduationCap className="text-sm" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-black uppercase tracking-[0.18em] text-slate-700">Societies</h2>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">{societies.length} available</p>
                </div>
                <div className="flex-1 h-px bg-slate-200/70" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {societies.map((item) => (
                  <HubCard
                    key={item.id}
                    item={item}
                    typeLabel="Society"
                    onView={() => setActiveModalItem(item)}
                  />
                ))}
                {societies.length === 0 && (
                  <div className="sm:col-span-2 xl:col-span-3 rounded-[28px] border border-[#d9d0c3] bg-white p-10 text-center text-slate-600 font-semibold">
                    No societies available yet.
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
