// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Button from '@/components/Button';

// export default function AddBook() {
//   const router = useRouter();
//   const [bookData, setBookData] = useState({
//     title: '',
//     description: '',
//     price: '',
//     file: null as File | null
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     // This would upload the book file and create the book entry
//     console.log('Creating book:', bookData);
//     router.push('/admin/books');
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
//       <h1 className="text-2xl font-bold mb-6">Add New Book</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block mb-1">Title</label>
//           <input
//             type="text"
//             value={bookData.title}
//             onChange={(e) => setBookData({...bookData, title: e.target.value})}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <div>
//           <label className="block mb-1">Description</label>
//           <textarea
//             value={bookData.description}
//             onChange={(e) => setBookData({...bookData, description: e.target.value})}
//             className="w-full p-2 border rounded"
//             rows={4}
//             required
//           />
//         </div>
//         <div>
//           <label className="block mb-1">Price</label>
//           <input
//             type="number"
//             value={bookData.price}
//             onChange={(e) => setBookData({...bookData, price: e.target.value})}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <div>
//           <label className="block mb-1">Book File</label>
//           <input
//             type="file"
//             onChange={(e) => setBookData({...bookData, file: e.target.files?.[0] || null})}
//             className="w-full p-2 border rounded"
//             accept=".pdf,.epub"
//             required
//           />
//         </div>
//         <div className="flex justify-end space-x-4">
//           <Button onClick={() => router.back()} className="bg-gray-500">
//             Cancel
//           </Button>
//           <Button type="submit">
//             Add Book
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// }
// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import Button from '@/components/Button';

// interface BookForm {
//   title: string;
//   description: string;
//   price: string;
//   formats: ('pdf' | 'epub')[];
//   coverImage: File | null;
//   bookFiles: {
//     pdf?: File;
//     epub?: File;
//   };
// }

// export default function AddBook() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState<BookForm>({
//     title: '',
//     description: '',
//     price: '',
//     formats: ['pdf'],
//     coverImage: null,
//     bookFiles: {}
//   });
// const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const data = new FormData();
      
//       // Basic info
//       data.append('title', formData.title);
//       data.append('description', formData.description);
//       data.append('price', formData.price);
//       data.append('formats', formData.formats.join(','));

//       // Cover image
//       if (formData.coverImage) {
//         data.append('coverImage', formData.coverImage);
//       }

//       // Book files with format-specific fields
//       if (formData.bookFiles.pdf) {
//         data.append('pdfFile', formData.bookFiles.pdf);
//       }
      
//       if (formData.bookFiles.epub) {
//         data.append('epubFile', formData.bookFiles.epub);
//       }

//       // Validate required files
//       const missingFiles = formData.formats.filter(format => !formData.bookFiles[format]);
//       if (missingFiles.length > 0) {
//         throw new Error(`Missing files for formats: ${missingFiles.join(', ')}`);
//       }

//       const response = await axios.post('http://localhost:5000/books/add', data, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         onUploadProgress: (progressEvent) => {
//           const percentCompleted = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0;
//           console.log('Upload Progress:', percentCompleted);
//         },
//       });

//       console.log('Book added successfully:', response.data);
//       router.push('/admin/books');
      
//     } catch (error) {
//       console.error('Error adding book:', error);
//       // Handle specific error cases
//       if (axios.isAxiosError(error)) {
//         if (error.response?.status === 413) {
//           alert('File size too large');
//         } else {
//           alert(error.response?.data?.message || 'Error uploading book');
//         }
//       }
//     } finally {
//       setLoading(false);
//     }
// };

//   return (
//     <div className="max-w-3xl mx-auto">
//       <div className="bg-white rounded-lg shadow p-6">
//         <h1 className="text-2xl font-bold mb-6">Add New Book</h1>
        
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Basic Info */}
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Title
//               </label>
//               <input
//                 type="text"
//                 required
//                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                 value={formData.title}
//                 onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Description
//               </label>
//               <textarea
//                 required
//                 rows={4}
//                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                 value={formData.description}
//                 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Price ($)
//               </label>
//               <input
//                 type="number"
//                 step="0.01"
//                 required
//                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                 value={formData.price}
//                 onChange={(e) => setFormData({ ...formData, price: e.target.value })}
//               />
//             </div>
//           </div>

//           {/* Format Selection */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Available Formats
//             </label>
//             <div className="flex gap-4">
//               {['pdf', 'epub'].map((format) => (
//                 <label key={format} className="flex items-center">
//                   <input
//                     type="checkbox"
//                     checked={formData.formats.includes(format as 'pdf' | 'epub')}
//                     onChange={(e) => {
//                       const newFormats = e.target.checked
//                         ? [...formData.formats, format as 'pdf' | 'epub']
//                         : formData.formats.filter(f => f !== format);
//                       setFormData({ ...formData, formats: newFormats });
//                     }}
//                     className="mr-2"
//                   />
//                   {format}
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* File Uploads */}
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Cover Image
//               </label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => setFormData({
//                   ...formData,
//                   coverImage: e.target.files?.[0] || null
//                 })}
//                 className="w-full"
//               />
//             </div>

//             {formData.formats.map((format) => (
//               <div key={format}>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   {format} File
//                 </label>
//                 <input
//                   type="file"
//                   accept={format === 'pdf' ? '.pdf' : '.epub'}
//                   onChange={(e) => setFormData({
//                     ...formData,
//                     bookFiles: {
//                       ...formData.bookFiles,
//                       [format]: e.target.files?.[0]
//                     }
//                   })}
//                   className="w-full"
//                 />
//               </div>
//             ))}
//           </div>

//           {/* Submit Buttons */}
//           <div className="flex justify-end space-x-4 pt-4">
//             <Button
//               type="button"
//               className="bg-gray-500 hover:bg-gray-600"
//               onClick={() => router.back()}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               disabled={loading}
//               className={loading ? 'opacity-50 cursor-not-allowed' : ''}
//             >
//               {loading ? 'Adding Book...' : 'Add Book'}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Button from '@/components/Button';

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

export default function AddBook() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState<BookForm>({
    bookId:'',
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
      // Form validation
      if (!formData.title || !formData.description || !formData.price) {
        throw new Error('Please fill in all required fields');
      }

      if (!formData.coverImage) {
        throw new Error('Cover image is required');
      }

      // Create FormData
      const data = new FormData();
      
      // Add basic info
      const bookId = `${Date.now()}-${formData.formats[0]}`;
      data.append('id', bookId); // Add the ID to form data
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('formats', formData.formats.join(','));

      // Add cover image
      if (formData.coverImage) {
        data.append('coverImage', formData.coverImage);
      }

      // Add book files using correct field name
      formData.formats.forEach(format => {
        const file = formData.ebooks[format];
        if (file) {
          // Use the exact field name expected by multer
          data.append('ebooks', file);
        }
      });

      // Make API call to backend
      const response = await axios.post('http://localhost:5000/books/add', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 120000, 
        onUploadProgress: (progressEvent) => {
          const percentCompleted = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(percentCompleted);
        },
      });
      console.log("🚀 ~ handleSubmit ~ response:", response)

      console.log('Book added successfully:', response.data);
      router.push('/admin/books');

    } catch (error) {
      console.error('Error adding book:', error);
      
      if (axios.isAxiosError(error)) {
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