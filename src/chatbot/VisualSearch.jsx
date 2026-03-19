import React, { useState } from 'react';
import { X, Upload, Camera } from 'lucide-react';

const VisualSearch = ({ onImageUpload, onClose }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageUpload(e.target.result, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Visual Search</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            dragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            Drag and drop an image here, or click to select
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-purple-700 inline-flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Select Image
          </label>
        </div>
      </div>
    </div>
  );
};

export default VisualSearch;