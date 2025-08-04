/**
 * Converts any image file or blob to WebP format using Canvas API.
 *
 * @param file - The image file or blob to convert.
 * @param originalName - The original filename used to create a new .webp filename.
 * @returns A Promise that resolves to a new WebP File object.
 */
export const convertToWebP = (file: File | Blob, originalName: string): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Failed to get canvas context"));

        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("WebP conversion failed"));

            const webpFile = new File(
              [blob],
              originalName.replace(/\.[^/.]+$/, "") + ".webp",
              {
                type: "image/webp",
                lastModified: Date.now(),
              }
            );

            resolve(webpFile);
          },
          "image/webp",
          0.8 // quality (0-1)
        );
      };

      img.onerror = () => reject(new Error("Image failed to load"));
      img.src = reader.result as string;
    };

    reader.onerror = () => reject(new Error("File reading failed"));
    reader.readAsDataURL(file);
  });
};
