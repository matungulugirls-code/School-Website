"use client";

import { useMemo, useState } from "react";
import {
  FiAward,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiImage,
  FiMaximize2,
  FiStar,
  FiUsers,
  FiX,
} from "react-icons/fi";

export default function AlumniGalleryCard({ record, images = [], eyebrow }) {
  const galleryImages = useMemo(() => {
    const legacy = record?.image ? [{ url: record.image, altText: record.name || "Profile image" }] : [];
    const seen = new Set();
    return [...images, ...legacy].filter((image) => {
      if (!image?.url || seen.has(image.url)) return false;
      seen.add(image.url);
      return true;
    });
  }, [images, record?.image, record?.name]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const activeImage = galleryImages[activeIndex] || galleryImages[0];

  const goTo = (direction) => {
    if (galleryImages.length < 2) return;
    setActiveIndex((index) => (index + direction + galleryImages.length) % galleryImages.length);
  };

  return (
    <>
      <article className="group grid w-full overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-xl xl:grid-cols-[minmax(420px,1.05fr)_minmax(0,1.15fr)]">
        <div className="relative min-h-[340px] bg-slate-100 sm:min-h-[460px] xl:min-h-[520px]">
          {activeImage?.url ? (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="h-full w-full bg-slate-100 text-left"
              aria-label={`Open ${record.name} gallery`}
            >
              <img
                src={activeImage.url}
                alt={activeImage.altText || record.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
              />
            </button>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-emerald-50">
              <FiUsers className="text-6xl text-emerald-300" />
            </div>
          )}

          <div className="absolute left-3 top-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-700 shadow-sm">
              <FiAward className="text-xs" /> {eyebrow}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-slate-950/85 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800"
            aria-label={`View ${galleryImages.length} images`}
          >
            <FiImage className="text-[11px]" /> {galleryImages.length}
            <FiMaximize2 className="text-[11px]" />
          </button>

          {galleryImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => goTo(-1)}
                className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-sm transition hover:bg-white sm:flex"
                aria-label="Previous image"
              >
                <FiChevronLeft />
              </button>
              <button
                type="button"
                onClick={() => goTo(1)}
                className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-sm transition hover:bg-white sm:flex"
                aria-label="Next image"
              >
                <FiChevronRight />
              </button>
              <div className="absolute inset-x-3 bottom-3 flex gap-2 overflow-x-auto rounded-xl bg-slate-950/70 p-2 backdrop-blur-md">
                {galleryImages.slice(0, 8).map((image, index) => (
                  <button
                    type="button"
                    key={`${image.url}-${index}`}
                    onClick={() => setActiveIndex(index)}
                    className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border bg-white/10 transition ${
                      activeIndex === index ? "border-white ring-2 ring-white/45" : "border-white/25 opacity-80 hover:opacity-100"
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img src={image.url} alt={image.altText || `${record.name} ${index + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
                {galleryImages.length > 8 && (
                  <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg bg-white/15 text-sm font-black text-white"
                  >
                    +{galleryImages.length - 8}
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex min-h-[320px] flex-col p-5 sm:p-7 xl:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700">{eyebrow}</p>
              <h2 className="mt-2 text-2xl font-black leading-tight text-slate-950 sm:text-4xl">{record.name}</h2>
            </div>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-slate-600 transition hover:bg-slate-200"
            >
              <FiMaximize2 className="text-[11px] text-emerald-600" /> View Gallery
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {record.position && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-emerald-700">
                <FiCheckCircle className="text-xs" /> {record.position}
              </span>
            )}
            {record.yearsServed && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                <FiClock className="text-xs" /> {record.yearsServed}
              </span>
            )}
          </div>

          {record.description && (
            <p className="mt-6 text-sm font-medium leading-7 text-slate-600 sm:text-base">{record.description}</p>
          )}

          {record.achievements?.length > 0 && (
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {record.achievements.slice(0, 4).map((achievement, index) => (
                <div key={`${achievement}-${index}`} className="flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
                  <FiStar className="mt-0.5 shrink-0 text-sm text-amber-500" />
                  <p className="text-sm font-semibold leading-6 text-slate-700">{achievement}</p>
                </div>
              ))}
            </div>
          )}

          {galleryImages.length > 1 && (
            <div className="mt-auto pt-7">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Gallery Preview</p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
                {galleryImages.slice(0, 10).map((image, index) => (
                  <button
                    type="button"
                    key={`${image.url}-preview-${index}`}
                    onClick={() => {
                      setActiveIndex(index);
                      setOpen(true);
                    }}
                    className="relative aspect-[4/3] overflow-hidden rounded-lg border border-slate-200 bg-slate-100 transition hover:border-emerald-300"
                    aria-label={`Open image ${index + 1}`}
                  >
                    <img src={image.url} alt={image.altText || `${record.name} preview ${index + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {open && activeImage?.url && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-3 sm:p-6">
          <div className="relative flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">{eyebrow}</p>
                <h3 className="text-base font-black text-slate-950 sm:text-xl">{record.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                aria-label="Close gallery"
              >
                <FiX />
              </button>
            </div>

            <div className="relative min-h-0 flex-1 bg-slate-950">
              <img src={activeImage.url} alt={activeImage.altText || record.name} className="h-full w-full object-contain" />
              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => goTo(-1)}
                    className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-sm transition hover:bg-white"
                    aria-label="Previous image"
                  >
                    <FiChevronLeft />
                  </button>
                  <button
                    type="button"
                    onClick={() => goTo(1)}
                    className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-sm transition hover:bg-white"
                    aria-label="Next image"
                  >
                    <FiChevronRight />
                  </button>
                </>
              )}
            </div>

            {galleryImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto border-t border-slate-200 bg-white p-3">
                {galleryImages.map((image, index) => (
                  <button
                    type="button"
                    key={`${image.url}-modal-${index}`}
                    onClick={() => setActiveIndex(index)}
                    className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border bg-slate-100 transition ${
                      activeIndex === index ? "border-emerald-600 ring-2 ring-emerald-200" : "border-slate-200"
                    }`}
                    aria-label={`Show gallery image ${index + 1}`}
                  >
                    <img src={image.url} alt={image.altText || `${record.name} thumbnail ${index + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
