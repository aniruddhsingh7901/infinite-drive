import BookDisplay from "@/components/BookDisplay";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BOOK_IMAGES } from "@/utils/constants";

export default function Home() {
  const book = {
    title: "Infinite Drive",
    description: "Transform your life with powerful mindset techniques that will help you achieve your goals and unlock your full potential. Learn proven strategies for success and personal growth.",
    price: 49.99,
    originalPrice: 99.99,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      <main className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Ebook
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the secrets to unlocking your infinite potential
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg">
            <BookDisplay book={book} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}