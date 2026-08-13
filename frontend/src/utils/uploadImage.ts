// frontend/src/utils/uploadImage.ts
import axios from 'axios';

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || 'ab0ed793552b3f0e18a009bacf8d8301';

export const uploadToImgBB = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('key', IMGBB_API_KEY);

  try {
    const response = await axios.post('https://api.imgbb.com/1/upload', formData);
    return response.data.data.url; 
  } catch (error) {
    console.error('Ошибка загрузки на ImgBB:', error);
    throw new Error('Не удалось загрузить изображение');
  }
};