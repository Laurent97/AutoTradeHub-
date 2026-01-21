// Cloudinary Service for Image Upload
// Uses fetch API to upload images to Cloudinary

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dxqfel9iy';
const UPLOAD_PRESET = 'Autoroad'; // Use unsigned upload for simplicity

// Upload image to Cloudinary using unsigned upload
export async function uploadImageToCloudinary(file: File): Promise<string> {
  try {
    // Validate file
    if (!file || file.size === 0) {
      throw new Error('No file provided or file is empty');
    }

    console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);
    console.log('Cloud name:', CLOUD_NAME);
    console.log('Upload preset:', UPLOAD_PRESET);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'auto-drive-depot/products');

    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    console.log('Upload URL:', uploadUrl);

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
      // Add headers to prevent CORS issues
      headers: {
        'Accept': 'application/json',
      }
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudinary error response:', errorText);
      throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Cloudinary success response:', data);
    
    if (!data.secure_url) {
      throw new Error('No secure_url in Cloudinary response');
    }
    
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error(`Failed to upload image to Cloudinary: ${error.message}`);
  }
}

// Upload multiple images to Cloudinary
export async function uploadMultipleImagesToCloudinary(files: File[]): Promise<string[]> {
  try {
    console.log('Starting upload of', files.length, 'files');
    const uploadPromises = files.map(file => uploadImageToCloudinary(file));
    const urls = await Promise.all(uploadPromises);
    console.log('All uploads completed:', urls);
    return urls;
  } catch (error) {
    console.error('Error uploading multiple images to Cloudinary:', error);
    throw new Error(`Failed to upload images to Cloudinary: ${error.message}`);
  }
}

// Delete image from Cloudinary (optional - requires API secret)
export async function deleteImageFromCloudinary(publicId: string): Promise<void> {
  try {
    // Note: This requires server-side implementation due to API secret
    console.log('Delete from Cloudinary not implemented client-side for security');
    // You would need to implement this on your backend
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
}

// Get public ID from Cloudinary URL
export function getPublicIdFromUrl(url: string): string {
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  return filename.split('.')[0];
}

export default {
  uploadImageToCloudinary,
  uploadMultipleImagesToCloudinary,
  deleteImageFromCloudinary,
  getPublicIdFromUrl
};
