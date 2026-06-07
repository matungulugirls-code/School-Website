import { prisma } from "../../libs/prisma";
import { FiAward, FiBriefcase, FiUsers, FiStar } from "react-icons/fi";
import AlumniGalleryCard from "./alumni-gallery-card";

export const metadata = {
  title: "Alumni & Governance | Matungulu Girls School",
  description: "Alumni galleries, Board of Management, PTA members, and principal leadership at Matungulu Girls School.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SECTION_META = {
  ALUMNI: {
    title: "Alumni Gallery",
    eyebrow: "Former Students",
    icon: FiAward,
  },
  BOM: {
    title: "Board of Management",
    eyebrow: "Governance",
    icon: FiBriefcase,
  },
  PTA: {
    title: "PTA Members",
    eyebrow: "Parent Leadership",
    icon: FiUsers,
  },
  CURRENT_PRINCIPAL: {
    title: "Current Principal",
    eyebrow: "School Leadership",
    icon: FiStar,
  },
  PAST_PRINCIPAL: {
    title: "Previous Principals",
    eyebrow: "Leadership History",
    icon: FiUsers,
  },
};

const orderedSections = ["ALUMNI", "BOM", "PTA", "CURRENT_PRINCIPAL", "PAST_PRINCIPAL"];
const LEGACY_CATEGORY_MAP = {
  PRINCIPAL_CURRENT: "CURRENT_PRINCIPAL",
  PRINCIPAL_PREVIOUS: "PAST_PRINCIPAL",
};

const normalizeCategoryType = (value) => {
  const category = value?.toString?.().trim?.() || "ALUMNI";
  return LEGACY_CATEGORY_MAP[category] || category;
};

const normalizeProfileImages = (record) => {
  const related = Array.isArray(record?.images)
    ? record.images.map((image) => ({
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

const normalizeAchievements = (record) => {
  if (!Array.isArray(record?.achievements)) return [];
  return record.achievements
    .map((achievement) => {
      if (typeof achievement === "string") return achievement;
      return achievement?.title || achievement?.content || achievement?.label || "";
    })
    .filter(Boolean);
};

export default async function AlumniPage() {
  const records = await prisma.communityProfile.findMany({
    where: { isActive: true, isPublished: true },
    include: { images: { orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }] } },
    orderBy: [{ categoryType: "asc" }, { displayOrder: "asc" }, { createdAt: "desc" }],
  });

  const grouped = records.reduce((acc, record) => {
    const categoryType = normalizeCategoryType(record.categoryType);
    if (!acc[categoryType]) acc[categoryType] = [];
    acc[categoryType].push({ ...record, categoryType });
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-700">Matungulu Girls</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Alumni & Governance
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            Celebrating our alumni achievements, school governance, PTA leadership, and the principals who have shaped 
            <span className="font-semibold text-emerald-700"> Matungulu Girls School</span> into a beacon of excellence.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
        {orderedSections.map((sectionKey) => {
          const section = SECTION_META[sectionKey];
          const sectionRecords = grouped[sectionKey] || [];
          const Icon = section.icon;
          if (sectionRecords.length === 0) return null;

          return (
            <section key={sectionKey}>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-md">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-emerald-600">{section.eyebrow}</p>
                  <h2 className="text-2xl font-black text-slate-950">{section.title}</h2>
                </div>
              </div>
              <div className="grid gap-5 rounded-2xl bg-white p-3 shadow-sm sm:p-4">
                {sectionRecords.map((record) => {
                  const plainRecord = {
                    id: record.id,
                    name: record.name,
                    position: record.position,
                    description: record.description,
                    yearsServed: record.yearsServed,
                    image: record.image,
                    achievements: normalizeAchievements(record),
                  };

                  return (
                    <AlumniGalleryCard
                      key={record.id}
                      record={plainRecord}
                      images={normalizeProfileImages(record)}
                      eyebrow={section.eyebrow}
                    />
                  );
                })}
              </div>
            </section>
          );
        })}

        {records.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-emerald-200 bg-white/50 p-12 text-center backdrop-blur-sm">
            <FiUsers className="mx-auto text-5xl text-emerald-300" />
            <h2 className="mt-4 text-xl font-black text-slate-950">No records published yet</h2>
            <p className="mt-2 text-sm text-slate-500">Alumni and governance records will appear here soon.</p>
          </div>
        )}
      </div>
    </main>
  );
}
