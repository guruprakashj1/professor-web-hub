
// File upload utility for gallery media
export const uploadFile = async (file: File, type: 'photo' | 'video'): Promise<string> => {
  // Create a unique filename
  const timestamp = Date.now();
  const extension = file.name.split('.').pop();
  const filename = `${type}_${timestamp}.${extension}`;
  
  // Create the folder structure
  const folderPath = type === 'photo' ? 'gallery/photos' : 'gallery/videos';
  
  // For this demo, we'll use a data URL
  // In a real implementation, you would upload to a cloud storage service
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      // Store the file path info in localStorage for demo purposes
      const uploadedFiles = JSON.parse(localStorage.getItem('uploaded_files') || '{}');
      uploadedFiles[filename] = {
        path: `${folderPath}/${filename}`,
        dataUrl: dataUrl,
        type: type,
        uploadedAt: new Date().toISOString()
      };
      localStorage.setItem('uploaded_files', JSON.stringify(uploadedFiles));
      
      console.log(`File uploaded: ${folderPath}/${filename}`);
      resolve(dataUrl);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

export const validateMediaFile = (file: File, type: 'photo' | 'video'): boolean => {
  const maxSize = type === 'photo' ? 10 * 1024 * 1024 : 100 * 1024 * 1024; // 10MB for photos, 100MB for videos
  
  if (file.size > maxSize) {
    throw new Error(`File size too large. Maximum ${type === 'photo' ? '10MB' : '100MB'} allowed.`);
  }
  
  const allowedTypes = type === 'photo' 
    ? ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    : ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'];
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
  }
  
  return true;
};
