import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F2]">
      <Header />
      <main className="flex-grow flex items-center justify-center py-20 px-4 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <span className="text-5xl font-black text-[#F5BE19]">404</span>
          <h1 className="text-2xl font-black text-[#14263D]">Page Not Found</h1>
          <p className="text-sm text-[#4B5E76]">
            The route or page you are looking for does not exist or has been moved.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-block px-5 py-2.5 rounded-xl bg-[#F5BE19] hover:bg-[#DFAC13] text-[#14263D] font-bold text-xs uppercase tracking-wider transition-all"
            >
              Return Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
