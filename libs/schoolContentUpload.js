import cloudinary from "./cloudinary";

export const SCHOOL_IMAGE_MAX_SIZE = 4.5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export const isFileUpload = (file) =>
  file && typeof file !== "string" && typeof file.arrayBuffer === "function" && file.size > 0;

export const validateSchoolImage = (file) => {
  if (!isFileUpload(file)) return { valid: false, error: "Invalid image file." };

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return {
      valid: false,
      error: "Invalid image format. Only JPEG, PNG, WebP, and GIF images are allowed.",
    };
  }

  if (file.size > SCHOOL_IMAGE_MAX_SIZE) {
    return {
      valid: false,
      error: `Image "${file.name}" is too large. Maximum size is 4.5MB.`,
    };
  }

  return { valid: true };
};

const getPublicIdFromUrl = (url) => {
  if (!url || !url.includes("cloudinary.com")) return null;
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)\.\w+(?:$|\?)/);
  return match?.[1] || null;
};

export const uploadSchoolImage = async (file, folder = "school_hub") => {
  const validation = validateSchoolImage(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const timestamp = Date.now();
  const nameWithoutExt = file.name.includes(".")
    ? file.name.substring(0, file.name.lastIndexOf("."))
    : file.name;
  const sanitizedFileName = nameWithoutExt.replace(/[^a-zA-Z0-9.-]/g, "_");

  const result = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        folder,
        public_id: `${timestamp}-${sanitizedFileName}`,
        transformation: [
          { width: 1400, height: 900, crop: "limit" },
          { quality: "auto:good" },
        ],
      },
      (error, res) => {
        if (error) reject(error);
        else resolve(res);
      }
    );
    uploadStream.end(buffer);
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    altText: file.name,
    caption: "",
  };
};

export const uploadSchoolImagesFromFormData = async (
  formData,
  fieldName = "images",
  folder = "school_hub"
) => {
  const entries = formData.getAll(fieldName).filter(isFileUpload);
  const uploaded = [];

  for (const file of entries) {
    uploaded.push(await uploadSchoolImage(file, folder));
  }

  return uploaded;
};

export const deleteSchoolImages = async (images = []) => {
  const list = Array.isArray(images) ? images : [images];

  await Promise.all(
    list.map(async (image) => {
      const url = typeof image === "string" ? image : image?.url;
      const publicId = image?.publicId || getPublicIdFromUrl(url);
      if (!publicId) return;

      try {
        await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
      } catch (error) {
        console.error("Failed to delete Cloudinary image:", error);
      }
    })
  );
};
