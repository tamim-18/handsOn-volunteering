export const uploadImage = async (file: File): Promise<string> => {
  try {
    console.log("Starting image upload...");
    console.log("Cloud name:", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
    console.log(
      "Upload preset:",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    );

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    const uploadUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
    console.log("Upload URL:", uploadUrl);

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    console.log("Response status:", response.status);
    const responseText = await response.text();
    console.log("Response text:", responseText);

    if (!response.ok) {
      let errorMessage = "Failed to upload image";
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = responseText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = JSON.parse(responseText);
    console.log("Upload successful:", data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error("Detailed upload error:", error);
    throw error;
  }
};
