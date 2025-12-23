// /lib/cloudinary.ts - Complete Cloudinary Upload Utility

export const uploadToCloudinary = async (file: File): Promise<string> => {
  try {
    console.log("🔄 Starting Cloudinary upload process...");
    console.log("📁 File details:", {
      name: file.name,
      size: (file.size / 1024).toFixed(2) + " KB",
      type: file.type
    });

    // Validate environment variables
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName) {
      throw new Error("Cloudinary cloud name is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in .env.local");
    }

    if (!uploadPreset) {
      throw new Error("Cloudinary upload preset is not configured. Set NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local");
    }

    // Create form data with ONLY allowed parameters for unsigned uploads
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'team-members');
    
    // REMOVED: transformation parameters - these must be set in the upload preset instead
    // formData.append('transformation', 'c_fill,w_500,h_500,g_faces');
    // formData.append('quality', 'auto:good');
    // formData.append('fetch_format', 'auto');
    // formData.append('flags', 'progressive');
    
    console.log("📤 Uploading to Cloudinary (unsigned mode)...");
    console.log("☁️ Cloud Name:", cloudName);
    console.log("⚙️ Upload Preset:", uploadPreset);

    // Construct upload URL
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    // Upload to Cloudinary
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    console.log("📡 Cloudinary response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Cloudinary upload failed:", errorText);
      
      // Try to parse error if it's JSON
      let errorMessage = `Upload failed with status ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorMessage;
      } catch {
        // Not JSON, use text as is
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(`Cloudinary upload failed: ${errorMessage}`);
    }

    const data = await response.json();
    
    console.log("✅ Cloudinary upload successful!");
    console.log("📊 Response:", {
      public_id: data.public_id,
      format: data.format,
      bytes: data.bytes,
      width: data.width,
      height: data.height,
      url: data.secure_url ? 'Yes (secure)' : 'No'
    });

    // Return secure URL if available, otherwise regular URL
    const imageUrl = data.secure_url || data.url;
    
    if (!imageUrl) {
      throw new Error("Cloudinary did not return an image URL");
    }

    console.log("🔗 Generated URL:", imageUrl);
    return imageUrl;

  } catch (error: any) {
    console.error("❌ Error in Cloudinary upload:", error);
    
    // Provide more specific error messages
    if (error.message.includes("Failed to fetch")) {
      throw new Error("Network error: Cannot connect to Cloudinary. Check your internet connection.");
    } else if (error.message.includes("cloud name")) {
      throw new Error("Cloudinary configuration error: Check your NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in .env.local");
    } else if (error.message.includes("upload preset")) {
      throw new Error("Cloudinary configuration error: Check your NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local");
    } else {
      throw new Error(`Failed to upload image: ${error.message || "Unknown error"}`);
    }
  }
};

// Optional: Function to delete image from Cloudinary
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error("Cloudinary credentials not configured");
    }

    // In a real implementation, you'd need to call a server-side API
    // to securely delete images since API secret shouldn't be exposed client-side
    console.log("Would delete image with public_id:", publicId);
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
};

// Helper function to extract public_id from Cloudinary URL
export const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    // Cloudinary URL pattern: https://res.cloudinary.com/{cloud_name}/image/upload/{public_id}
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z]+)?$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
};

// Function to generate optimized image URL with transformations
export const getOptimizedImageUrl = (
  originalUrl: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
  }
): string => {
  if (!originalUrl || !originalUrl.includes('cloudinary.com')) {
    return originalUrl; // Return as is if not a Cloudinary URL
  }

  try {
    const url = new URL(originalUrl);
    const pathParts = url.pathname.split('/');
    const uploadIndex = pathParts.indexOf('upload');
    
    if (uploadIndex === -1) {
      return originalUrl;
    }

    // Build transformations
    const transformations = [];
    
    if (options?.width && options?.height) {
      transformations.push(`c_fill,w_${options.width},h_${options.height}`);
    } else if (options?.width) {
      transformations.push(`w_${options.width}`);
    } else if (options?.height) {
      transformations.push(`h_${options.height}`);
    }
    
    if (options?.quality) {
      transformations.push(`q_${options.quality}`);
    }
    
    if (options?.format) {
      transformations.push(`f_${options.format}`);
    }

    // Add quality auto and progressive by default
    if (!transformations.some(t => t.startsWith('q_'))) {
      transformations.push('q_auto:good');
    }
    
    if (!transformations.some(t => t.startsWith('f_'))) {
      transformations.push('f_auto');
    }

    // Insert transformations into URL
    if (transformations.length > 0) {
      const transformString = transformations.join(',');
      pathParts.splice(uploadIndex + 1, 0, transformString);
    }

    url.pathname = pathParts.join('/');
    return url.toString();
  } catch (error) {
    console.error("Error optimizing Cloudinary URL:", error);
    return originalUrl;
  }
};