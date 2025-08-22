import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
