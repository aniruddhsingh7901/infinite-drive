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

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';

interface BookForm {
  title: string;
  description: string;
  price: string;
  formats: ('PDF' | 'EPUB')[];
  coverImage: File | null;
  bookFiles: {
    PDF?: File;
    EPUB?: File;
  };
}

export default function AddBook() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BookForm>({
    title: '',
    description: '',
    price: '',
    formats: ['PDF'],
    coverImage: null,
    bookFiles: {}
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // API call will go here
      console.log('Submitting:', formData);
      router.push('/admin/books');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Add New Book</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
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
                Description
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
                Price ($)
              </label>
              <input
                type="number"
                step="0.01"
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
              Available Formats
            </label>
            <div className="flex gap-4">
              {['PDF', 'EPUB'].map((format) => (
                <label key={format} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.formats.includes(format as 'PDF' | 'EPUB')}
                    onChange={(e) => {
                      const newFormats = e.target.checked
                        ? [...formData.formats, format as 'PDF' | 'EPUB']
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
                Cover Image
              </label>
              <input
                type="file"
                accept="image/*"
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
                  {format} File
                </label>
                <input
                  type="file"
                  accept={format === 'PDF' ? '.pdf' : '.epub'}
                  onChange={(e) => setFormData({
                    ...formData,
                    bookFiles: {
                      ...formData.bookFiles,
                      [format]: e.target.files?.[0]
                    }
                  })}
                  className="w-full"
                />
              </div>
            ))}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              className="bg-gray-500 hover:bg-gray-600"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className={loading ? 'opacity-50 cursor-not-allowed' : ''}
            >
              {loading ? 'Adding Book...' : 'Add Book'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}