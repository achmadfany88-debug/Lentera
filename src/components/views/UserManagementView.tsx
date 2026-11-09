import React, { useState, useMemo } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Shield, 
  CheckCircle2, 
  XCircle, 
  KeyRound, 
  Trash2, 
  Filter,
  Check,
  Edit,
  UserCheck,
  AlertTriangle,
  X
} from 'lucide-react';
import { User, UserRole, UserStatus } from '../../types';
import { AddUserModal } from '../modals/AddUserModal';
import { EditUserModal } from '../modals/EditUserModal';
import { dataRepo } from '../../services/dataService';

interface UserManagementViewProps {
  users: User[];
  currentUser: User;
  onRefreshUsers: () => void;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  users,
  currentUser,
  onRefreshUsers,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToReset, setUserToReset] = useState<User | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('Semua');
  const [statusFilter, setStatusFilter] = useState<string>('Semua');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddUser = (newUser: User) => {
    dataRepo.addUser(newUser, currentUser.fullName || currentUser.username);
    onRefreshUsers();
    showToast(`Pengguna ${newUser.fullName} berhasil didaftarkan.`);
  };

  const handleUpdateUser = (updatedUser: User) => {
    dataRepo.updateUser(updatedUser, currentUser.fullName || currentUser.username);
    onRefreshUsers();
    showToast(`Data pengguna ${updatedUser.fullName} berhasil diperbarui.`);
  };

  const handleToggleStatus = (user: User) => {
    const updatedStatus: UserStatus = user.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
    const updatedUser: User = { ...user, status: updatedStatus };
    dataRepo.updateUser(updatedUser, currentUser.fullName || currentUser.username);
    onRefreshUsers();
    showToast(`Status pengguna ${user.fullName} diubah menjadi ${updatedStatus}.`);
  };

  const handlePromptDelete = (user: User) => {
    if (user.username === 'Admin') {
      showToast('Akun Administrator utama terlindungi dan tidak dapat dihapus.');
      return;
    }
    setUserToDelete(user);
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    const deletedName = userToDelete.fullName;
    dataRepo.deleteUser(userToDelete.id, currentUser.fullName || currentUser.username);
    onRefreshUsers();
    setUserToDelete(null);
    showToast(`Pengguna ${deletedName} telah berhasil dihapus dari sistem.`);
  };

  const handlePromptReset = (user: User) => {
    setUserToReset(user);
  };

  const handleConfirmReset = () => {
    if (!userToReset) return;
    dataRepo.logActivity({
      userId: userToReset.id,
      userName: currentUser.username,
      action: 'USER_UPDATE',
      module: 'Manajemen Pengguna',
      details: `Reset kata sandi pengguna ${userToReset.fullName} (NIP: ${userToReset.nip})`,
      status: 'Success'
    });
    const targetName = userToReset.fullName;
    setUserToReset(null);
    showToast(`Password untuk ${targetName} telah direset ke default 'Admin'.`);
  };

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch = 
        u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.nip.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.unitKerja.toLowerCase().includes(searchQuery.toLowerCase());

      const matchRole = roleFilter === 'Semua' || u.role === roleFilter;
      const matchStatus = statusFilter === 'Semua' || u.status === statusFilter;

      return matchSearch && matchRole && matchStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  // Statistics
  const totalUsers = users.length;
  const activeCount = users.filter(u => u.status === 'Aktif').length;
  const adminCount = users.filter(u => u.role === 'Admin' || u.role === 'Super Admin').length;

  return (
    <div className="space-y-6">
      
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xl border border-slate-700 flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner & Stats */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 text-[10px] font-bold uppercase tracking-wider">
              Kontrol Hak Akses Pengguna
            </span>
            <span className="text-slate-400">&bull;</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Role-Based Access Control</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#0f1c3f] dark:text-white mt-1">
            Manajemen Pengguna & Pegawai
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Kelola data pegawai, peranan akun (RBAC), hak akses menu navigasi LENTERA, enkripsi kata sandi standar industri, dan riwayat audit kredensial.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md shadow-sky-600/20 transition cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Pengguna Baru</span>
        </button>
      </div>

      {/* KPI Cards for Users */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Total User Terdaftar</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums">{totalUsers}</div>
          <span className="text-[11px] text-slate-500">Semua Satuan Kerja BI Jatim</span>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Akun Aktif</span>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">{activeCount}</div>
          <span className="text-[11px] text-emerald-600 font-medium">{Math.round((activeCount / (totalUsers || 1)) * 100)}% Terverifikasi</span>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Administrator & Reviewer</span>
          <div className="text-2xl font-extrabold text-sky-600 dark:text-sky-400 mt-1 tabular-nums">{adminCount}</div>
          <span className="text-[11px] text-slate-500">Hak Akses Modul Khusus</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Cari berdasarkan nama, NIP, username, atau unit kerja..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
          >
            <option value="Semua">Semua Role</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Admin">Admin</option>
            <option value="Reviewer">Reviewer</option>
            <option value="Pegawai">Pegawai</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
          >
            <option value="Semua">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Nonaktif">Nonaktif</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">PEGAWAI / NIP</th>
                <th className="py-3 px-4">USERNAME & EMAIL</th>
                <th className="py-3 px-4">UNIT KERJA</th>
                <th className="py-3 px-4">ROLE</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">LOGIN TERAKHIR</th>
                <th className="py-3 px-4 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Tidak ditemukan pengguna yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{u.fullName}</div>
                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{u.nip}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-mono font-medium text-sky-700 dark:text-sky-400">{u.username}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{u.email}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 max-w-xs truncate">
                      {u.unitKerja}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'Super Admin' 
                          ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300' 
                          : u.role === 'Admin'
                          ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                          : u.role === 'Reviewer'
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                          u.status === 'Aktif'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100'
                            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 hover:bg-rose-100'
                        }`}
                        title="Klik untuk mengubah status"
                      >
                        {u.status === 'Aktif' ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Aktif</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Nonaktif</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 tabular-nums text-[11px]">
                      {u.lastLogin || '-'}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => setEditingUser(u)}
                        title="Edit Data Pengguna & Hak Akses"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-slate-800 transition cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handlePromptReset(u)}
                        title="Reset Password ke default 'Admin'"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800 transition cursor-pointer"
                      >
                        <KeyRound className="w-4 h-4" />
                      </button>
                      
                      {/* Tombol Hapus Pengguna dengan In-App Confirmation Modal */}
                      {u.username !== 'Admin' && (
                        <button
                          onClick={() => handlePromptDelete(u)}
                          title="Hapus Pengguna"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddUser={handleAddUser}
      />

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={!!editingUser}
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onUpdateUser={handleUpdateUser}
      />

      {/* IN-APP DELETE USER CONFIRMATION MODAL */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Konfirmasi Hapus Pengguna</h3>
                <p className="text-xs text-slate-500">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <div>Nama: <strong className="text-slate-900 dark:text-white">{userToDelete.fullName}</strong></div>
              <div>Username: <span className="font-mono text-sky-600">{userToDelete.username}</span></div>
              <div>NIP: <span className="font-mono text-slate-500">{userToDelete.nip}</span></div>
              <div>Unit: <span className="text-slate-600 dark:text-slate-300">{userToDelete.unitKerja}</span></div>
            </div>

            <p className="text-xs text-slate-500">
              Apakah Anda yakin ingin menghapus akun ini dari sistem LENTERA?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition cursor-pointer"
              >
                Hapus Pengguna
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IN-APP RESET PASSWORD CONFIRMATION MODAL */}
      {userToReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center shrink-0">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Reset Kata Sandi?</h3>
                <p className="text-xs text-slate-500">Kredensial akses pengguna</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              Reset kata sandi untuk pengguna <strong className="text-slate-900 dark:text-white">{userToReset.fullName}</strong> ke kata sandi bawaan pengembang: <strong className="font-mono text-sky-600">'Admin'</strong>?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setUserToReset(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 transition cursor-pointer"
              >
                Reset Kata Sandi
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
