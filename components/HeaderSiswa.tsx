'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { useRouter } from 'next/navigation';

export default function HeaderSiswa() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
    // Redirect ke login siswa
    router.push('/loginsiswa');
  };

  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-sm">
      <div className="px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/dashboardsiswa" className="text-xl lg:text-2xl font-pacifico text-white">
              AbsensiKu Siswa
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-6">
              <Link href="/dashboardsiswa" className="text-white/90 hover:text-white font-medium transition-colors">
                Dashboard
              </Link>
              <Link href="/kamera" className="text-white/90 hover:text-white font-medium transition-colors">
                Absen Kamera
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 text-white hover:text-white/90 transition-colors"
                >
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <i className="ri-user-line text-white text-sm"></i>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm">{getUserDisplayName()}</div>
                    <div className="text-xs text-white/70">Siswa</div>
                  </div>
                  <i className="ri-arrow-down-s-line"></i>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                    <div className="px-4 py-3 border-b">
                      <div className="font-medium text-gray-900">{getUserDisplayName()}</div>
                      <div className="text-sm text-gray-500">{user?.email}</div>
                      <div className="text-xs text-indigo-600 font-medium">Status: Siswa</div>
                    </div>
                    <Link
                      href="/dashboardsiswa"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <i className="ri-dashboard-line mr-2"></i>
                      Dashboard Saya
                    </Link>
                    <Link
                      href="/kamera"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <i className="ri-camera-line mr-2"></i>
                      Absen Kamera
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <i className="ri-logout-box-line mr-2"></i>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden w-8 h-8 flex items-center justify-center text-white"
            >
              <i className={`ri-${isMenuOpen ? 'close' : 'menu'}-line text-xl`}></i>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pt-4 border-t border-white/20">
            <div className="flex flex-col space-y-3">
              <Link 
                href="/dashboardsiswa" 
                className="text-white/90 hover:text-white font-medium py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="ri-dashboard-line mr-2"></i>
                Dashboard
              </Link>
              <Link 
                href="/kamera" 
                className="text-white/90 hover:text-white font-medium py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="ri-camera-line mr-2"></i>
                Absen Kamera
              </Link>
              
              {/* Mobile User Info */}
              <div className="flex items-center justify-between py-3 mt-4 pt-4 border-t border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <i className="ri-user-line text-white"></i>
                  </div>
                  <div>
                    <div className="text-white font-medium">{getUserDisplayName()}</div>
                    <div className="text-xs text-white/70">{user?.email}</div>
                    <div className="text-xs text-white/80 font-medium">Status: Siswa</div>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-white/90 hover:text-white p-1 transition-colors"
                  title="Logout"
                >
                  <i className="ri-logout-box-line text-lg"></i>
                </button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
