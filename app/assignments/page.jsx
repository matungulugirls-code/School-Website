"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FiCalendar,
  FiDownload,
  FiEye,
  FiFileText,
  FiRefreshCw,
  FiSearch,
  FiArchive,
  FiX,
} from "react-icons/fi";

const cleanFileName = (value = "") => {
  const lastPart = String(value).split("/").pop() || "download";
  const decoded = decodeURIComponent(lastPart.split("?")[0].split("#")[0]);
  return decoded.replace(/^(?:\d{8,}[-_])+/, "") || decoded || "download";
};

const getAssignmentFiles = (assignment) => {
  if (Array.isArray(assignment.files) && assignment.files.length > 0) {
    return assignment.files
      .map((file) => {
        if (typeof file === "string") {
          return {
            url: file,
            name: cleanFileName(file),
            fileType: "File",
          };
        }

        return file?.url
          ? {
              url: file.url,
              name: cleanFileName(file.name || file.fileName || file.url),
              fileType: file.fileType || "File",
            }
          : null;
      })
      .filter(Boolean);
  }

  return [...(assignment.assignmentFiles || []), ...(assignment.attachments || [])]
    .filter(Boolean)
    .map((url) => ({
      url,
      name: cleanFileName(url),
      fileType: "File",
    }));
};

const truncateText = (value = "", length = 120) => {
  if (!value) return "No description provided.";
  return value.length > length ? `${value.slice(0, length).trim()}...` : value;
};

const formatDate = (value) => {
  if (!value) return "Not specified";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not specified";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function AssignmentsClient() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const fetchAssignments = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/assignment?public=1", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Could not load assignments");
      }
      setAssignments(result.assignments || []);
    } catch (err) {
      setError(err.message || "Could not load assignments");
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const filteredAssignments = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return assignments;
    return assignments.filter((assignment) => {
      const files = getAssignmentFiles(assignment).map((file) => file.name).join(" ");
      return [assignment.title, assignment.description, assignment.subject, assignment.className, files]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [assignments, query]);

  const downloadFile = (file) => {
    const link = document.createElement("a");
    link.href = file.url;
    link.download = cleanFileName(file.name || file.url);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const downloadAll = (files) => {
    files.forEach((file, index) => {
      window.setTimeout(() => downloadFile(file), index * 250);
    });
  };

  return (
    <div className="bg-[#f6f8f4] text-slate-950">
      <section className="relative overflow-hidden bg-slate-950">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('/Matungulu/29.jpeg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-emerald-950/80 to-slate-950/65" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-16">
          <div className="max-w-3xl">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-emerald-200">
              Academic downloads
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
              Assignments
            </h1>
            <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-white/75 md:text-base">
              Access published school assignments, supporting documents, and downloadable learning materials.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
              Published records
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
              Assignment Files
            </h2>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative block">
              <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search assignments"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm font-semibold text-slate-800 outline-none ring-0 transition focus:border-emerald-500 sm:w-72"
              />
            </label>
            <button
              type="button"
              onClick={fetchAssignments}
              disabled={loading}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              <FiRefreshCw className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[900px] text-left">
              <thead className="bg-slate-50 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
                <tr>
                  <th className="px-5 py-4">Title</th>
                  <th className="px-5 py-4">Description</th>
                  <th className="px-5 py-4">Date Uploaded</th>
                  <th className="px-5 py-4">Files</th>
                  <th className="px-5 py-4 text-right">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-5 py-12 text-center text-sm font-bold text-slate-500">
                      Loading assignments...
                    </td>
                  </tr>
                ) : filteredAssignments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-5 py-12 text-center text-sm font-bold text-slate-500">
                      No published assignments available.
                    </td>
                  </tr>
                ) : (
                  filteredAssignments.map((assignment) => {
                    const files = getAssignmentFiles(assignment);
                    return (
                      <tr key={assignment.id} className="align-top transition hover:bg-emerald-50/35">
                        <td className="px-5 py-5">
                          <div className="flex items-start gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                              <FiFileText />
                            </span>
                            <div>
                              <p className="font-black text-slate-950">{assignment.title}</p>
                              <p className="mt-1 text-xs font-bold text-slate-500">
                                {[assignment.subject, assignment.className].filter(Boolean).join(" • ") || "General"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="max-w-md px-5 py-5 text-sm font-medium leading-6 text-slate-600">
                          {truncateText(assignment.description)}
                        </td>
                        <td className="px-5 py-5">
                          <div className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700">
                            <FiCalendar className="text-emerald-700" />
                            {formatDate(assignment.dateAssigned || assignment.createdAt)}
                          </div>
                        </td>
                        <td className="px-5 py-5">
                          <div className="flex max-w-xs flex-wrap gap-2">
                            {files.length > 0 ? (
                              files.map((file) => (
                                <span
                                  key={`${assignment.id}-${file.url}`}
                                  className="inline-flex max-w-[220px] items-center gap-2 truncate rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600"
                                  title={file.name}
                                >
                                  <FiArchive className="shrink-0 text-emerald-700" />
                                  <span className="truncate">{file.name}</span>
                                </span>
                              ))
                            ) : (
                              <span className="text-sm font-bold text-slate-400">No files</span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-5 text-right">
                          <div className="flex flex-col items-stretch gap-2 sm:items-end">
                            <button
                              type="button"
                              onClick={() => setSelectedAssignment(assignment)}
                              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                            >
                              <FiEye />
                              View All
                            </button>
                            {files.length > 1 ? (
                            <button
                              type="button"
                              onClick={() => downloadAll(files)}
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-black text-white transition hover:bg-emerald-800"
                            >
                              <FiDownload />
                              Download All
                            </button>
                          ) : files.length === 1 ? (
                            <button
                              type="button"
                              onClick={() => downloadFile(files[0])}
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white transition hover:bg-slate-800"
                            >
                              <FiDownload />
                              Download
                            </button>
                          ) : (
                            <span className="text-sm font-bold text-slate-400">Unavailable</span>
                          )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-slate-100 md:hidden">
            {loading ? (
              <div className="px-4 py-10 text-center text-sm font-bold text-slate-500">Loading assignments...</div>
            ) : filteredAssignments.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm font-bold text-slate-500">
                No published assignments available.
              </div>
            ) : (
              filteredAssignments.map((assignment) => {
                const files = getAssignmentFiles(assignment);
                return (
                  <article key={assignment.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                        <FiFileText />
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-black text-slate-950">{assignment.title}</h3>
                        <p className="mt-1 text-xs font-bold text-slate-500">
                          {formatDate(assignment.dateAssigned || assignment.createdAt)}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                      {truncateText(assignment.description)}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {files.map((file) => (
                        <span key={file.url} className="max-w-full truncate rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                          {file.name}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4">
                      <div className="grid gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedAssignment(assignment)}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700"
                        >
                          <FiEye />
                          View All
                        </button>
                      {files.length > 1 ? (
                        <button
                          type="button"
                          onClick={() => downloadAll(files)}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-black text-white"
                        >
                          <FiDownload />
                          Download All
                        </button>
                      ) : files.length === 1 ? (
                        <button
                          type="button"
                          onClick={() => downloadFile(files[0])}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white"
                        >
                          <FiDownload />
                          Download
                        </button>
                      ) : null}
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </section>

      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-emerald-700">
                  {selectedAssignment.subject || "Assignment"}
                </p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">{selectedAssignment.title}</h2>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">
                  {[selectedAssignment.className, selectedAssignment.teacher, formatDate(selectedAssignment.dateAssigned || selectedAssignment.createdAt)].filter(Boolean).join(" / ")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAssignment(null)}
                className="rounded-xl bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200"
                aria-label="Close details"
              >
                <FiX />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Description</h3>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                  {selectedAssignment.description || "No description provided."}
                </p>
              </div>

              {selectedAssignment.instructions && (
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Instructions</h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                    {selectedAssignment.instructions}
                  </p>
                </div>
              )}

              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Files</h3>
                  {getAssignmentFiles(selectedAssignment).length > 1 && (
                    <button
                      type="button"
                      onClick={() => downloadAll(getAssignmentFiles(selectedAssignment))}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-3 py-2 text-xs font-black uppercase tracking-widest text-white"
                    >
                      <FiArchive /> Download All
                    </button>
                  )}
                </div>
                <div className="grid gap-2">
                  {getAssignmentFiles(selectedAssignment).length > 0 ? (
                    getAssignmentFiles(selectedAssignment).map((file, index) => (
                      <button
                        key={`${file.url}-${index}`}
                        type="button"
                        onClick={() => downloadFile(file)}
                        className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-bold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        <span className="truncate">{file.name}</span>
                        <FiDownload className="shrink-0" />
                      </button>
                    ))
                  ) : (
                    <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-500">
                      No files available.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
