'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Button from '@/components/Button';

// Update types
interface ProgressEvent {
  loaded: number;
  total?: number;
}

interface BookForm {
  bookId: string;
  title: string;
  description: string;
  price: string;
  formats: ('pdf' | 'epub')[];
  coverImage: File | null;
  ebooks: {
    pdf?: File;
    epub?: File;
  };
}

interface AxiosError {
  response?: {
    status: number;
    data: any;
  };
  isAxiosError: boolean;
}

// Update error handling
const isAxiosError = (error: unknown): error is AxiosError => {
  return error !== null && 
         typeof error === 'object' && 
         'isAxiosError' in error;
};

export default function AddBook() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState<BookForm>({
    bookId: '',
    title: '',
    description: '',
    price: '',
    formats: ['pdf'],
    coverImage: null,
    ebooks: {}
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress(0);

    try {
      if (!formData.title || !formData.description || !formData.price) {
        throw new Error('Please fill in all required fields');
      }

      if (!formData.coverImage) {
        throw new Error('Cover image is required');
      }

      const data = new FormData();
      const bookId = `${Date.now()}-${formData.formats[0]}`;
      data.append('id', bookId);
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('formats', formData.formats.join(','));

      if (formData.coverImage) {
        data.append('coverImage', formData.coverImage);
      }

      formData.formats.forEach(format => {
        const file = formData.ebooks[format];
        if (file) {
          data.append('ebooks', file);
        }
      });


      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 600000, // 10 minutes timeout
        onUploadProgress: (progressEvent: { loaded: number; total?: number }) => {
          const percentCompleted = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(percentCompleted);
        }
       };
       
       const response = await axios.post(
        'http://localhost:5000/api/books/add',
        data,
        config
       );


      console.log('Book added:', response.data);
      router.push('/admin/books');

    } catch (error) {
      console.error('Error:', error);

      if (isAxiosError(error)) {
        const message = error.response?.data?.message || 'Error uploading book';
        if (error.response?.status === 413) {
          alert('File size too large - Maximum size is 100MB');
        } else if (error.response?.status === 400) {
          alert(message);
        } else {
          alert('Server error - Please try again later');
        }
      } else if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  // Rest of the component remains the same
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Add New Book</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                required
                rows={4}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
          </div>

          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Formats *
            </label>
            <div className="flex gap-4">
              {['pdf', 'epub'].map((format) => (
                <label key={format} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.formats.includes(format as 'pdf' | 'epub')}
                    onChange={(e) => {
                      const newFormats = e.target.checked
                        ? [...formData.formats, format as 'pdf' | 'epub']
                        : formData.formats.filter(f => f !== format);
                      setFormData({ ...formData, formats: newFormats });
                    }}
                    className="mr-2"
                  />
                  {format}
                </label>
              ))}
            </div>
          </div>

          {/* File Uploads */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Image *
              </label>
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => setFormData({
                  ...formData,
                  coverImage: e.target.files?.[0] || null
                })}
                className="w-full"
              />
            </div>

            {formData.formats.map((format) => (
              <div key={format}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {format} File *
                </label>
                <input
                  type="file"
                  accept={format === 'pdf' ? '.pdf' : '.epub'}
                  required
                  onChange={(e) => setFormData({
                    ...formData,
                    ebooks: {
                      ...formData.ebooks,
                      [format]: e.target.files?.[0]
                    }
                  })}
                  className="w-full"
                />
              </div>
            ))}
          </div>

          {/* Upload Progress */}
          {uploadProgress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              className="bg-gray-500 hover:bg-gray-600"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className={`bg-blue-600 hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? `Uploading ${uploadProgress}%` : 'Add Book'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}