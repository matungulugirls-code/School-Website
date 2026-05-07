'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowLeft, FiLayers, FiX, FiChevronRight } from 'react-icons/fi';
import { FaHome } from 'react-icons/fa';

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

const BoardingCard = ({ item, onView }) => {
  const imageUrl = getImageUrl(item?.image);

  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-[#d9d0c3] bg-white shadow-[0_28px_70px_-52px_rgba(15,23,42,0.5)] transition-all duration-300 hover:-translate-y-1">
      <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(135deg,#172033_0%,#2d4258_62%,#f2c357_160%)]" />

      <div className="relative p-5 pt-6">
        <div className="relative h-44 overflow-hidden rounded-[22px] border border-white/60 bg-slate-100 shadow-sm">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={item?.title || 'Boarding'}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
              <FaHome className="text-slate-400" size={22} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/60 via-transparent to-transparent" />
          <div className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-800 border border-white/60 backdrop-blur-sm">
            Boarding
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

export default function BoardingPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetch('/api/schoolhub?type=BOARDING');
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || `Failed to load boarding (${res.status})`);
        }
        setItems(Array.isArray(data.items) ? data.items : []);
      } catch (e) {
        setError(e?.message || 'Failed to load boarding information.');
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const total = useMemo(() => items.length, [items]);

  return (
    <div className="min-h-screen bg-[#fcfaf6] text-[#172033]">
      <Modal open={!!active} onClose={() => setActive(null)} title={active?.title || 'Boarding'}>
        {active?.image && (
          <div className="relative h-56 overflow-hidden rounded-[26px] border border-[#d9d0c3] bg-white shadow-sm">
            <img src={getImageUrl(active.image)} alt={active.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/60 via-transparent to-transparent" />
          </div>
        )}

        {active?.description && (
          <p className="mt-5 text-sm font-semibold text-slate-700 leading-7">{active.description}</p>
        )}

        {(active?.contactName || active?.contactPhone || active?.contactEmail) && (
          <div className="mt-5 rounded-[22px] border border-slate-200 bg-white p-4">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Contact</p>
            <p className="mt-2 text-sm font-semibold text-slate-700">
              {active.contactName || '—'}
            </p>
            {(active.contactPhone || active.contactEmail) && (
              <p className="mt-1 text-sm font-semibold text-slate-700">
                {[active.contactPhone, active.contactEmail].filter(Boolean).join(' • ')}
              </p>
            )}
          </div>
        )}

        {Array.isArray(active?.details) && active.details.length > 0 && (
          <div className="mt-5 space-y-3">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Boarding Information</p>
            <div className="grid grid-cols-1 gap-3">
              {active.details.map((sec, idx) => (
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
              <p className="text-sm font-black tracking-tight">Boarding</p>
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
              Boarding Life
            </h1>
            <p className="mt-3 text-sm sm:text-base font-semibold text-slate-600 max-w-3xl leading-7">
              Learn about boarding facilities, expectations, and key details parents and students may need.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-extrabold text-slate-700">
              <FiLayers /> {total} Items
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
            Loading boarding information…
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {items.map((item) => (
              <BoardingCard key={item.id} item={item} onView={() => setActive(item)} />
            ))}
            {!items.length && !error && (
              <div className="sm:col-span-2 xl:col-span-3 rounded-[28px] border border-[#d9d0c3] bg-white p-10 text-center text-slate-600 font-semibold">
                No boarding information available yet.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

