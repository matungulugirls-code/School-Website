'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiRefreshCw,
  FiX,
  FiUpload,
} from 'react-icons/fi';
import { FaBuilding, FaUsers, FaUserTie } from 'react-icons/fa';

const CATEGORY_OPTIONS = [
  { value: 'CBC', label: 'CBC Departments' },
  { value: 'EIGHT_FOUR_FOUR', label: '8-4-4 Departments' },
  { value: 'TEACHING', label: 'Teaching Departments' },
  { value: 'SUPPORT', label: 'Support / Non-Teaching Departments' },
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

const DepartmentModal = ({ open, onClose, onSave, initial }) => {
  const [form, setForm] = useState({
    name: initial?.name || '',
    category: initial?.category || 'TEACHING',
    description: initial?.description || '',
    headName: initial?.headName || '',
    staffCount: typeof initial?.staffCount === 'number' ? String(initial.staffCount) : '0',
    displayOrder: typeof initial?.displayOrder === 'number' ? String(initial.displayOrder) : '0',
    isActive: typeof initial?.isActive === 'boolean' ? initial.isActive : true,
    image: initial?.image || '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm({
      name: initial?.name || '',
      category: initial?.category || 'TEACHING',
      description: initial?.description || '',
      headName: initial?.headName || '',
      staffCount: typeof initial?.staffCount === 'number' ? String(initial.staffCount) : '0',
      displayOrder: typeof initial?.displayOrder === 'number' ? String(initial.displayOrder) : '0',
      isActive: typeof initial?.isActive === 'boolean' ? initial.isActive : true,
      image: initial?.image || '',
    });
    setImageFile(null);
    setError('');
    setSaving(false);
  }, [initial, open]);

  if (!open) return null;

  const submit = async () => {
    setError('');
    if (!form.name.trim()) {
      setError('Department name is required.');
      return;
    }
    if (!form.category) {
      setError('Department category is required.');
      return;
    }

    try {
      setSaving(true);
      const fd = new FormData();
      fd.append('name', form.name.trim());
      fd.append('category', form.category);
      fd.append('description', form.description.trim());
      fd.append('headName', form.headName.trim());
      fd.append('staffCount', String(form.staffCount || '0'));
      fd.append('displayOrder', String(form.displayOrder || '0'));
      fd.append('isActive', form.isActive ? 'true' : 'false');

      if (imageFile) {
        fd.append('image', imageFile);
      } else if (form.image) {
        fd.append('image', form.image);
      }

      await onSave(fd);
      onClose();
    } catch (e) {
      setError(e?.message || 'Failed to save department.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-[28px] bg-white border border-slate-200 shadow-2xl overflow-hidden">
        <div className="px-6 py-5 bg-gradient-to-r from-[#172033] to-[#2d4258] text-white flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/60">
              Staff Departments
            </p>
            <h3 className="mt-1 text-lg font-black truncate">
              {initial?.id ? 'Edit Department' : 'Add Department'}
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
              <label className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                Department Name
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                placeholder="e.g. Sciences Department"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
              Short Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              className="w-full min-h-[92px] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              placeholder="Short overview of this department..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                Staff Count
              </label>
              <input
                value={form.staffCount}
                onChange={(e) => setForm((p) => ({ ...p, staffCount: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                inputMode="numeric"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                Display Order
              </label>
              <input
                value={form.displayOrder}
                onChange={(e) => setForm((p) => ({ ...p, displayOrder: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                inputMode="numeric"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                Visible
              </label>
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, isActive: !p.isActive }))}
                className={`w-full rounded-2xl border px-4 py-3 text-sm font-extrabold transition-colors ${
                  form.isActive
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {form.isActive ? 'Visible' : 'Hidden'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                Head of Department (Optional)
              </label>
              <input
                value={form.headName}
                onChange={(e) => setForm((p) => ({ ...p, headName: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                placeholder="e.g. Mrs. Jane Doe"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                Department Image (Optional)
              </label>
              <div className="flex items-center gap-3">
                <label className="flex-1 cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-extrabold text-slate-700 hover:bg-slate-100 flex items-center justify-center gap-2">
                  <FiUpload />
                  Upload
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
                {imageFile && (
                  <span className="text-xs font-bold text-slate-500 truncate max-w-[12rem]">
                    {imageFile.name}
                  </span>
                )}
              </div>
            </div>
          </div>
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
            {saving ? 'Saving…' : 'Save Department'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function DepartmentsAdmin({ embedded = false }) {
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDepartments = async (isRefresh = false) => {
    try {
      setError('');
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const headers = getAuthHeaders();
      const res = await fetch('/api/staff/departments?includeInactive=1', {
        headers,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || `Failed to fetch departments (${res.status})`);
      }

      setDepartments(Array.isArray(data.departments) ? data.departments : []);
    } catch (e) {
      setDepartments([]);
      setError(e?.message || 'Failed to fetch departments.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDepartments(false);
  }, []);

  const departmentsByCategory = useMemo(() => {
    return departments.reduce((acc, dept) => {
      const key = dept.category || 'TEACHING';
      if (!acc[key]) acc[key] = [];
      acc[key].push(dept);
      return acc;
    }, {});
  }, [departments]);

  const saveDepartment = async (formData) => {
    const headers = getAuthHeaders();
    const url = editing?.id ? `/api/staff/departments/${editing.id}` : '/api/staff/departments';
    const method = editing?.id ? 'PUT' : 'POST';

    const res = await fetch(url, { method, headers, body: formData });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || `Failed to save department (${res.status})`);
    }
    await fetchDepartments(true);
  };

  const deleteDepartment = async (id) => {
    const headers = getAuthHeaders();
    setDeletingId(id);
    try {
      const res = await fetch(`/api/staff/departments/${id}`, {
        method: 'DELETE',
        headers,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || `Failed to delete (${res.status})`);
      }
      await fetchDepartments(true);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div
      className={
        embedded
          ? 'space-y-6'
          : 'space-y-6 p-4 min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-emerald-50'
      }
    >
      <DepartmentModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSave={saveDepartment}
        initial={editing}
      />

      <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_80px_-60px_rgba(15,23,42,0.55)]">
        <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(135deg,#172033_0%,#2d4258_62%,#f2c357_160%)]" />
        <div className="relative p-6 md:p-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-400">
              Staff Departments
            </p>
            <h2 className="mt-2 text-2xl md:text-3xl font-black text-[#172033] tracking-tight">
              Departments & Grouping
            </h2>
            <p className="mt-2 text-sm font-semibold text-slate-600 max-w-2xl">
              Maintain public department groupings (no individual teacher profiles on the public site).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => fetchDepartments(true)}
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
              <FiPlus /> Add Department
            </button>
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
          Loading departments…
        </div>
      ) : (
        <div className="space-y-8">
          {CATEGORY_OPTIONS.map((cat) => {
            const list = departmentsByCategory[cat.value] || [];
            if (!list.length) return null;

            return (
              <section key={cat.value}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-2xl bg-[#172033] text-white flex items-center justify-center">
                    <FaBuilding className="text-sm" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-700">
                      {cat.label}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500">
                      {list.length} {list.length === 1 ? 'department' : 'departments'}
                    </p>
                  </div>
                  <div className="flex-1 h-px bg-slate-200/70" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {list.map((dept) => (
                    <div
                      key={dept.id}
                      className="relative overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_22px_60px_-46px_rgba(15,23,42,0.45)]"
                    >
                      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-r from-[#172033] via-[#2d4258] to-[#f2c357]" />
                      <div className="relative p-5 pt-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <h4 className="text-base font-black text-slate-950 truncate">
                              {dept.name}
                            </h4>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-extrabold ${
                                dept.isActive
                                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                                  : 'border-slate-200 bg-slate-50 text-slate-700'
                              }`}>
                                <FaBuilding className="text-[11px]" />
                                {dept.isActive ? 'Visible' : 'Hidden'}
                              </span>
                              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-extrabold text-slate-800">
                                <FaUsers className="text-[11px]" />
                                {dept.staffCount || 0} Staff
                              </span>
                              {dept.headName && (
                                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-extrabold text-slate-800">
                                  <FaUserTie className="text-[11px]" />
                                  HOD
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {dept.description && (
                          <p className="mt-4 text-sm font-semibold text-slate-700 leading-6 line-clamp-3">
                            {dept.description}
                          </p>
                        )}

                        {dept.headName && (
                          <p className="mt-3 text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">
                            Head: <span className="text-slate-800 normal-case tracking-normal font-bold">{dept.headName}</span>
                          </p>
                        )}

                        <div className="mt-5 flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditing(dept);
                              setModalOpen(true);
                            }}
                            className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-extrabold text-slate-800 hover:bg-slate-100 flex items-center justify-center gap-2"
                          >
                            <FiEdit /> Edit
                          </button>
                          <button
                            onClick={() => deleteDepartment(dept.id)}
                            disabled={deletingId === dept.id}
                            className="flex-1 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-extrabold text-red-700 hover:bg-red-100 flex items-center justify-center gap-2 disabled:opacity-60"
                          >
                            <FiTrash2 /> {deletingId === dept.id ? 'Deleting…' : 'Delete'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}

          {!departments.length && (
            <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-center text-slate-600 font-semibold">
              No departments yet. Click “Add Department” to create the first one.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
