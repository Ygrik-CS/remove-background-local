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
<<<<<<< HEAD
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

=======
      style={{
        position: 'relative',
        width: '100%',
        height: '260px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '16px',
        background: isDragging ? '#ecfdf5' : '#fafafa',
        border: isDragging ? '2px dashed #16a56a' : '2px dashed #d1d5db',
        cursor: 'pointer',
      }}
    >
      <div style={{
        width: '78px',
        height: '78px',
        borderRadius: '50%',
        border: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '38px',
        color: '#16a56a',
        marginBottom: '18px',
        background: '#ffffff',
      }}>
      <svg
  width="40"
  height="40"
  viewBox="0 0 24 24"
  fill="none"
  stroke="#22c55e"
  strokeWidth="1.8"
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <rect x="3" y="3" width="18" height="18" rx="2" />
  <circle cx="9" cy="9" r="1.5" />
  <path d="M21 15l-5-5L5 21" />
</svg>
      </div>
  
      <p style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>
        <span style={{ color: '#16a56a' }}>Перетащите</span> изображение сюда
      </p>
  
      <p style={{ fontSize: '15px', color: '#6b7280', marginTop: '8px' }}>
        или нажмите для выбора файла
      </p>
  
      <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '18px' }}>
        Поддерживаются форматы: JPG, PNG, WebP. Максимальный размер — 10 МБ
      </p>
  
>>>>>>> 2ca3e21 (2frontend)
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