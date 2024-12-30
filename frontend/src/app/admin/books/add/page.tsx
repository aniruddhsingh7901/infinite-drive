'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';

export default function AddBook() {
  const router = useRouter();
  const [bookData, setBookData] = useState({
    title: '',
    description: '',
    price: '',
    file: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // This would upload the book file and create the book entry
    console.log('Creating book:', bookData);
    router.push('/admin/books');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Add New Book</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            value={bookData.title}
            onChange={(e) => setBookData({...bookData, title: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            value={bookData.description}
            onChange={(e) => setBookData({...bookData, description: e.target.value})}
            className="w-full p-2 border rounded"
            rows={4}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Price</label>
          <input
            type="number"
            value={bookData.price}
            onChange={(e) => setBookData({...bookData, price: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Book File</label>
          <input
            type="file"
            onChange={(e) => setBookData({...bookData, file: e.target.files?.[0] || null})}
            className="w-full p-2 border rounded"
            accept=".pdf,.epub"
            required
          />
        </div>
        <div className="flex justify-end space-x-4">
          <Button onClick={() => router.back()} className="bg-gray-500">
            Cancel
          </Button>
          <Button type="submit">
            Add Book
          </Button>
        </div>
      </form>
    </div>
  );
}