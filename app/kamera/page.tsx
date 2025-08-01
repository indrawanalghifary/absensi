'use client';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../components/AuthProvider';
import { useRouter } from 'next/navigation';
import HeaderSiswa from '../../components/HeaderSiswa';
import ProtectedRouteSiswa from '../../components/ProtectedRouteSiswa';
import { processCameraAttendance, checkTodayAttendance } from '../../lib/attendanceService';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export default function KameraPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [location, setLocation] = useState<LocationData | null>(null);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [alreadyCheckedIn, setAlreadyCheckedIn] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const { user } = useAuth();
  const router = useRouter();

  // Get current location
  const getCurrentLocation = () => {
    return new Promise<LocationData>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation tidak didukung oleh browser ini'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          reject(new Error('Gagal mendapatkan lokasi: ' + error.message));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    });
  };

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user' // Front camera
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      setError('Gagal mengakses kamera. Pastikan izin kamera telah diberikan.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsCameraActive(false);
    }
  };

  // Take photo
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            setPhotoBlob(blob);
            setPhotoTaken(true);
            stopCamera();
          }
        }, 'image/jpeg', 0.8);
      }
    }
  };

  // Reset photo
  const resetPhoto = () => {
    setPhotoTaken(false);
    setPhotoBlob(null);
    startCamera();
  };

  // Submit attendance
  const submitAttendance = async () => {
    if (!photoBlob || !location || !user) {
      setError('Foto, lokasi, dan user diperlukan untuk absensi');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const attendanceRecord = await processCameraAttendance(
        photoBlob,
        location,
        user.id,
        user.email || ''
      );
      
      setSuccess(`Absensi berhasil disimpan! Status: ${attendanceRecord.status}`);
      
      setTimeout(() => {
        router.push('/dashboardsiswa');
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan absensi. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user already checked in today
  const checkExistingAttendance = async () => {
    if (!user) return;
    
    try {
      const existingAttendance = await checkTodayAttendance(user.id);
      if (existingAttendance) {
        setAlreadyCheckedIn(true);
        setError('Anda sudah melakukan absensi hari ini');
      }
    } catch (err: any) {
      console.error('Error checking existing attendance:', err);
    }
  };

  // Initialize location and check existing attendance on component mount
  useEffect(() => {
    getCurrentLocation()
      .then(setLocation)
      .catch((err) => setError(err.message));

    checkExistingAttendance();

    return () => {
      stopCamera();
    };
  }, [user]);

  return (
    <ProtectedRouteSiswa>
      <div className="min-h-screen bg-gray-50">
        <HeaderSiswa />
        
        <main className="p-4 lg:p-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Absensi dengan Kamera
              </h1>

              {/* Location Status */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Status Lokasi</h3>
                {location ? (
                  <div className="text-sm text-blue-700">
                    <p>✅ Lokasi berhasil didapatkan</p>
                    <p>Koordinat: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</p>
                    <p>Akurasi: ±{location.accuracy.toFixed(0)} meter</p>
                  </div>
                ) : (
                  <p className="text-yellow-700">📍 Sedang mendapatkan lokasi...</p>
                )}
              </div>

              {/* Camera Section */}
              <div className="mb-6">
                {alreadyCheckedIn ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="ri-check-line text-2xl text-green-600"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Sudah Absen Hari Ini</h3>
                    <p className="text-gray-500 mb-4">Anda sudah melakukan absensi untuk hari ini</p>
                    <button
                      onClick={() => router.push('/dashboardsiswa')}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
                    >
                      Kembali ke Dashboard
                    </button>
                  </div>
                ) : (
                  <>
                    {!isCameraActive && !photoTaken && (
                  <div className="text-center">
                    <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center">
                        <i className="ri-camera-line text-4xl text-gray-400 mb-2"></i>
                        <p className="text-gray-500">Kamera belum aktif</p>
                      </div>
                    </div>
                    <button
                      onClick={startCamera}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                      <i className="ri-camera-line mr-2"></i>
                      Aktifkan Kamera
                    </button>
                  </div>
                )}

                {isCameraActive && !photoTaken && (
                  <div className="text-center">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full max-w-md mx-auto rounded-lg mb-4"
                    />
                    <div className="space-x-4">
                      <button
                        onClick={takePhoto}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                      >
                        <i className="ri-camera-fill mr-2"></i>
                        Ambil Foto
                      </button>
                      <button
                        onClick={stopCamera}
                        className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                      >
                        <i className="ri-close-line mr-2"></i>
                        Batal
                      </button>
                    </div>
                  </div>
                )}

                {photoTaken && (
                  <div className="text-center">
                    <canvas
                      ref={canvasRef}
                      className="w-full max-w-md mx-auto rounded-lg mb-4"
                    />
                    <div className="space-x-4">
                      <button
                        onClick={resetPhoto}
                        className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700"
                      >
                        <i className="ri-refresh-line mr-2"></i>
                        Foto Ulang
                      </button>
                    </div>
                  </div>
                )}
                  </>
                )}
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700">❌ {error}</p>
                </div>
              )}

              {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700">✅ {success}</p>
                </div>
              )}

              {/* Submit Button */}
              {photoTaken && location && (
                <div className="text-center">
                  <button
                    onClick={submitAttendance}
                    disabled={isLoading}
                    className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <i className="ri-loader-line animate-spin mr-2"></i>
                        Menyimpan Absensi...
                      </>
                    ) : (
                      <>
                        <i className="ri-check-line mr-2"></i>
                        Kirim Absensi
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Petunjuk:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Foto akan diambil menggunakan kamera depan</li>
                  <li>• Lokasi akan otomatis terdeteksi</li>
                  <li>• Pastikan pencahayaan cukup untuk foto yang jelas</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRouteSiswa>
  );
}
