import { ref, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Uploads a file to ImgBB (for images) or via our Serverless API (for PDFs/documents)
 * @param file The file to upload
 * @param path The storage path (fallback metadata)
 * @returns Promise resolving to the download URL
 */
export const uploadFile = async (file: File, path: string): Promise<string> => {
  // If the file is an image, upload directly to ImgBB
  if (file.type.startsWith('image/')) {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      throw new Error('ImgBB API key (NEXT_PUBLIC_IMGBB_API_KEY) is not configured.');
    }

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to upload image to ImgBB');
    }

    const result = await response.json();
    return result.data.url;
  }

  // Route non-image files (e.g. PDF/Word resumes) through our serverless CORS-free upload API
  const uploadFormData = new FormData();
  uploadFormData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: uploadFormData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to upload document.');
  }

  const result = await response.json();
  return result.url;
};

/**
 * Deletes a file from Firebase Storage given its URL (ignores external URLs like ImgBB and Catbox)
 * @param fileUrl The full download URL of the file
 */
export const deleteFile = async (fileUrl: string) => {
  try {
    if (fileUrl.includes('imgbb.com') || fileUrl.includes('catbox.moe')) {
      console.log('Skipping deletion for externally hosted file:', fileUrl);
      return;
    }

    const decodedUrl = decodeURIComponent(fileUrl);
    const startIndex = decodedUrl.indexOf('/o/') + 3;
    const endIndex = decodedUrl.indexOf('?');
    
    if (startIndex !== -1 && endIndex !== -1) {
      const filePath = decodedUrl.substring(startIndex, endIndex);
      const storageRef = ref(storage, filePath);
      await deleteObject(storageRef);
    }
  } catch (error) {
    console.error("Error deleting file from storage", error);
    throw error;
  }
};
