'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  FiArrowLeft,
  FiBookOpen,
  FiBriefcase,
  FiCalendar,
  FiChevronRight,
  FiImage,
  FiLayers,
  FiMapPin,
  FiUser,
  FiUsers,
  FiX,
} from 'react-icons/fi';

const getCategoryLabel = (category) => {
  switch (category) {
    case 'CBC':
      return 'CBC Department';
    case 'EIGHT_FOUR_FOUR':
      return '8-4-4 Department';
    case 'TEACHING':
      return 'Teaching Department';
    case 'SUPPORT':
      return 'Support Department';
    default:
      return 'Department';
  }
};

const normalizeImageUrl = (image) => {
  if (!image || typeof image !== 'string') return null;
  const trimmed = image.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('/') || trimmed.startsWith('http') || trimmed.startsWith('data:image')) return trimmed;
  return `/${trimmed}`;
};

const getDepartmentImages = (department) => {
  const urls = [
    department?.image,
    ...(Array.isArray(department?.images) ? department.images.map((image) => image?.url) : []),
  ].map(normalizeImageUrl).filter(Boolean);

  return [...new Set(urls)];
};

const getTeacherImage = (teacher) => normalizeImageUrl(teacher?.image) || '/images/default-staff.jpg';

const normalizeDetailText = (value) => {
  if (!value && value !== 0) return '';
  if (Array.isArray(value)) return value.filter(Boolean).join(', ');
  return String(value);
};

const DetailPill = ({ icon: Icon, label, value }) => {
  const displayValue = normalizeDetailText(value);
  if (!displayValue && displayValue !== '0') return null;

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1f5f3a] text-white">
        <Icon size={16} />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{label}</p>
        <p className="text-sm font-black leading-6 text-slate-900">{displayValue}</p>
      </div>
    </div>
  );
};

const DetailBlock = ({ icon: Icon, label, value }) => {
  const displayValue = normalizeDetailText(value);
  if (!displayValue && displayValue !== '0') return null;

  return (
    <div className="rounded-[24px] bg-slate-50 p-5">
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1f5f3a] text-white">
          <Icon size={16} />
        </span>
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{label}</p>
      </div>
      <p className="text-sm font-semibold leading-7 text-slate-700">{displayValue}</p>
    </div>
  );
};

const TeacherModal = ({ teacher, onClose }) => {
  if (!teacher) return null;

  const details = [
    { label: 'Role', value: teacher.position || teacher.role || 'Teacher' },
    { label: 'Subject', value: teacher.subjectOffered },
    { label: 'Department', value: teacher.department },
    { label: 'Education', value: teacher.education },
    { label: 'Experience', value: teacher.experience },
  ].filter((item) => item.value);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[28px] bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 text-slate-700 shadow-lg transition hover:bg-slate-100"
          aria-label="Close teacher details"
        >
          <FiX />
        </button>

        <div className="grid gap-0 sm:grid-cols-[220px_1fr]">
          <div className="bg-slate-100 p-4">
            <div className="aspect-[4/5] overflow-hidden rounded-[22px] bg-white">
              <img
                src={getTeacherImage(teacher)}
                alt={teacher.name || 'Teacher'}
                className="h-full w-full object-cover object-top"
                onError={(event) => {
                  event.currentTarget.src = '/images/default-staff.jpg';
                }}
              />
            </div>
          </div>

          <div className="p-6">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#1f5f3a]">Teacher Profile</p>
            <h2 className="mt-2 pr-10 text-2xl font-black tracking-tight text-slate-950">{teacher.name || 'Teacher'}</h2>
            <p className="mt-2 text-sm font-bold text-slate-500">{teacher.subjectOffered || teacher.position || teacher.role || 'Department teacher'}</p>

            {teacher.bio && (
              <p className="mt-5 text-sm font-medium leading-7 text-slate-600">{teacher.bio}</p>
            )}

            <div className="mt-5 grid gap-3">
              {details.map((detail) => (
                <div key={detail.label} className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{detail.label}</p>
                  <p className="mt-1 text-sm font-bold text-slate-800">{detail.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TeacherCarousel = ({ teachers, onViewTeacher }) => {
  if (!teachers?.length) {
    return (
      <div className="rounded-[24px] bg-slate-50 px-6 py-12 text-center">
        <FiUsers className="mx-auto text-4xl text-slate-300" />
        <h2 className="mt-4 text-lg font-black text-slate-800">No teachers mapped yet</h2>
        <p className="mt-2 text-sm font-semibold text-slate-500">Teachers added from admin will appear here automatically.</p>
      </div>
    );
  }

  const trackTeachers = teachers.length > 1 ? [...teachers, ...teachers] : teachers;
  const duration = Math.max(20, teachers.length * 7);

  return (
    <div className="overflow-hidden rounded-[30px] bg-slate-50 p-4">
      <div className="department-teacher-mask">
        <div
          className={`department-teacher-track flex gap-4 ${teachers.length > 1 ? '' : 'department-teacher-static'}`}
          style={{ animationDuration: `${duration}s` }}
        >
          {trackTeachers.map((teacher, index) => (
            <article key={`${teacher.id}-${index}`} className="min-w-[250px] max-w-[250px] overflow-hidden rounded-[24px] bg-white shadow-sm">
              <div className="aspect-[4/4.5] bg-slate-100">
                <img
                  src={getTeacherImage(teacher)}
                  alt={teacher.name || 'Teacher'}
                  className="h-full w-full object-cover object-top"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.src = '/images/default-staff.jpg';
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="line-clamp-1 text-base font-black text-slate-950">{teacher.name || 'Teacher'}</h3>
                <p className="mt-1 line-clamp-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#1f5f3a]">
                  {teacher.subjectOffered || teacher.position || teacher.role || 'Teacher'}
                </p>
                <button
                  type="button"
                  onClick={() => onViewTeacher(teacher)}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1f5f3a] px-4 py-3 text-sm font-black text-white transition hover:bg-[#17492c]"
                >
                  View Teacher
                  <FiChevronRight size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function DepartmentDetailsPage({ params }) {
  const [department, setDepartment] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadDepartment() {
      try {
        setLoading(true);
        setError('');
        const response = await fetch(`/api/staff/departments/${params.id}`, { cache: 'no-store' });
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to load department');
        }
        if (active) setDepartment(data.department);
      } catch (loadError) {
        if (active) setError(loadError?.message || 'Failed to load department');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDepartment();

    return () => {
      active = false;
    };
  }, [params.id]);

  const images = useMemo(() => getDepartmentImages(department), [department]);
  const teachers = useMemo(() => Array.isArray(department?.teachers) ? department.teachers : [], [department]);
  const extra = department?.extra && typeof department.extra === 'object' ? department.extra : {};
  const heroImage = images[0];

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#1f5f3a]" />
          <p className="mt-4 text-sm font-black uppercase tracking-[0.16em] text-slate-500">Loading department</p>
        </div>
      </main>
    );
  }

  if (error || !department) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="max-w-lg text-center">
          <FiLayers className="mx-auto text-5xl text-slate-300" />
          <h1 className="mt-4 text-2xl font-black text-slate-950">Department unavailable</h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">{error || 'This department could not be found.'}</p>
          <Link href="/pages/SchoolTeam" className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#1f5f3a] px-5 py-3 text-sm font-black text-white">
            <FiArrowLeft /> Back to Staff
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <TeacherModal teacher={selectedTeacher} onClose={() => setSelectedTeacher(null)} />

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-10">
        <div>
          <Link href="/pages/SchoolTeam" className="mb-5 inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2.5 text-sm font-black text-slate-700 transition hover:bg-slate-200">
            <FiArrowLeft /> Back to Staff
          </Link>

          <div className="overflow-hidden rounded-[32px] bg-slate-100 p-4">
            {heroImage ? (
              <img src={heroImage} alt={department.name || 'Department'} className="max-h-[560px] w-full rounded-[24px] object-contain" />
            ) : (
              <div className="flex aspect-[16/11] items-center justify-center rounded-[24px] bg-white text-slate-300">
                <FiImage size={56} />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#1f5f3a]">{getCategoryLabel(department.category)}</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">{department.name}</h1>
          <div className="mt-5 rounded-[26px] bg-slate-50 p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Description</p>
            <p className="mt-3 text-base font-medium leading-8 text-slate-600">
              {department.description || 'Department description will appear here once it is added from the admin dashboard.'}
            </p>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <DetailPill icon={FiUsers} label="Teachers" value={teachers.length || Number(department.staffCount) || 0} />
            <DetailPill icon={FiUser} label="HOD" value={department.headName} />
            <DetailPill icon={FiBriefcase} label="AHOD" value={department.assistantHeadName} />
            <DetailPill icon={FiCalendar} label="Updated" value={department.updatedAt ? new Date(department.updatedAt).toLocaleDateString() : ''} />
          </div>

          {(extra.focusAreas || extra.subjects || extra.location || extra.notes) && (
            <div className="mt-7 grid gap-3">
              <DetailBlock icon={FiBookOpen} label="Focus Areas" value={extra.focusAreas} />
              <DetailBlock icon={FiLayers} label="Subjects" value={extra.subjects} />
              <DetailBlock icon={FiMapPin} label="Location" value={extra.location} />
              <DetailBlock icon={FiBookOpen} label="Notes" value={extra.notes} />
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#1f5f3a]">Department Teachers</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">Teaching team</h2>
          </div>
          <p className="text-sm font-bold text-slate-500">{teachers.length} {teachers.length === 1 ? 'teacher' : 'teachers'} mapped</p>
        </div>

        <TeacherCarousel teachers={teachers} onViewTeacher={setSelectedTeacher} />
      </section>

      <style jsx global>{`
        @keyframes department-teacher-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .department-teacher-mask {
          overflow: hidden;
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
        }
        .department-teacher-track {
          width: max-content;
          animation-name: department-teacher-scroll;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .department-teacher-track:hover {
          animation-play-state: paused;
        }
        .department-teacher-static {
          animation: none;
        }
      `}</style>
    </main>
  );
}
