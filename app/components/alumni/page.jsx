"use client";

import { useEffect, useMemo, useState } from "react";
import { FiEdit, FiImage, FiPlus, FiRefreshCw, FiSave, FiTrash2, FiUsers, FiX } from "react-icons/fi";
import { toast } from "sonner";

const MAX_PROFILE_IMAGE_SIZE = 4.2 * 1024 * 1024;

const SECTION_OPTIONS = [
  { value: "ALUMNI", label: "Alumni Gallery" },
  { value: "BOM", label: "Board of Management" },
  { value: "PTA", label: "PTA Members" },
  { value: "CURRENT_PRINCIPAL", label: "Current Principal" },
  { value: "PAST_PRINCIPAL", label: "Previous Principals" },
];

const emptyForm = {
  categoryType: "ALUMNI",
  name: "",
  position: "",
  description: "",
  yearsServed: "",
  achievements: "",
  displayOrder: 0,
  isActive: true,
  isPublished: true,
  image: null,
  images: [],
  existingImage: "",
  existingImages: [],
};

const formatMb = (bytes) => `${(bytes / (1024 * 1024)).toFixed(1)}MB`;

const normalizeRecordImages = (record) => {
  const related = Array.isArray(record?.images)
    ? record.images.map((image) => ({
        id: image?.id,
        url: image?.url || image,
        altText: image?.altText || record?.name || "Profile image",
        caption: image?.caption || "",
      }))
    : [];

  const legacy = record?.image
    ? [{ url: record.image, altText: record?.name || "Profile image", caption: "" }]
    : [];

  const seen = new Set();
  return [...related, ...legacy].filter((image) => {
    if (!image?.url || seen.has(image.url)) return false;
    seen.add(image.url);
    return true;
  });
};

const getAuthHeaders = () => {
  const adminToken = localStorage.getItem("admin_token");
  const deviceToken = localStorage.getItem("device_token");
  if (!adminToken || !deviceToken) throw new Error("Authentication required");
  return {
    Authorization: `Bearer ${adminToken}`,
    "x-device-token": deviceToken,
  };
};

function RecordModal({ record, onClose, onSaved }) {
  const normalizedExistingImages = useMemo(() => normalizeRecordImages(record), [record]);
  const [form, setForm] = useState(() => record ? {
    categoryType: record.categoryType || record.section || "ALUMNI",
    name: record.name || "",
    position: record.position || "",
    description: record.description || "",
    yearsServed: record.yearsServed || "",
    achievements: Array.isArray(record.achievements) ? record.achievements.join("\n") : "",
    displayOrder: record.displayOrder || 0,
    isActive: record.isActive !== false,
    isPublished: record.isPublished !== false,
    image: null,
    images: [],
    existingImage: record.image || "",
    existingImages: normalizedExistingImages.filter((image) => image.url !== record.image),
  } : emptyForm);
  const [imageError, setImageError] = useState("");
  const [saving, setSaving] = useState(false);
  const originalImageUrls = useMemo(() => {
    if (!record) return [];
    return normalizeRecordImages(record).map((image) => image.url);
  }, [record]);
  const selectedPrimaryPreview = useMemo(
    () => (form.image ? URL.createObjectURL(form.image) : ""),
    [form.image]
  );
  const selectedGalleryPreviews = useMemo(
    () => form.images.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [form.images]
  );

  useEffect(() => {
    return () => {
      if (selectedPrimaryPreview) URL.revokeObjectURL(selectedPrimaryPreview);
      selectedGalleryPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [selectedPrimaryPreview, selectedGalleryPreviews]);

  const update = (field, value) => setForm((previous) => ({ ...previous, [field]: value }));

  const removeExistingGalleryImage = (url) => {
    setForm((previous) => ({
      ...previous,
      existingImages: previous.existingImages.filter((item) => item.url !== url),
    }));
  };

  const addImageFiles = (field, fileList) => {
    const incoming = Array.from(fileList || []);
    if (field === "image") {
      const file = incoming[0] || null;
      if (!file) return update("image", null);
      if (!file.type?.startsWith("image/")) {
        setImageError(`${file.name} is not an image.`);
        return;
      }
      if (file.size > MAX_PROFILE_IMAGE_SIZE) {
        setImageError(`${file.name} is ${formatMb(file.size)}. Max is 4.2MB.`);
        return;
      }
      setImageError("");
      update("image", file);
      return;
    }

    const valid = [];
    const rejected = [];
    incoming.forEach((file) => {
      if (!file.type?.startsWith("image/")) rejected.push(`${file.name} is not an image.`);
      else if (file.size > MAX_PROFILE_IMAGE_SIZE) rejected.push(`${file.name} is ${formatMb(file.size)}. Max is 4.2MB.`);
      else valid.push(file);
    });

    if (rejected.length) setImageError(rejected[0]);
    else setImageError("");
    if (valid.length) update("images", [...form.images, ...valid]);
  };

  const removeNewGalleryImage = (index) => {
    update("images", form.images.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const payload = new FormData();
      payload.append("categoryType", form.categoryType);
      payload.append("name", form.name.trim());
      payload.append("position", form.position.trim());
      payload.append("description", form.description.trim());
      payload.append("yearsServed", form.yearsServed.trim());
      payload.append("achievements", form.achievements.trim());
      payload.append("displayOrder", String(Number(form.displayOrder) || 0));
      payload.append("isActive", form.isActive ? "true" : "false");
      payload.append("isPublished", form.isPublished ? "true" : "false");

      const keptImageUrls = new Set([
        form.existingImage,
        ...(form.existingImages || []).map((image) => image?.url),
      ].filter(Boolean));
      const imagesToRemove = originalImageUrls.filter((url) => !keptImageUrls.has(url));
      if (imagesToRemove.length > 0) {
        payload.append("imagesToRemove", JSON.stringify(imagesToRemove));
      }

      if (form.image) payload.append("image", form.image);
      form.images.forEach((file) => payload.append("images", file));

      const response = await fetch(record?.id ? `/api/alumni/${record.id}` : "/api/alumni", {
        method: record?.id ? "PUT" : "POST",
        headers: getAuthHeaders(),
        body: payload,
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Failed to save record");

      toast.success(record?.id ? "Record updated" : "Record created");
      onSaved();
    } catch (error) {
      toast.error(error.message || "Failed to save record");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-blue-700">Alumni & Governance</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">{record ? "Edit Record" : "Create Record"}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg bg-slate-100 p-2 text-slate-600">
            <FiX />
          </button>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Section</span>
            <select value={form.categoryType} onChange={(event) => update("categoryType", event.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold">
              {SECTION_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Name</span>
            <input required value={form.name} onChange={(event) => update("name", event.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold" />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Position</span>
            <input value={form.position} onChange={(event) => update("position", event.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold" placeholder="Chairperson, Member, Principal" />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Display Order</span>
            <input type="number" value={form.displayOrder} onChange={(event) => update("displayOrder", event.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold" />
          </label>
          <label className="space-y-2 sm:col-span-2">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Description / Biography</span>
            <textarea value={form.description} onChange={(event) => update("description", event.target.value)} rows={4} className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold leading-6" />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Years Served</span>
            <input value={form.yearsServed} onChange={(event) => update("yearsServed", event.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold" placeholder="2018 - 2024" />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Achievements</span>
            <textarea value={form.achievements} onChange={(event) => update("achievements", event.target.value)} rows={2} className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold leading-6" placeholder="One achievement per line" />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Primary Image</span>
            <input type="file" accept="image/*" onChange={(event) => addImageFiles("image", event.target.files)} className="w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-bold file:text-blue-700" />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Gallery Images</span>
            <input type="file" accept="image/*" multiple onChange={(event) => addImageFiles("images", event.target.files)} className="w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-bold file:text-blue-700" />
          </label>
          <label className="flex items-center gap-3 rounded-lg bg-slate-50 p-4 text-sm font-bold text-slate-700">
            <input type="checkbox" checked={form.isActive} onChange={(event) => update("isActive", event.target.checked)} className="h-5 w-5" />
            Active
          </label>
          <label className="flex items-center gap-3 rounded-lg bg-slate-50 p-4 text-sm font-bold text-slate-700">
            <input type="checkbox" checked={form.isPublished} onChange={(event) => update("isPublished", event.target.checked)} className="h-5 w-5" />
            Published
          </label>
        </div>

        {imageError && (
          <div className="mx-5 mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {imageError}
          </div>
        )}

        {(form.existingImage || form.existingImages.length > 0 || selectedPrimaryPreview || selectedGalleryPreviews.length > 0) && (
          <div className="border-t border-slate-100 px-5 pb-5">
            <p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">Review Images</p>
            <div className="grid gap-3 sm:grid-cols-4">
              {form.existingImage && (
                <div className="relative rounded-lg border border-slate-200 bg-slate-50 p-2">
                  <img src={form.existingImage} alt="Primary" className="h-24 w-full object-contain" />
                  <button type="button" onClick={() => update("existingImage", "")} className="absolute right-2 top-2 rounded-full bg-red-600 p-1 text-white">
                    <FiX />
                  </button>
                </div>
              )}
              {selectedPrimaryPreview && (
                <div className="relative rounded-lg border border-blue-200 bg-blue-50 p-2">
                  <img src={selectedPrimaryPreview} alt={form.image?.name || "New primary"} className="h-24 w-full object-contain" />
                  <button type="button" onClick={() => update("image", null)} className="absolute right-2 top-2 rounded-full bg-red-600 p-1 text-white">
                    <FiX />
                  </button>
                  <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-blue-700">New Primary</p>
                </div>
              )}
              {form.existingImages.map((image) => (
                <div key={image.url} className="relative rounded-lg border border-slate-200 bg-slate-50 p-2">
                  <img src={image.url} alt={image.altText || "Gallery"} className="h-24 w-full object-contain" />
                  <button type="button" onClick={() => removeExistingGalleryImage(image.url)} className="absolute right-2 top-2 rounded-full bg-red-600 p-1 text-white">
                    <FiX />
                  </button>
                </div>
              ))}
              {selectedGalleryPreviews.map((preview, index) => (
                <div key={`${preview.file.name}-${index}`} className="relative rounded-lg border border-emerald-200 bg-emerald-50 p-2">
                  <img src={preview.url} alt={preview.file.name} className="h-24 w-full object-contain" />
                  <button type="button" onClick={() => removeNewGalleryImage(index)} className="absolute right-2 top-2 rounded-full bg-red-600 p-1 text-white">
                    <FiX />
                  </button>
                  <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-emerald-700">New Gallery</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 border-t border-slate-200 p-5">
          <button type="button" onClick={onClose} className="rounded-lg bg-slate-100 px-5 py-3 text-sm font-black uppercase tracking-widest text-slate-600">Cancel</button>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-3 text-sm font-black uppercase tracking-widest text-white disabled:opacity-50">
            <FiSave /> {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

function ImageManagerModal({ record, onClose, onSaved }) {
  const originalImages = useMemo(() => normalizeRecordImages(record), [record]);
  const [keptImages, setKeptImages] = useState(originalImages);
  const [saving, setSaving] = useState(false);

  const removeImage = (url) => {
    setKeptImages((previous) => previous.filter((image) => image.url !== url));
  };

  const handleSave = async () => {
    const keptUrls = new Set(keptImages.map((image) => image.url));
    const imagesToRemove = originalImages.map((image) => image.url).filter((url) => !keptUrls.has(url));

    if (imagesToRemove.length === 0) {
      onClose();
      return;
    }

    try {
      setSaving(true);
      const payload = new FormData();
      payload.append("imagesToRemove", JSON.stringify(imagesToRemove));

      const response = await fetch(`/api/alumni/${record.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: payload,
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Failed to update images");

      toast.success("Images updated");
      onSaved();
    } catch (error) {
      toast.error(error.message || "Failed to update images");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[230] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-blue-700">Manage Images</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">{record.name}</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Review saved primary and gallery images, then remove the ones that should no longer appear.
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg bg-slate-100 p-2 text-slate-600">
            <FiX />
          </button>
        </div>

        <div className="p-5">
          {keptImages.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {keptImages.map((image) => (
                <div key={image.url} className="relative rounded-lg border border-slate-200 bg-slate-50 p-2">
                  <img src={image.url} alt={image.altText || record.name} className="h-44 w-full rounded-md object-contain" />
                  <button
                    type="button"
                    onClick={() => removeImage(image.url)}
                    className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-black uppercase tracking-widest text-white shadow"
                  >
                    <FiTrash2 /> Remove
                  </button>
                  <p className="mt-2 truncate text-xs font-bold text-slate-500">
                    {image.url === record.image ? "Primary image" : image.caption || "Gallery image"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
              <FiImage className="mx-auto text-5xl text-slate-300" />
              <p className="mt-3 text-sm font-bold text-slate-500">All saved images have been marked for removal.</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 p-5">
          <button type="button" onClick={onClose} className="rounded-lg bg-slate-100 px-5 py-3 text-sm font-black uppercase tracking-widest text-slate-600">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-3 text-sm font-black uppercase tracking-widest text-white disabled:opacity-50"
          >
            <FiSave /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AlumniGovernanceManager() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRecord, setEditingRecord] = useState(null);
  const [managingImagesRecord, setManagingImagesRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [section, setSection] = useState("all");

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/alumni?includeInactive=1", { headers: getAuthHeaders() });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Failed to load records");
      setRecords(data.profiles || data.records || []);
    } catch (error) {
      toast.error(error.message || "Failed to load records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const filtered = useMemo(() => records.filter((record) => section === "all" || (record.categoryType || record.section) === section), [records, section]);

  const handleDelete = async (record) => {
    if (!window.confirm(`Delete "${record.name}"?`)) return;
    try {
      const response = await fetch(`/api/alumni/${record.id}`, { method: "DELETE", headers: getAuthHeaders() });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Failed to delete record");
      toast.success("Record deleted");
      fetchRecords();
    } catch (error) {
      toast.error(error.message || "Failed to delete record");
    }
  };

  const openCreate = () => {
    setEditingRecord(null);
    setShowModal(true);
  };

  const openEdit = (record) => {
    setEditingRecord(record);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-blue-700">Alumni Management Module</p>
            <h1 className="mt-2 text-2xl font-black text-slate-950">Alumni, BOM, PTA & Principals</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">Create, edit, update, and delete public alumni galleries and leadership records.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button onClick={fetchRecords} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-700">
              <FiRefreshCw /> Refresh
            </button>
            <button onClick={openCreate} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-3 text-xs font-black uppercase tracking-widest text-white">
              <FiPlus /> Add Record
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-5">
          {SECTION_OPTIONS.map((option) => (
            <div key={option.value} className="rounded-lg bg-slate-50 p-4">
              <FiUsers className="text-blue-700" />
              <p className="mt-2 text-xl font-black text-slate-950">{records.filter((record) => (record.categoryType || record.section) === option.value).length}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{option.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <select value={section} onChange={(event) => setSection(event.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold sm:max-w-xs">
          <option value="all">All Sections</option>
          {SECTION_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="rounded-lg bg-white p-10 text-center text-sm font-bold text-slate-500">Loading records...</div>
      ) : filtered.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-black uppercase tracking-widest">Name</th>
                  <th className="px-4 py-4 text-left text-xs font-black uppercase tracking-widest">Section</th>
                  <th className="px-4 py-4 text-left text-xs font-black uppercase tracking-widest">Description</th>
                  <th className="px-4 py-4 text-left text-xs font-black uppercase tracking-widest">Images</th>
                  <th className="px-4 py-4 text-left text-xs font-black uppercase tracking-widest">Status</th>
                  <th className="px-4 py-4 text-right text-xs font-black uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((record) => {
                  const categoryType = record.categoryType || record.section;
                  const label = SECTION_OPTIONS.find((option) => option.value === categoryType)?.label || categoryType;
                  const recordImages = normalizeRecordImages(record);
                  const galleryCount = recordImages.length;

                  return (
                    <tr key={record.id} className="align-top hover:bg-slate-50">
                      <td className="min-w-[220px] px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                            {record.image ? (
                              <img src={record.image} alt={record.name} className="h-full w-full rounded-lg object-cover" />
                            ) : (
                              <FiImage className="text-xl text-slate-300" />
                            )}
                          </div>
                          <div>
                            <p className="font-black text-slate-950">{record.name}</p>
                            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">{record.position || "Position not set"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="min-w-[180px] px-4 py-4 text-sm font-bold text-slate-700">{label}</td>
                      <td className="min-w-[280px] px-4 py-4 text-sm leading-6 text-slate-600">{record.description || "No description added."}</td>
                      <td className="min-w-[220px] px-4 py-4 text-sm font-bold text-slate-700">
                        <div className="flex items-center gap-3">
                          <div className="flex -space-x-3">
                            {recordImages.slice(0, 4).map((image) => (
                              <img
                                key={image.url}
                                src={image.url}
                                alt={image.altText || record.name}
                                className="h-10 w-10 rounded-lg border-2 border-white bg-slate-100 object-cover"
                              />
                            ))}
                            {recordImages.length === 0 && (
                              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-300">
                                <FiImage />
                              </span>
                            )}
                          </div>
                          <span>{galleryCount} image{galleryCount === 1 ? "" : "s"}</span>
                        </div>
                      </td>
                      <td className="min-w-[120px] px-4 py-4">
                        <span className={`inline-flex rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest ${record.isActive === false ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
                          {record.isActive === false ? "Inactive" : "Active"}
                        </span>
                      </td>
                      <td className="min-w-[150px] px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setManagingImagesRecord(record)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-700">
                            <FiImage /> Manage Images
                          </button>
                          <button onClick={() => openEdit(record)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-black uppercase tracking-widest text-white">
                            <FiEdit /> Edit
                          </button>
                          <button onClick={() => handleDelete(record)} className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
          <FiUsers className="mx-auto text-5xl text-slate-300" />
          <h2 className="mt-4 text-xl font-black text-slate-950">No records found</h2>
          <button onClick={openCreate} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-3 text-xs font-black uppercase tracking-widest text-white">
            <FiPlus /> Add Record
          </button>
        </div>
      )}

      {showModal && (
        <RecordModal
          record={editingRecord}
          onClose={() => {
            setShowModal(false);
            setEditingRecord(null);
          }}
          onSaved={() => {
            setShowModal(false);
            setEditingRecord(null);
            fetchRecords();
          }}
        />
      )}
      {managingImagesRecord && (
        <ImageManagerModal
          record={managingImagesRecord}
          onClose={() => setManagingImagesRecord(null)}
          onSaved={() => {
            setManagingImagesRecord(null);
            fetchRecords();
          }}
        />
      )}
    </div>
  );
}
