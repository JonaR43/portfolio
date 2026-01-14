import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config/env';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
}

export const cloudinaryService = {
  /**
   * Upload an image buffer to Cloudinary
   */
  uploadImage: async (buffer: Buffer, folder: string = 'portfolio'): Promise<UploadResult> => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            { quality: 'auto', fetch_format: 'auto' },
            { width: 1200, crop: 'limit' }, // Max width 1200px
          ],
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error('Upload failed'));
          } else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              width: result.width,
              height: result.height,
            });
          }
        }
      ).end(buffer);
    });
  },

  /**
   * Delete an image from Cloudinary
   */
  deleteImage: async (publicId: string): Promise<void> => {
    await cloudinary.uploader.destroy(publicId);
  },

  /**
   * Get optimized URL for an image
   */
  getOptimizedUrl: (publicId: string, width?: number): string => {
    return cloudinary.url(publicId, {
      fetch_format: 'auto',
      quality: 'auto',
      width: width || 800,
      crop: 'limit',
    });
  },
};
