<<<<<<< HEAD
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
    <div className="flex flex-col items-center gap-6 p-8 font-sans">
      <h2 className="text-xl font-semibold">Обработка фото товаров</h2>
      
      <div className="flex flex-col gap-4 w-full max-w-md bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        
        <UploadZone onFileSelect={handleFileSelect} />
        
        {selectedFile && (
          <div className="text-sm text-gray-700 bg-gray-100 px-4 py-2 rounded-md">
            Выбран файл: <span className="font-semibold">{selectedFile.name}</span>
          </div>
        )}
        
        <button 
          onClick={handleUpload}
          disabled={!selectedFile || isProcessing}
          className="w-full mt-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing ? 'Удаляем фон...' : 'удалить фон'}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md w-full max-w-md text-center">{error}</p>
      )}

      {resultImage && (
        <div className="mt-4 flex flex-col items-center gap-4 w-full max-w-md bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-800">Готовый результат</h3>
          
          <div className="bg-gray-100 rounded-lg p-2 w-full flex justify-center">
            <div className="bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] rounded-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={resultImage} 
                alt="Обработанный товар" 
                className="max-w-full h-auto max-h-64 object-contain shadow-sm"
              />
            </div>
          </div>

          <a 
            href={resultImage} 
            download={`processed-product.${resultFormat}`}
            className="w-full text-center px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors shadow-sm"
          >
            Скачать результат ({resultFormat.toUpperCase()})
          </a>
        </div>
      )}
    </div>
  );
}
=======
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
        <div style={styles.header}>
          <h2 style={styles.uploadTitle}>Загрузить фото товаров</h2>
          <p style={styles.subtitle}>
            Добавьте или перетащите изображения товаров для обработки
          </p>
        </div>
  
        <UploadZone onFileSelect={handleFileSelect} />
  
        {selectedFile && (
          <p style={styles.fileName}>
            Выбран файл: {selectedFile.name}
          </p>
        )}
  
        <div style={styles.row}>
          <span style={styles.label}>Формат результата</span>
  
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            style={styles.select}
          >
            <option value="webp">WebP (С прозрачностью, легкий)</option>
            <option value="png">PNG (С прозрачностью, высокое качество)</option>
            <option value="jpeg">JPEG (С белым фоном)</option>
          </select>
        </div>
  
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isProcessing}
          style={{
            ...styles.button,
            opacity: !selectedFile || isProcessing ? 0.6 : 1,
            cursor: !selectedFile || isProcessing ? 'not-allowed' : 'pointer',
          }}
        >
          ⤴ {isProcessing ? 'Удаляем фон...' : 'Удалить фон'}
        </button>
  
        {error && <p style={styles.error}>{error}</p>}
  
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
    borderRadius: '22px',
    padding: '28px',
    boxShadow: '0 4px 18px rgba(0,0,0,0.08)',
    maxWidth: '900px',
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
    color: '#10172a',
    margin: 0,
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
    marginTop: '20px',
    background: '#16a56a',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '13px 24px',
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


subtitle: {
  marginTop: '10px',
  fontSize: '14px',
  color: '#6b7280',
},

header: {
  textAlign: 'center',
  marginBottom: '22px',
},
};
>>>>>>> 2ca3e21 (2frontend)
