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
      style={{
        position: 'relative',
        width: '100%',
        height: '110px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '14px',
        background: isDragging ? '#dbeafe' : '#eef1f5',
        border: isDragging ? '2px dashed #3b82f6' : '2px dashed #c9ced8',
        cursor: 'pointer',
      }}
    >
      <p style={{ fontSize: '16px', color: '#4b5563', margin: 0 }}>
        <span style={{ fontWeight: '700', color: '#2563eb' }}>
          Перетащите картинку сюда
        </span>{' '}
        или нажмите для выбора
      </p>
  
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          cursor: 'pointer',
        }}
        title=""
      />
    </div>
  );
}

