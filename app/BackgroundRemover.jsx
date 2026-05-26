'use client';

import { useState } from 'react';

export default function BackgroundRemover() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile || isProcessing) return;

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch('/api/remove-background', {
        method: 'POST',
        body: formData,
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        const preview = responseText.trim().slice(0, 200);
        throw new Error(
          preview
            ? `Invalid JSON response: ${preview}`
            : `Invalid JSON response (status ${response.status})`
        );
      }

      if (!response.ok || !data?.success) {
        throw new Error(data?.error || `Server error: ${response.status}`);
      }

      setResultImage(data.resultUrl);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Не удалось удалить фон. Попробуйте другое изображение.';
      console.error('Background removal failed:', err);
      setError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 font-sans">
      <h2 className="text-xl font-semibold">Обработка фото товаров</h2>
      
      <div className="flex flex-col gap-4 w-full max-w-md">
        <input 
          type="file" 
          accept="image/*"
          onChange={handleFileChange}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        
        <button 
          onClick={handleUpload}
          disabled={!selectedFile || isProcessing}
          suppressHydrationWarning
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing ? 'Удаляем фон...' : 'Загрузить и обработать'}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {resultImage && (
        <div className="mt-8 flex flex-col items-center gap-4">
          <h3 className="text-lg font-medium">Готовый результат:</h3>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={resultImage} 
            alt="Обработанный товар" 
            className="max-w-full h-auto rounded-lg shadow-lg border border-gray-200"
          />
          <a 
            href={resultImage} 
            download="processed-product.webp"
            className="text-blue-600 hover:underline"
          >
            Скачать WebP
          </a>
        </div>
      )}
    </div>
  );
}
