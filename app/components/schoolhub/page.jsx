'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiRefreshCw,
  FiX,
  FiLayers,
  FiEye,
  FiEyeOff,
  FiSearch,
  FiImage,
  FiGrid,
  FiArrowUpRight,
  FiCheckCircle,
  FiAlertCircle,
} from 'react-icons/fi';
import { FaUsers, FaLeaf, FaShieldAlt, FaHome, FaGraduationCap } from 'react-icons/fa';
import ImageUploadField, { normalizeSchoolImages } from './image-upload-field';

const TYPE_OPTIONS = [
  { value: 'CLUB', label: 'Clubs', icon: FaUsers },
  { value: 'SOCIETY', label: 'Societies', icon: FaGraduationCap },
  { value: 'FARM', label: 'Farm', icon: FaLeaf },
  { value: 'BOARDING', label: 'Boarding', icon: FaHome },
  { value: 'SECURITY', label: 'Security', icon: FaShieldAlt },
  { value: 'DEPARTMENT', label: 'Departments', icon: FiLayers },
];

const getAuthHeaders = () => {
  try {
    const adminToken = localStorage.getItem('admin_token');
    const deviceToken = localStorage.getItem('device_token');
    if (!adminToken || !deviceToken) return {};
    return {
      Authorization: `Bearer ${adminToken}`,
      'x-device-token': deviceToken,
    };
  } catch {
    return {};
  }
};

const DetailsEditor = ({ value, onChange }) => {
  const details = Array.isArray(value) ? value : [];

  const add = () => onChange([...(details || []), { title: '', content: '' }]);
  const remove = (idx) => onChange(details.filter((_, i) => i !== idx));
  const update = (idx, patch) =>
    onChange(details.map((d, i) => (i === idx ? { ...d, ...patch } : d)));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Details Sections</p>
        <button
          type="button"
          onClick={add}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-extrabold text-slate-800 hover:bg-slate-100"
        >
          + Add Section
        </button>
      </div>

      {details.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
          No detail sections yet.
        </div>
      ) : (
        <div className="space-y-3">
          {details.map((d, idx) => (
            <div key={idx} className="rounded-[22px] border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
                  Section {idx + 1}
                </p>
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="text-xs font-extrabold text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  value={d.title || ''}
                  onChange={(e) => update(idx, { title: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  placeholder="Section title (e.g. Facilities)"
                />
                <input
                  value={d.content || ''}
                  onChange={(e) => update(idx, { content: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  placeholder="Short content (can be long too)"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FieldLabel = ({ children }) => (
  <label className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
    {children}
  </label>
);

const FormPanel = ({ title, subtitle, icon: Icon, children }) => (
  <section className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm">
    <div className="mb-5 flex items-center gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-emerald-50 text-emerald-700 ring-1 ring-slate-100">
        <Icon />
      </div>
      <div className="min-w-0">
        <h4 className="text-sm font-black tracking-tight text-slate-950">{title}</h4>
        {subtitle && <p className="mt-0.5 text-xs font-semibold text-slate-500">{subtitle}</p>}
      </div>
    </div>
    {children}
  </section>
);

const StatCard = ({ label, value, icon: Icon, color, description }) => (
  <div className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">
    <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-10 blur-2xl ${color}`} />
    <div className="relative z-10">
      <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg ${color}`}>
        <Icon className="text-xl" />
      </div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-3xl font-black tracking-tight text-slate-950">{value}</p>
          <p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
            {label}
          </p>
        </div>
        <FiArrowUpRight className="mb-2 text-emerald-500" />
      </div>
      {description && (
        <p className="mt-4 border-t border-slate-100 pt-4 text-xs font-semibold leading-5 text-slate-400">
          {description}
        </p>
      )}
    </div>
  </div>
);

const HubItemModal = ({ open, onClose, onSave, initial, defaultType }) => {
  const [form, setForm] = useState({
    type: initial?.type || defaultType || 'CLUB',
    title: initial?.title || '',
    shortDescription: initial?.shortDescription || '',
    description: initial?.description || '',
    contactName: initial?.contactName || '',
    contactPhone: initial?.contactPhone || '',
    contactEmail: initial?.contactEmail || '',
    displayOrder: typeof initial?.displayOrder === 'number' ? String(initial.displayOrder) : '0',
    isActive: typeof initial?.isActive === 'boolean' ? initial.isActive : true,
    image: initial?.image || '',
    details: Array.isArray(initial?.details) ? initial.details : [],
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [uploadError, setUploadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm({
      type: initial?.type || defaultType || 'CLUB',
      title: initial?.title || '',
      shortDescription: initial?.shortDescription || '',
      description: initial?.description || '',
      contactName: initial?.contactName || '',
      contactPhone: initial?.contactPhone || '',
      contactEmail: initial?.contactEmail || '',
      displayOrder: typeof initial?.displayOrder === 'number' ? String(initial.displayOrder) : '0',
      isActive: typeof initial?.isActive === 'boolean' ? initial.isActive : true,
      image: initial?.image || '',
      details: Array.isArray(initial?.details) ? initial.details : [],
    });
    setImageFiles([]);
    setRemovedImages([]);
    setUploadError('');
    setSaving(false);
    setError('');
  }, [open, initial, defaultType]);

  if (!open) return null;

  const submit = async () => {
    setError('');
    if (!form.title.trim()) {
      setError('Title is required.');
      return;
    }

    try {
      setSaving(true);
      const fd = new FormData();
      fd.append('type', form.type);
      fd.append('title', form.title.trim());
      fd.append('shortDescription', form.shortDescription.trim());
      fd.append('description', form.description.trim());
      fd.append('contactName', form.contactName.trim());
      fd.append('contactPhone', form.contactPhone.trim());
      fd.append('contactEmail', form.contactEmail.trim());
      fd.append('displayOrder', String(form.displayOrder || '0'));
      fd.append('isActive', form.isActive ? 'true' : 'false');
      fd.append('details', JSON.stringify(Array.isArray(form.details) ? form.details : []));

      imageFiles.forEach((file) => fd.append('images', file));
      removedImages.forEach((url) => fd.append('imagesToRemove', url));
      if (!imageFiles.length && form.image) fd.append('image', form.image);

      await onSave(fd);
      onClose();
    } catch (e) {
      setError(e?.message || 'Failed to save item.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-5">
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[32px] border border-white/40 bg-white shadow-2xl">
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-slate-900 px-6 py-6 text-white sm:px-8">
          <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-emerald-300/10 blur-2xl" />
          <div className="relative flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-xl backdrop-blur-md">
                <FiLayers className="text-2xl text-emerald-100" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/55">
                  School Hub Manager
                </p>
                <h3 className="mt-1 truncate text-xl font-black tracking-tight sm:text-2xl">
                  {initial?.id ? 'Edit Hub Item' : 'Create Hub Item'}
                </h3>
                <p className="mt-1 text-xs font-semibold text-white/60">
                  Manage content, images, visibility and public page details.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 hover:bg-white/15"
            >
              <FiX />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6">
          {error && (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_0.82fr]">
            <div className="space-y-5">
              <FormPanel title="Content Identity" subtitle="Public page title, type and summary" icon={FiBookOpen}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <FieldLabel>Type</FieldLabel>
                    <select
                      value={form.type}
                      onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    >
                      {TYPE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <FieldLabel>Title</FieldLabel>
                    <input
                      value={form.title}
                      onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                      placeholder="e.g. Debate Club, Boarding Life"
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <FieldLabel>Short Description</FieldLabel>
                  <textarea
                    value={form.shortDescription}
                    onChange={(e) => setForm((p) => ({ ...p, shortDescription: e.target.value }))}
                    className="min-h-[92px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    placeholder="Short overview shown on public cards"
                  />
                </div>

                <div className="mt-4 space-y-2">
                  <FieldLabel>Full Description</FieldLabel>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    className="min-h-[130px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    placeholder="Full details for the item modal/page view"
                  />
                </div>
              </FormPanel>

              <FormPanel title="Structured Details" subtitle="Reusable detail blocks for public pages" icon={FiLayers}>
                <DetailsEditor
                  value={form.details}
                  onChange={(next) => setForm((p) => ({ ...p, details: next }))}
                />
              </FormPanel>
            </div>

            <div className="space-y-5">
              <FormPanel title="Visibility & Order" subtitle="Control publishing and page ordering" icon={FiEye}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="space-y-2">
                    <FieldLabel>Display Order</FieldLabel>
                    <input
                      value={form.displayOrder}
                      onChange={(e) => setForm((p) => ({ ...p, displayOrder: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                      inputMode="numeric"
                    />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel>Status</FieldLabel>
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, isActive: !p.isActive }))}
                      className={`flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-black transition-colors ${
                        form.isActive
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                          : 'border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {form.isActive ? <FiCheckCircle /> : <FiAlertCircle />} {form.isActive ? 'Visible' : 'Hidden'}
                    </button>
                  </div>
                </div>
              </FormPanel>

              <FormPanel title="Contact Information" subtitle="Optional patron, leader or office details" icon={FiUsers}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <FieldLabel>Contact Name</FieldLabel>
                    <input
                      value={form.contactName}
                      onChange={(e) => setForm((p) => ({ ...p, contactName: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                      placeholder="Patron / Leader"
                    />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel>Contact Phone</FieldLabel>
                    <input
                      value={form.contactPhone}
                      onChange={(e) => setForm((p) => ({ ...p, contactPhone: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                      placeholder="Optional"
                    />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel>Contact Email</FieldLabel>
                    <input
                      value={form.contactEmail}
                      onChange={(e) => setForm((p) => ({ ...p, contactEmail: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                      placeholder="Optional"
                    />
                  </div>
                </div>
              </FormPanel>

              <FormPanel title="Image Gallery" subtitle="Multiple images, previews and removals" icon={FiImage}>
                <ImageUploadField
                  existingImages={normalizeSchoolImages(initial)}
                  files={imageFiles}
                  removedImages={removedImages}
                  error={uploadError}
                  setError={setUploadError}
                  onChange={({ files, removedImages: nextRemoved }) => {
                    setImageFiles(files);
                    setRemovedImages(nextRemoved);
                  }}
                />
              </FormPanel>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-slate-200 bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-end">
          <button
            onClick={onClose}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-black text-slate-800 hover:bg-slate-100"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-indigo-500/20 hover:opacity-95 disabled:opacity-60"
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save Item'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function SchoolHubManager() {
  const [activeType, setActiveType] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchItems = async (isRefresh = false) => {
    try {
      setError('');
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const headers = getAuthHeaders();
      const res = await fetch('/api/schoolhub?includeInactive=1', { headers });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || `Failed to fetch items (${res.status})`);
      }
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch (e) {
      setItems([]);
      setError(e?.message || 'Failed to fetch items.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchItems(false);
  }, []);

  const visibleItems = useMemo(() => {
    const byType = activeType === 'ALL' ? items : items.filter((i) => i.type === activeType);
    const query = searchTerm.trim().toLowerCase();
    if (!query) return byType;

    return byType.filter((item) =>
      [
        item.title,
        item.shortDescription,
        item.description,
        item.contactName,
        item.contactEmail,
        item.contactPhone,
        item.type,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [items, activeType, searchTerm]);

  const groupedCounts = useMemo(() => {
    return TYPE_OPTIONS.reduce((acc, opt) => {
      acc[opt.value] = items.filter((i) => i.type === opt.value).length;
      return acc;
    }, {});
  }, [items]);

  const activeCount = useMemo(() => items.filter((item) => item.isActive).length, [items]);
  const imageCount = useMemo(
    () => items.reduce((sum, item) => sum + normalizeSchoolImages(item).length, 0),
    [items]
  );

  const saveItem = async (formData) => {
    const headers = getAuthHeaders();
    const url = editing?.id ? `/api/schoolhub/${editing.id}` : '/api/schoolhub';
    const method = editing?.id ? 'PUT' : 'POST';

    const res = await fetch(url, { method, headers, body: formData });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || `Failed to save item (${res.status})`);
    }
    await fetchItems(true);
  };

  const deleteItem = async (id) => {
    const headers = getAuthHeaders();
    setDeletingId(id);
    try {
      const res = await fetch(`/api/schoolhub/${id}`, { method: 'DELETE', headers });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || `Failed to delete (${res.status})`);
      }
      await fetchItems(true);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen space-y-8 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-emerald-50/30 p-4">
      <HubItemModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSave={saveItem}
        initial={editing}
        defaultType={activeType !== 'ALL' ? activeType : 'CLUB'}
      />

      <div className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-700 via-violet-700 to-slate-950 p-7 text-white shadow-2xl md:rounded-[2.5rem] md:p-10">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '42px 42px' }} />
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-indigo-300/20 blur-[90px]" />
        <div className="absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-emerald-300/10 blur-[90px]" />

        <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-3xl">
            <div className="mb-7 flex items-center gap-5">
              <div className="h-12 w-1.5 rounded-full bg-gradient-to-b from-emerald-300 via-teal-300 to-indigo-300 shadow-[0_0_24px_rgba(45,212,191,0.55)]" />
              <div className="space-y-1">
                <p className="text-[11px] font-black uppercase tracking-[0.32em] text-emerald-100">
                  Matungulu Girls Senior School
                </p>
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  School Hub Administration
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl border border-white/15 bg-white/10 shadow-xl backdrop-blur-xl">
                <FiLayers className="text-3xl text-emerald-100" />
              </div>
              <h2 className="text-3xl font-black leading-none tracking-tight md:text-5xl">
                School Hub <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-white to-indigo-200">Manager</span>
              </h2>
            </div>
            <p className="mt-5 max-w-2xl rounded-2xl bg-white/[0.03] px-4 py-3 text-sm font-semibold leading-7 text-white/65">
              Manage clubs, societies, farm, boarding, security and department content with reusable uploads, structured details and public visibility controls.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/15 px-4 py-2 text-xs font-black uppercase tracking-widest text-emerald-100">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                {activeCount} visible
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-widest text-white/60">
                {imageCount} images managed
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
            <button
              onClick={() => fetchItems(true)}
              className="group/btn relative flex items-center justify-center gap-3 overflow-hidden rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-white transition hover:bg-white/15 disabled:opacity-50"
              disabled={refreshing}
            >
              <FiRefreshCw className={refreshing ? 'animate-spin text-base' : 'text-base transition-transform group-hover/btn:rotate-180'} />
              {refreshing ? 'Refreshing' : 'Refresh'}
            </button>

            <button
              onClick={() => {
                setEditing(null);
                setModalOpen(true);
              }}
              className="group/btn relative flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-white px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-950 shadow-xl transition hover:bg-emerald-50"
            >
              <FiPlus className="text-base transition-transform group-hover/btn:rotate-90" />
              Add Item
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Items"
          value={items.length}
          icon={FiLayers}
          color="bg-gradient-to-br from-indigo-500 to-violet-600"
          description="All managed School Hub records."
        />
        <StatCard
          label="Visible"
          value={activeCount}
          icon={FiCheckCircle}
          color="bg-gradient-to-br from-emerald-500 to-teal-600"
          description="Published on public pages."
        />
        <StatCard
          label="Images"
          value={imageCount}
          icon={FiImage}
          color="bg-gradient-to-br from-blue-500 to-cyan-600"
          description="Uploaded and saved media assets."
        />
        <StatCard
          label="Sections"
          value={TYPE_OPTIONS.length}
          icon={FiGrid}
          color="bg-gradient-to-br from-amber-500 to-orange-600"
          description="Content groups available."
        />
      </div>

      <div className="relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-5 shadow-xl shadow-slate-200/40">
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-indigo-500/5 blur-3xl" />
        <div className="relative z-10 space-y-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.26em] text-slate-400">
                Filter Engine
              </p>
              <h3 className="mt-1 text-xl font-black tracking-tight text-slate-950">
                Browse School Hub Records
              </h3>
            </div>
            <div className="relative w-full lg:max-w-md">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search title, contact, type or description..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-bold text-slate-900 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveType('ALL')}
              className={`rounded-2xl border px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-all ${
                activeType === 'ALL'
                  ? 'border-slate-950 bg-slate-950 text-white shadow-lg'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <FiLayers className="mr-2 inline-block" /> All ({items.length})
            </button>
            {TYPE_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  onClick={() => setActiveType(opt.value)}
                  className={`rounded-2xl border px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-all ${
                    activeType === opt.value
                      ? 'border-slate-950 bg-slate-950 text-white shadow-lg'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="mr-2 inline-block text-[11px]" />
                  {opt.label} ({groupedCounts[opt.value] || 0})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-center text-slate-600 font-semibold">
          Loading School Hub items…
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visibleItems.map((item) => {
            const typeMeta = TYPE_OPTIONS.find((t) => t.value === item.type);
            const Icon = typeMeta?.icon || FaUsers;
            const images = normalizeSchoolImages(item);

            return (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-5 shadow-xl shadow-slate-200/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-indigo-500/5 blur-3xl transition-opacity group-hover:opacity-100" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-emerald-50 text-emerald-700 ring-1 ring-slate-100">
                        <Icon className="text-lg" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="truncate text-base font-black tracking-tight text-slate-950">{item.title}</h4>
                        <p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                          {typeMeta?.label || item.type}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-widest ${
                        item.isActive
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 bg-slate-50 text-slate-600'
                      }`}
                    >
                      {item.isActive ? <FiEye className="text-[11px]" /> : <FiEyeOff className="text-[11px]" />}
                      {item.isActive ? 'Live' : 'Hidden'}
                    </span>
                  </div>

                  {images.length > 0 ? (
                    <div className="mt-5 grid grid-cols-4 gap-2">
                      {images.slice(0, 4).map((image, index) => (
                        <div key={image.url} className="relative h-16 overflow-hidden rounded-2xl border border-slate-100 bg-slate-100 shadow-sm">
                          <img src={image.url} alt={image.altText || `${item.title} image ${index + 1}`} className="h-full w-full object-cover" />
                          {index === 3 && images.length > 4 && (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 text-xs font-black text-white">
                              +{images.length - 4}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-5 flex h-24 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-xs font-black uppercase tracking-widest text-slate-400">
                      No images
                    </div>
                  )}

                  {item.shortDescription && (
                    <p className="mt-4 text-sm font-semibold text-slate-700 leading-6 line-clamp-3">
                      {item.shortDescription}
                    </p>
                  )}

                  {(item.contactName || item.contactPhone || item.contactEmail) && (
                    <p className="mt-3 text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">
                      Contact:{' '}
                      <span className="text-slate-800 normal-case tracking-normal font-bold">
                        {item.contactName || item.contactPhone || item.contactEmail}
                      </span>
                    </p>
                  )}

                  <div className="mt-5 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditing(item);
                        setModalOpen(true);
                      }}
                      className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-800 hover:bg-slate-100"
                    >
                      <FiEdit /> Edit
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      disabled={deletingId === item.id}
                      className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-black text-red-700 hover:bg-red-100 disabled:opacity-60"
                    >
                      <FiTrash2 /> {deletingId === item.id ? 'Deleting…' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {!visibleItems.length && (
            <div className="sm:col-span-2 xl:col-span-3 rounded-[28px] border border-slate-200 bg-white p-10 text-center text-slate-600 font-semibold">
              No items yet. Click “Add Item” to create the first record.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
