'use client';

import Image from 'next/image';
import { useState } from 'react';
import Button from './Button';
import { useCart } from '@/lib/cart/CartContext';

type Book = {
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
}

export default function BookDisplay({ book }: { book: Book }) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'PDF' | 'EPUB'>('PDF');
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: `${Date.now()}-${selectedFormat}`, // Unique ID including format
      title: `${book.title} (${selectedFormat})`,
      price: book.price,
      format: selectedFormat
    });

    // Show feedback message
    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 2000);
  };

  return (
    <div className="bg-white p-8">
      <div className="flex flex-col md:flex-row gap-16">
        {/* Book Display Section */}
        <div className="w-full md:w-1/2">
          <div 
            className="relative min-h-[500px] flex justify-center items-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* White Book */}
            <div className={`
              absolute transition-all duration-500 transform
              ${isHovered ? 'translate-x-[-30px] rotate-[-5deg]' : 'translate-x-[-15px]'}
            `}>
              <Image
                src="/1000163335.jpg"
                alt="White Book"
                width={350}
                height={500}
                className="object-contain drop-shadow-xl"
                priority
                style={{
                  filter: 'brightness(1.05)'
                }}
              />
            </div>

            {/* Dark Book */}
            <div className={`
              absolute transition-all duration-500 transform
              ${isHovered ? 'translate-x-[30px] rotate-[5deg]' : 'translate-x-[15px]'}
            `}>
              <Image
                src="/1000163401.jpg"
                alt="Dark Book"
                width={350}
                height={500}
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full md:w-1/2 space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{book.title}</h1>
            <p className="text-xl text-gray-600 leading-relaxed">{book.description}</p>
          </div>

          {/* Format Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Select Format:</h3>
            <div className="flex gap-4">
              {['PDF', 'EPUB'].map((format) => (
                <button
                  key={format}
                  onClick={() => setSelectedFormat(format as 'PDF' | 'EPUB')}
                  className={`px-6 py-3 rounded-lg border-2 transition-all duration-200 ${
                    selectedFormat === format 
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-200'
                  }`}
                >
                  {format}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-center gap-4">
            <span className="text-5xl font-bold text-gray-900">${book.price.toFixed(2)}</span>
            {book.originalPrice && (
              <span className="text-xl text-gray-400 line-through self-start mt-2">
                ${book.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Features */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">What You'll Get:</h3>
            <ul className="space-y-4">
              {[
                'PDF & EPUB formats',
                'Instant delivery',
                'Lifetime access',
                'Free updates',
                'Money-back guarantee'
              ].map((feature, index) => (
                <li key={index} 
                    className="flex items-center text-gray-700 hover:text-gray-900 transition-colors">
                  <svg className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                  </svg>
                  <span className="text-lg">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="relative pt-4 space-y-4">
            <Button 
              className={`
                w-full bg-blue-600 hover:bg-blue-700 transform 
                hover:scale-[1.02] transition-all duration-200 
                px-8 py-4 text-lg font-semibold rounded-xl 
                shadow-lg hover:shadow-xl
                ${showAddedMessage ? 'bg-green-600 hover:bg-green-700' : ''}
              `}
              onClick={handleAddToCart}
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