# Sistem Login Terpisah - Admin dan Siswa

Sistem autentikasi sekarang telah dipisahkan menjadi dua jalur berbeda untuk Admin dan Siswa dengan interface yang disesuaikan dengan kebutuhan masing-masing.

## 🔐 **Halaman Login**

### 1. **Login Admin** (`/auth/login`)
- **Redirect setelah login**: `/` (Dashboard Admin)
- **Design**: Minimal, profesional dengan background abu-abu
- **Target user**: Administrator sistem
- **Akses ke**: Semua fitur admin (dashboard, absensi harian, rekap, data siswa)

### 2. **Login Siswa** (`/loginsiswa`)
- **Redirect setelah login**: `/dashboardsiswa` (Dashboard Siswa)
- **Design**: Modern dengan gradient indigo-purple dan ikon graduation cap
- **Target user**: Siswa
- **Akses ke**: Fitur siswa (dashboard personal, absen kamera)

## 🚀 **Fitur Login Siswa**

### Design Features:
- **Background**: Gradient dari indigo-50 ke purple-50
- **Icon**: Graduation cap dalam lingkaran gradient
- **Form**: Card putih dengan shadow yang menarik
- **Input**: Dengan icon dan border radius yang lebih besar
- **Button**: Gradient indigo-purple dengan efek hover
- **Info Card**: Penjelasan tentang portal siswa

### Navigation Links:
- Link ke "Login sebagai Admin" 
- Link ke "Daftar Akun Baru"
- Informasi tentang portal siswa

### Auto-redirect:
- Jika user sudah login, otomatis redirect ke `/dashboardsiswa`

## 🔒 **Proteksi Rute**

### Proteksi Admin (`ProtectedRoute.tsx`):
- **Digunakan di**: `/`, `/absensi`, `/rekap`, `/siswa`
- **Redirect ke**: `/auth/login` (jika tidak login)
- **Loading screen**: Spinner standar dengan background abu-abu

### Proteksi Siswa (`ProtectedRouteSiswa.tsx`):
- **Digunakan di**: `/dashboardsiswa`, `/kamera`
- **Redirect ke**: `/loginsiswa` (jika tidak login)
- **Loading screen**: Graduation cap dengan gradient background dan teks "Loading Portal Siswa"

## 🔄 **Logout Behavior**

### Admin Logout:
```tsx
// Di Header.tsx
const handleSignOut = async () => {
  await signOut();
  setShowUserMenu(false);
  // Otomatis redirect ke /auth/login oleh AuthProvider
};
```

### Siswa Logout:
```tsx
// Di HeaderSiswa.tsx
const handleSignOut = async () => {
  await signOut();
  setShowUserMenu(false);
  router.push('/loginsiswa'); // Explicit redirect ke login siswa
};
```

## 🎨 **Visual Differences**

### Login Admin:
```
- Title: "Login Admin"
- Background: bg-gray-50
- Button: Standard indigo
- Icon: Lock atau user icon
- Style: Clean, minimal
```

### Login Siswa:
```
- Title: "Login Siswa"
- Background: Gradient indigo-purple
- Button: Gradient indigo-purple
- Icon: Graduation cap
- Style: Modern, friendly
- Extra: Info card tentang portal siswa
```

## 📱 **User Experience Flow**

### Admin Flow:
1. Akses `/auth/login` atau redirect otomatis
2. Login dengan credentials admin
3. Redirect ke `/` (Dashboard Admin)
4. Akses fitur admin melalui HeaderAdmin
5. Logout → redirect ke `/auth/login`

### Siswa Flow:
1. Akses `/loginsiswa` atau redirect otomatis
2. Login dengan credentials siswa  
3. Redirect ke `/dashboardsiswa`
4. Akses fitur siswa melalui HeaderSiswa
5. Logout → redirect ke `/loginsiswa`

## 🔧 **Implementation Details**

### File Structure:
```
app/
├── auth/
│   └── login/page.tsx          # Login Admin
├── loginsiswa/page.tsx         # Login Siswa
├── dashboardsiswa/page.tsx     # Dashboard Siswa
└── kamera/page.tsx             # Absensi Kamera

components/
├── Header.tsx                  # Header Admin
├── HeaderSiswa.tsx            # Header Siswa
├── ProtectedRoute.tsx         # Proteksi Admin
└── ProtectedRouteSiswa.tsx    # Proteksi Siswa
```

### Authentication Logic:
- **Same Auth Service**: Menggunakan AuthProvider yang sama
- **Different Redirects**: Berbeda tujuan redirect setelah login/logout
- **Role-based UI**: Interface disesuaikan dengan peran user
- **Route Protection**: Proteksi berbeda untuk admin vs siswa

## ⚡ **Benefits**

### 1. **Better User Experience**:
- Interface yang sesuai dengan context (admin vs siswa)
- Navigation yang lebih fokus dan relevan
- Visual design yang sesuai target user

### 2. **Better Security**:
- Separation of concerns
- Explicit route protection
- Clear access boundaries

### 3. **Easier Maintenance**:
- Code yang lebih terorganisir
- Easier to add role-specific features
- Clear component responsibility

## 🚀 **Future Enhancements**

Sistem ini siap untuk pengembangan lebih lanjut seperti:
- Role-based access control (RBAC)
- Multiple user types (siswa, guru, admin)
- Social login integration
- Two-factor authentication
- Single Sign-On (SSO)

Sistem login terpisah ini memberikan foundation yang solid untuk aplikasi absensi yang lebih scalable dan user-friendly! 🎯
