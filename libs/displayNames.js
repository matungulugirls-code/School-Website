const decodeName = (value = "") => {
  try {
    return decodeURIComponent(String(value));
  } catch {
    return String(value);
  }
};

const basename = (value = "") => {
  const raw = typeof value === "string" ? value : value?.name || value?.fileName || value?.url || "";
  const clean = raw.split("?")[0].split("#")[0].split("/").pop() || "download";
  return decodeName(clean);
};

export const cleanGeneratedFileName = (value = "") => {
  const name = basename(value);
  return name.replace(/^(?:\d{8,}[-_])+/, "") || name || "download";
};

export const cleanFileRecordName = (file = "") => {
  if (typeof file === "string") return cleanGeneratedFileName(file);
  return cleanGeneratedFileName(file.name || file.fileName || file.originalName || file.url);
};
