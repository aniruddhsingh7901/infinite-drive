'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Button from './Button';
import { useCart } from '@/lib/cart/CartContext';
import axios from 'axios';

interface Book {
 id: string;
 title: string;
 description: string;
 price: number;
 formats: string[];
 coverImagePaths: string[];
 filePaths: { [key: string]: string };
}

export default function BookDisplay() {
 const [isHovered, setIsHovered] = useState(false);
 const [selectedFormat, setSelectedFormat] = useState<'PDF' | 'EPUB'>('PDF');
 const [showAddedMessage, setShowAddedMessage] = useState(false);
 const [currentImage, setCurrentImage] = useState(0);
 const [book, setBook] = useState<Book | null>(null);
 const [error, setError] = useState<string | null>(null);
 const { addItem } = useCart();
 const [latestBooks, setLatestBooks] = useState<Book[]>([]);

 useEffect(() => {
   const fetchBooks = async () => {
     try {
       const response = await axios.get<Book[]>('http://localhost:5000/api/books');
       setLatestBooks(response.data);
       if (response.data.length > 0) {
         setBook(response.data[0]);
       }
     } catch (error) {
       setError(error instanceof Error ? error.message : 'Failed to fetch books');
       console.error('Error:', error);
     }
   };

   fetchBooks();
 }, []);

 if (error) return <div>Error: {error}</div>;
 if (!book) return <div>Loading...</div>;

 const handleAddToCart = () => {
   addItem({
     id: `${book.id}-${selectedFormat}`,
     title: `${book.title} (${selectedFormat})`,
     price: book.price,
     format: selectedFormat
   });
   setShowAddedMessage(true);
   setTimeout(() => setShowAddedMessage(false), 2000);
 };

 const handlePrevImage = () => {
   setCurrentImage((prev) => (prev - 1 + book.coverImagePaths.length) % book.coverImagePaths.length);
 };

 const handleNextImage = () => {
   setCurrentImage((prev) => (prev + 1) % book.coverImagePaths.length);
 };

 return (
   <div className="bg-white p-8">
     <div className="flex flex-col md:flex-row gap-16">
       <div className="w-full md:w-1/2">
         <div 
           className="relative min-h-[500px] flex justify-center items-center"
           onMouseEnter={() => setIsHovered(true)}
           onMouseLeave={() => setIsHovered(false)}
         >
           <div className={`absolute transition-all duration-500 transform z-10
             ${isHovered ? 'translate-x-[-40px] translate-y-[20px] rotate-[-5deg]' : 'translate-x-[-20px] translate-y-0'}`}>
             <Image
               src={book.coverImagePaths[currentImage]}
               alt="Book Cover"
               width={350}
               height={500}
               className="object-contain drop-shadow-xl cursor-pointer"
               priority
               style={{ filter: 'brightness(1.05)' }}
             />
           </div>

           <div className={`absolute transition-all duration-500 transform z-0
             ${isHovered ? 'translate-x-[40px] translate-y-[-20px] rotate-[5deg]' : 'translate-x-[20px] translate-y-0'}`}>
             <Image
               src={book.coverImagePaths[currentImage]}
               alt="Book Image"
               width={350}
               height={500}
               className="object-contain drop-shadow-2xl cursor-pointer"
               priority
             />
           </div>

           <button
             onClick={handlePrevImage}
             className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
           >&lt;</button>
           <button
             onClick={handleNextImage}
             className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
           >&gt;</button>
         </div>
       </div>

       <div className="w-full md:w-1/2 space-y-8">
         <div>
           <h1 className="text-4xl font-bold text-gray-900 mb-4">{book.title}</h1>
           <p className="text-xl text-gray-600 leading-relaxed">{book.description}</p>
         </div>

         <div>
           <h3 className="text-lg font-semibold mb-3">Select Format:</h3>
           <div className="flex gap-4">
             {book.formats.map((format) => (
               <button
                 key={format}
                 onClick={() => setSelectedFormat(format as 'PDF' | 'EPUB')}
                 className={`px-6 py-3 rounded-lg border-2 transition-all duration-200 
                   ${selectedFormat === format 
                     ? 'border-blue-500 bg-blue-50 text-blue-700'
                     : 'border-gray-200 hover:border-blue-200'}`}
               >{format}</button>
             ))}
           </div>
         </div>

         <div className="flex items-center gap-4">
           {/* <span className="text-5xl font-bold text-gray-900">${book.price.toFixed(2)}</span> */
           <span className="text-5xl font-bold text-gray-900">${typeof book.price === 'number' ? book.price.toFixed(2) : book.price}</span>}
         </div>

         <div className="bg-gray-50 rounded-xl p-6">
           <h3 className="text-xl font-semibold mb-4">What You'll Get:</h3>
           <ul className="space-y-4">
             {['PDF & EPUB formats', 'Instant delivery', 'Lifetime access', 
               'Free updates', 'Money-back guarantee'].map((feature, index) => (
               <li key={index} className="flex items-center text-gray-700 hover:text-gray-900 transition-colors">
                 <svg className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                 </svg>
                 <span className="text-lg">{feature}</span>
               </li>
             ))}
           </ul>
         </div>

         <div className="relative pt-4 space-y-4">
           <Button 
             onClick={handleAddToCart}
             className={`w-full bg-blue-600 hover:bg-blue-700 transform hover:scale-[1.02] 
               transition-all duration-200 px-8 py-4 text-lg font-semibold rounded-xl 
               shadow-lg hover:shadow-xl ${showAddedMessage ? 'bg-green-600 hover:bg-green-700' : ''}`}
           >
             {showAddedMessage ? 'Added to Cart!' : `Add to Cart (${selectedFormat})`}
           </Button>

           <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
             <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
               <path d="M12 15v2m0 0v2m0-2h2m-2 0H9.5m11-7c0 3.314-2.686 6-6 6s-6-2.686-6-6 2.686-6 6-6 6 2.686 6 6z" />
             </svg>
             <span>Secure payment with cryptocurrency</span>
           </div>
         </div>
       </div>
     </div>
   </div>
 );
}