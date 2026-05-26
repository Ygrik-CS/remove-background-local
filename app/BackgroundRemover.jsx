'use client';

import { useState } from 'react';

export default function BackgroundRemover() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [outputFormat, setOutputFormat] = useState('webp');
  const [resultFormat, setResultFormat] = useState('webp');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile || isProcessing) return;

    setIsProcessing(true);
    setError(null);
    setResultImage(null);

    // Единственный try...catch на весь запрос
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('format', outputFormat);

      const response = await fetch('/api/remove-background', {
        method: 'POST',
        body: formData,
      });

      // Если ответ не JSON, встроенный парсер бросит ошибку, 
      // и мы поймаем её во внешнем catch.
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
        <input 
          type="file" 
          accept="image/*"
          onChange={handleFileChange}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 w-full"
        />
        
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Формат результата:</label>
          <select 
            value={outputFormat} 
            onChange={(e) => setOutputFormat(e.target.value)}
            className="p-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="webp">WebP (С прозрачностью, легкий)</option>
            <option value="png">PNG (С прозрачностью, высокое качество)</option>
            <option value="jpeg">JPEG (С белым фоном)</option>
          </select>
        </div>
        
        <button 
          onClick={handleUpload}
          disabled={!selectedFile || isProcessing}
          suppressHydrationWarning
          className="w-full mt-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing ? 'Удаляем фон...' : 'Загрузить и обработать'}
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