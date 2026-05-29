'use client';

import { useState } from 'react';
import UploadZone from './components/UploadZone';

export default function BackgroundRemover() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [outputFormat, setOutputFormat] = useState('webp');
  const [resultFormat, setResultFormat] = useState('webp');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setResultImage(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile || isProcessing) return;

    setIsProcessing(true);
    setError(null);
    setResultImage(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('format', outputFormat);

      const response = await fetch('/api/remove-background', {
        method: 'POST',
        body: formData,
      });


      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.error || `Server error: ${response.status}`);
      }

      setResultImage(data.resultUrl);
      setResultFormat(data.format || outputFormat);
      
    } catch (err) {
      console.error('Background removal failed:', err);
      setError(err.message || 'Не удалось удалить фон. Попробуйте другое изображение.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Обработка фото товаров</h1>
  
      <div style={styles.card}>
  
        <div style={styles.uploadBox}>
          <div style={styles.uploadTitle}>
            Загрузить фото товаров
          </div>
  
          <div style={styles.icon}>＋ 🖼️</div>
  
          <UploadZone onFileSelect={handleFileSelect} />
        </div>
  
        {selectedFile && (
          <p style={styles.fileName}>
            Выбран файл: {selectedFile.name}
          </p>
        )}
  
        <div style={styles.row}>
          <span style={styles.label}>
            Формат результата:
          </span>
  
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            style={styles.select}
          >
            <option value="webp">
              🖼️ WebP (С прозрачностью, легкий)
            </option>
  
            <option value="png">
              PNG (С прозрачностью, высокое качество)
            </option>
  
            <option value="jpeg">
              JPEG (С белым фоном)
            </option>
          </select>
        </div>
  
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isProcessing}
          style={{
            ...styles.button,
            opacity: !selectedFile || isProcessing ? 0.6 : 1,
            cursor:
              !selectedFile || isProcessing
                ? 'not-allowed'
                : 'pointer',
          }}
        >
          {isProcessing
            ? 'Удаляем фон...'
            : 'Удалить фон'}
        </button>
  
        {error && (
          <p style={styles.error}>
            {error}
          </p>
        )}
  
        {resultImage && (
          <div style={styles.result}>
            <h3>Готовый результат</h3>
  
            <img
              src={resultImage}
              alt="Обработанный товар"
              style={styles.resultImage}
            />
  
            <a
              href={resultImage}
              download={`processed-product.${resultFormat}`}
              style={styles.download}
            >
              Скачать результат
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
const styles = {
  page: {
    minHeight: '100vh',
    background: '#ffffff',
    padding: '24px 42px',
    fontFamily: 'Inter, Arial, sans-serif',
    overflow: 'hidden',
  },
  title: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#111827',
    marginBottom: '18px',
  },
  card: {
    background: '#ffffff',
    borderRadius: '18px',
    padding: '14px',
    boxShadow: '0 4px 18px rgba(0,0,0,0.08)',
    maxWidth: '980px',
    margin: '0',
  },
  uploadBox: {
    display: 'block',
    border: '2px dashed #d6d9e0',
    borderRadius: '14px',
    padding: '18px',
    textAlign: 'center',
    background: '#f7f8fb',
    cursor: 'pointer',
  },
  uploadTitle: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#111827',
    marginBottom: '10px',
  },
  icon: {
    fontSize: '28px',
    color: '#9ca3af',
    marginBottom: '10px',
  },
  fileName: {
    marginTop: '10px',
    color: '#555',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '18px',
  },
  label: {
    fontSize: '16px',
    fontWeight: '600',
  },
  select: {
    width: '390px',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '2px solid #4b5563',
    fontSize: '15px',
    background: '#fff',
  },
  button: {
    marginTop: '16px',
    background: '#27a35f',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '700',
  },
  error: {
    color: 'red',
    marginTop: '15px',
  },
  result: {
    marginTop: '25px',
  },
  resultImage: {
    maxWidth: '330px',
    borderRadius: '12px',
    border: '1px solid #ddd',
    background: '#f3f4f6',
  },
  download: {
    display: 'inline-block',
    marginTop: '15px',
    background: '#2563eb',
    color: '#fff',
    padding: '10px 18px',
    borderRadius: '8px',
    textDecoration: 'none',
  },
};