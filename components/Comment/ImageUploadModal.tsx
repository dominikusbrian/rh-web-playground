import { useState, useRef } from 'react';
import { X } from 'lucide-react';
import { useAssetUpload } from '@/hooks/useAssetUpload';

interface ImageUploadModalProps {
  onClose: () => void;
  onImageEmbed: (imageUrl: string) => void;
}

export const ImageUploadModal = ({ onClose, onImageEmbed }: ImageUploadModalProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [{ loading: isUploading, error: uploadError }, uploadAsset] = useAssetUpload();
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setValidationError(null);
    } else {
      setValidationError('Please select an image file');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setValidationError(null);
    } else {
      setValidationError('Please select an image file');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setValidationError(null);

    try {
      const result = await uploadAsset(selectedFile, 'comment');
      onImageEmbed(result.absoluteUrl);
      onClose();
    } catch (error) {
      // Error handling is done by the hook
    }
  };

  // Display either validation error or upload error
  const error = validationError || uploadError;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Upload Image</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {selectedFile ? (
            <div className="space-y-4">
              <div className="text-sm text-gray-600">Selected file: {selectedFile.name}</div>
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="max-h-48 mx-auto"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-gray-600">Drag and drop an image here, or click to select</div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-primary-600 hover:text-primary-800"
              >
                Browse files
              </button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>

        {error && <div className="mt-4 text-sm text-red-600 bg-red-50 rounded p-2">{error}</div>}

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900">
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="px-4 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};
