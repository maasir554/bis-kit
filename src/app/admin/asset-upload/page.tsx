"use client"

import { useState } from 'react';

export default function AdminImageUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    try {
      setUploading(true);
      setError(null);

      // Create FormData
      const formData = new FormData();
      console.log(file);
      formData.append('file', file);
      console.log(formData);
      // Upload to your API endpoint
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      // Clear the form
      setFile(null);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className='min-h-screen w-full flex items-center justify-center bg-gray-900'>

        <div className="max-w-lg mx-auto py-10 px-6 bg-themeblue/10 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-4">Upload Image</h2>
        
        <form onSubmit={handleUpload}>
            <div className="mb-4">
            <label className="block text-gray-400 mb-4">
                Select Image
            </label>

            <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full px-6 py-3 border-themeblue border-2 rounded-full"
            />
            </div>

            <button
            type="submit"
            disabled={!file || uploading}
            className={`w-full p-2 mb-4 rounded-full text-black font-semibold ${
                !file || uploading
                ? 'cursor-not-allowed bg-gray-400'
                : ' bg-white active:scale-95 cursor-pointer'
            }`}
            >
            {uploading ? 'Uploading...' : 'Upload file'}
            </button>

            {error && (
            <div className="mb-4 p-2 bg-red-500 text-white text-center">
                {error}
            </div>
            )}
        </form>
        </div>
    </main>
  );
}
