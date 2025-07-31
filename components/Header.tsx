
'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl lg:text-2xl font-pacifico text-blue-600">
              AbsensiKu
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-6">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                Dashboard
              </Link>
              <Link href="/absensi" className="text-gray-700 hover:text-blue-600 font-medium">
                Absensi Harian
              </Link>
              <Link href="/rekap" className="text-gray-700 hover:text-blue-600 font-medium">
                Rekap Bulanan
              </Link>
              <Link href="/siswa" className="text-gray-700 hover:text-blue-600 font-medium">
                Data Siswa
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-4">
              <div className="w-6 h-6 flex items-center justify-center">
                <i className="ri-notification-line text-gray-600"></i>
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <i className="ri-user-line text-white text-sm"></i>
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden w-8 h-8 flex items-center justify-center text-gray-600 cursor-pointer"
            >
              <i className={`ri-${isMenuOpen ? 'close' : 'menu'}-line text-xl`}></i>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pt-4 border-t">
            <div className="flex flex-col space-y-3">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-blue-600 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                href="/absensi" 
                className="text-gray-700 hover:text-blue-600 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Absensi Harian
              </Link>
              <Link 
                href="/rekap" 
                className="text-gray-700 hover:text-blue-600 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Rekap Bulanan
              </Link>
              <Link 
                href="/siswa" 
                className="text-gray-700 hover:text-blue-600 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Data Siswa
              </Link>
              <div className="flex items-center justify-between py-2 mt-4 pt-4 border-t">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <i className="ri-user-line text-white text-sm"></i>
                  </div>
                  <span className="text-gray-700 font-medium">Admin</span>
                </div>
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-notification-line text-gray-600"></i>
                </div>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
