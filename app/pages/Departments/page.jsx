'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiLayers, FiBookOpen, FiSettings, FiUsers, FiArrowLeft } from 'react-icons/fi';

const getImageUrl = (image) => {
  if (!image || typeof image !== 'string') return null;
  const trimmed = image.trim();
  if (!trimmed) return null;
  if (trimmed.includes('cloudinary.com')) return trimmed;
  if (trimmed.startsWith('/') || trimmed.startsWith('http')) return trimmed;
  if (trimmed.startsWith('data:image')) return trimmed;
  return trimmed;
};

const DepartmentCard = ({ dept }) => {
  const imageUrl = getImageUrl(dept?.image);
  const staffCount = Number(dept?.staffCount) || 0;

  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-[#d9d0c3] bg-white shadow-[0_28px_70px_-52px_rgba(15,23,42,0.5)] transition-all duration-300 hover:-translate-y-1">
      <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(135deg,#172033_0%,#2d4258_62%,#f2c357_160%)]" />

      <div className="relative p-5 pt-6">
        <div className="relative h-40 overflow-hidden rounded-[22px] border border-white/60 bg-slate-100 shadow-sm">
          {imageUrl ? (
            <img src={imageUrl} alt={dept?.name || 'Department'} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
              <FiLayers className="text-slate-400" size={22} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/60 via-transparent to-transparent" />
        </div>

        <div className="mt-5">
          <h3 className="text-base font-black text-[#172033] truncate">{dept?.name || 'Department'}</h3>
          {dept?.description && (
            <p className="mt-2 text-sm font-semibold text-slate-600 leading-6 line-clamp-3">
              {dept.description}
            </p>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-extrabold text-slate-800">
            <FiUsers className="text-[11px]" />
            {staffCount} Staff
          </span>
          {dept?.headName && (
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-extrabold text-slate-800">
              Head: {dept.headName}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, icon: Icon, subtitle, items }) => {
  if (!items?.length) return null;
  return (
    <section className="mt-10">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-2xl bg-[#172033] text-white flex items-center justify-center">
          <Icon className="text-sm" />
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-black uppercase tracking-[0.18em] text-slate-700">{title}</h2>
          {subtitle && <p className="text-xs font-semibold text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex-1 h-px bg-slate-200/70" />
        <span className="text-[11px] font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {items.length}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {items.map((dept) => (
          <DepartmentCard key={dept.id} dept={dept} />
        ))}
      </div>
    </section>
  );
};

export default function DepartmentsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [groups, setGroups] = useState({
    CBC: [],
    EIGHT_FOUR_FOUR: [],
    TEACHING: [],
    SUPPORT: [],
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetch('/api/staff/departments?grouped=1');
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || `Failed to load departments (${res.status})`);
        }
        const grouped = data.departmentsByCategory || {};
        setGroups({
          CBC: grouped.CBC || [],
          EIGHT_FOUR_FOUR: grouped.EIGHT_FOUR_FOUR || [],
          TEACHING: grouped.TEACHING || [],
          SUPPORT: grouped.SUPPORT || [],
        });
      } catch (e) {
        setError(e?.message || 'Failed to load departments.');
        setGroups({ CBC: [], EIGHT_FOUR_FOUR: [], TEACHING: [], SUPPORT: [] });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalDepartments = useMemo(() => {
    return (
      (groups.CBC?.length || 0) +
      (groups.EIGHT_FOUR_FOUR?.length || 0) +
      (groups.TEACHING?.length || 0) +
      (groups.SUPPORT?.length || 0)
    );
  }, [groups]);

  return (
    <div className="min-h-screen bg-[#fcfaf6] text-[#172033]">
      <header className="border-b border-[#d9d0c3] bg-white/90 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#172033] via-[#2d4258] to-[#f2c357] p-[1px]">
              <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center">
                <Image src="/MatG.jpg" alt="Logo" width={28} height={28} className="rounded-xl object-cover" />
              </div>
            </div>
            <div>
              <p className="text-sm font-black tracking-tight">Departments</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
                Matungulu Girls Senior School
              </p>
            </div>
          </Link>

          <Link
            href="/pages/SchoolTeam"
            className="rounded-2xl border border-[#d9d0c3] bg-white px-4 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-slate-700 hover:bg-slate-50 flex items-center gap-2"
          >
            <FiArrowLeft /> Staff Page
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="relative overflow-hidden rounded-[32px] border border-[#d9d0c3] bg-white shadow-[0_30px_90px_-70px_rgba(15,23,42,0.7)]">
          <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(135deg,#172033_0%,#2d4258_62%,#f2c357_160%)]" />
          <div className="relative p-7 sm:p-10">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-400">School Hub</p>
            <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#172033]">
              School Departments
            </h1>
            <p className="mt-3 text-sm sm:text-base font-semibold text-slate-600 max-w-3xl leading-7">
              Explore our departments and how staff are organized — displayed as department groups for stronger privacy.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-extrabold text-slate-700">
              <FiLayers /> {totalDepartments} Departments
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
            Loading departments…
          </div>
        ) : (
          <>
            <Section title="CBC Departments" icon={FiLayers} items={groups.CBC} />
            <Section title="8-4-4 Departments" icon={FiBookOpen} items={groups.EIGHT_FOUR_FOUR} />
            <Section title="Teaching Departments" icon={FiBookOpen} items={groups.TEACHING} />
            <Section title="Support / Non-Teaching Departments" icon={FiSettings} items={groups.SUPPORT} />

            {totalDepartments === 0 && !error && (
              <div className="mt-8 rounded-[28px] border border-[#d9d0c3] bg-white p-10 text-center text-slate-600 font-semibold">
                No departments available yet.
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

