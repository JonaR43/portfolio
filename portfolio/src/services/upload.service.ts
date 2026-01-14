import api from './api';

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
}

export const uploadService = {
  uploadImage: async (file: File): Promise<UploadResult> => {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await api.post<{ success: boolean; image: UploadResult }>(
      '/upload/image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return data.image;
  },

  deleteImage: async (publicId: string): Promise<void> => {
    await api.delete(`/upload/image/${encodeURIComponent(publicId)}`);
  },
};
