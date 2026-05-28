import { useState } from 'react'

export default function UploadZone({ onFileSelect }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer?.files?.[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      onFileSelect(droppedFile);
    } else {
      alert('Пожалуйста, перетащите изображение.');
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      onFileSelect(file);
    } else {
      alert('Пожалуйста, выберите изображение.');
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative flex flex-col items-center justify-center w-full max-w-md p-10 
        border-2 border-dashed rounded-xl transition-colors duration-200 ease-in-out
        ${isDragging 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}
      `}
    >
      <div className="text-center">
        <svg 
          className={`mx-auto h-12 w-12 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} 
          stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true" 
        >
        </svg>
        <p className="mt-4 text-sm text-gray-600">
          <span className="font-semibold text-blue-600">Перетащите картинку сюда</span> или нажмите для выбора
        </p>
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        title=""
      />
    </div>
  );
}