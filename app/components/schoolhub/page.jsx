'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiRefreshCw,
  FiX,
  FiUpload,
  FiLayers,
  FiEye,
  FiEyeOff,
} from 'react-icons/fi';
import { FaUsers, FaLeaf, FaShieldAlt, FaHome, FaGraduationCap } from 'react-icons/fa';

const TYPE_OPTIONS = [
  { value: 'CLUB', label: 'Clubs', icon: FaUsers },
  { value: 'SOCIETY', label: 'Societies', icon: FaGraduationCap },
  { value: 'FARM', label: 'Farm', icon: FaLeaf },
  { value: 'BOARDING', label: 'Boarding', icon: FaHome },
  { value: 'SECURITY', label: 'Security', icon: FaShieldAlt },
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

  const [imageFile, setImageFile] = useState(null);
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
    setImageFile(null);
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

      if (imageFile) {
        fd.append('image', imageFile);
      } else if (form.image) {
        fd.append('image', form.image);
      }

      await onSave(fd);
      onClose();
    } catch (e) {
      setError(e?.message || 'Failed to save item.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="w-full max-w-3xl rounded-[28px] bg-white border border-slate-200 shadow-2xl overflow-hidden">
        <div className="px-6 py-5 bg-gradient-to-r from-[#172033] to-[#2d4258] text-white flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/60">
              School Hub Manager
            </p>
            <h3 className="mt-1 text-lg font-black truncate">
              {initial?.id ? 'Edit Item' : 'Add Item'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-2xl border border-white/15 bg-white/10 hover:bg-white/15 flex items-center justify-center"
          >
            <FiX />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              >
                {TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                placeholder="e.g. Debate Club, Boarding Life, School Security"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Short Description</label>
            <textarea
              value={form.shortDescription}
              onChange={(e) => setForm((p) => ({ ...p, shortDescription: e.target.value }))}
              className="w-full min-h-[84px] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              placeholder="Short overview (appears on cards)"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Full Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              className="w-full min-h-[110px] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              placeholder="Full description for the page view"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Contact Name</label>
              <input
                value={form.contactName}
                onChange={(e) => setForm((p) => ({ ...p, contactName: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                placeholder="Patron / Leader"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Contact Phone</label>
              <input
                value={form.contactPhone}
                onChange={(e) => setForm((p) => ({ ...p, contactPhone: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                placeholder="Optional"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Contact Email</label>
              <input
                value={form.contactEmail}
                onChange={(e) => setForm((p) => ({ ...p, contactEmail: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Display Order</label>
              <input
                value={form.displayOrder}
                onChange={(e) => setForm((p) => ({ ...p, displayOrder: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                inputMode="numeric"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Visibility</label>
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, isActive: !p.isActive }))}
                className={`w-full rounded-2xl border px-4 py-3 text-sm font-extrabold transition-colors flex items-center justify-center gap-2 ${
                  form.isActive
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {form.isActive ? <FiEye /> : <FiEyeOff />} {form.isActive ? 'Visible' : 'Hidden'}
              </button>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Image</label>
              <label className="w-full cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-extrabold text-slate-700 hover:bg-slate-100 flex items-center justify-center gap-2">
                <FiUpload /> Upload
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setImageFile(file);
                  }}
                />
              </label>
            </div>
          </div>

          <DetailsEditor
            value={form.details}
            onChange={(next) => setForm((p) => ({ ...p, details: next }))}
          />
        </div>

        <div className="px-6 py-5 border-t border-slate-200 bg-white flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-extrabold text-slate-800 hover:bg-slate-100"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="rounded-2xl bg-[#172033] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#2d2d44] disabled:opacity-60"
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
    if (activeType === 'ALL') return items;
    return items.filter((i) => i.type === activeType);
  }, [items, activeType]);

  const groupedCounts = useMemo(() => {
    return TYPE_OPTIONS.reduce((acc, opt) => {
      acc[opt.value] = items.filter((i) => i.type === opt.value).length;
      return acc;
    }, {});
  }, [items]);

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
    <div className="space-y-6 p-4 min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-emerald-50">
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

      <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_80px_-60px_rgba(15,23,42,0.55)]">
        <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(135deg,#172033_0%,#2d4258_62%,#f2c357_160%)]" />
        <div className="relative p-6 md:p-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-400">School Hub</p>
            <h2 className="mt-2 text-2xl md:text-3xl font-black text-[#172033] tracking-tight">
              Clubs, Societies, Farm, Boarding & Security
            </h2>
            <p className="mt-2 text-sm font-semibold text-slate-600 max-w-2xl">
              Manage School Hub public pages with a single, consistent system.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => fetchItems(true)}
              className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm font-extrabold text-slate-800 hover:bg-slate-50 flex items-center gap-2"
              disabled={refreshing}
            >
              <FiRefreshCw />
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </button>

            <button
              onClick={() => {
                setEditing(null);
                setModalOpen(true);
              }}
              className="rounded-2xl bg-[#172033] px-4 py-3 text-sm font-extrabold text-white hover:bg-[#2d2d44] flex items-center gap-2"
            >
              <FiPlus /> Add Item
            </button>
          </div>
        </div>

        <div className="relative px-6 pb-6 md:px-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveType('ALL')}
              className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all ${
                activeType === 'ALL'
                  ? 'bg-[#172033] text-white border-[#172033]'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <FiLayers className="inline-block mr-2" /> All ({items.length})
            </button>
            {TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setActiveType(opt.value)}
                className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all ${
                  activeType === opt.value
                    ? 'bg-[#172033] text-white border-[#172033]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {opt.label} ({groupedCounts[opt.value] || 0})
              </button>
            ))}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {visibleItems.map((item) => {
            const typeMeta = TYPE_OPTIONS.find((t) => t.value === item.type);
            const Icon = typeMeta?.icon || FaUsers;

            return (
              <div
                key={item.id}
                className="relative overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_22px_60px_-46px_rgba(15,23,42,0.45)]"
              >
                <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-r from-[#172033] via-[#2d4258] to-[#f2c357]" />

                <div className="relative p-5 pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h4 className="text-base font-black text-slate-950 truncate">{item.title}</h4>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-extrabold text-slate-800">
                          <Icon className="text-[11px]" /> {typeMeta?.label || item.type}
                        </span>
                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-extrabold ${
                            item.isActive
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                              : 'border-slate-200 bg-slate-50 text-slate-700'
                          }`}
                        >
                          {item.isActive ? <FiEye className="text-[11px]" /> : <FiEyeOff className="text-[11px]" />}
                          {item.isActive ? 'Visible' : 'Hidden'}
                        </span>
                      </div>
                    </div>
                  </div>

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
                      className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-extrabold text-slate-800 hover:bg-slate-100 flex items-center justify-center gap-2"
                    >
                      <FiEdit /> Edit
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      disabled={deletingId === item.id}
                      className="flex-1 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-extrabold text-red-700 hover:bg-red-100 flex items-center justify-center gap-2 disabled:opacity-60"
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

