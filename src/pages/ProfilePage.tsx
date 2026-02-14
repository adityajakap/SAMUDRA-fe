import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MainLayout } from '../components/layout/MainLayout';
import { User, Mail, IdCard, Calendar, LogOut } from 'lucide-react';
import { useState } from 'react';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  if (isLoading || !user) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat profil...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profil Saya</h1>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-blue-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-gray-900">{user.nama}</h2>
              <p className="text-gray-500">Nelayan Terdaftar</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start">
              <IdCard className="w-5 h-5 text-gray-400 mt-1 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Nomor Identitas Nelayan</p>
                <p className="text-gray-900 font-medium">{user.noIdentitasNelayan}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Mail className="w-5 h-5 text-gray-400 mt-1 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-900 font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Calendar className="w-5 h-5 text-gray-400 mt-1 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Tanggal Terdaftar</p>
                <p className="text-gray-900 font-medium">{formatDate(user.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 focus:ring-4 focus:ring-red-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          {isLoggingOut ? 'Memproses...' : 'Keluar'}
        </button>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;