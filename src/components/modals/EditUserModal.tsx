import React, { useState, useEffect } from 'react';
import { X, UserCheck, Shield, Check, AlertCircle } from 'lucide-react';
import { User, UserRole, UserStatus, NavTabId } from '../../types';
import { UNIT_KERJA_LIST } from '../../services/dataService';

interface EditUserModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onUpdateUser: (updatedUser: User) => void;
}

const ALL_NAV_MENUS: { id: NavTabId; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'realisasi-pmk', label: 'Realisasi PMK' },
  { id: 'sertifikasi', label: 'Sertifikasi' },
  { id: 'analisis-kompetensi', label: 'Analisis Kompetensi' },
  { id: 'bank-kasus', label: 'Bank Kasus Publik' },
  { id: 'pembelajaran-internal', label: 'Pembelajaran Internal' },
  { id: 'survei-level-3', label: 'Survei Level 3' },
  { id: 'data-pmk', label: 'Data PMK' },
  { id: 'performa-pegawai', label: 'Performa Pegawai' },
  { id: 'manajemen-user', label: 'Manajemen Pengguna' },
  { id: 'log-aktivitas', label: 'Log Aktivitas' },
  { id: 'tentang-lentera', label: 'Tentang LENTERA' },
];

export const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  user,
  onClose,
  onUpdateUser,
}) => {
  const [fullName, setFullName] = useState('');
  const [nip, setNip] = useState('');
  const [email, setEmail] = useState('');
  const [unitKerja, setUnitKerja] = useState(UNIT_KERJA_LIST[1]);
  const [role, setRole] = useState<UserRole>('Pegawai');
  const [status, setStatus] = useState<UserStatus>('Aktif');
  const [allowedMenus, setAllowedMenus] = useState<NavTabId[]>([]);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setNip(user.nip || '');
      setEmail(user.email || '');
      setUnitKerja(user.unitKerja || UNIT_KERJA_LIST[1]);
      setRole(user.role);
      setStatus(user.status);
      setAllowedMenus(user.allowedMenus || ALL_NAV_MENUS.map(m => m.id));
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const toggleMenu = (menuId: NavTabId) => {
    if (allowedMenus.includes(menuId)) {
      setAllowedMenus(allowedMenus.filter(m => m !== menuId));
    } else {
      setAllowedMenus([...allowedMenus, menuId]);
    }
  };

  const handleSelectAllMenus = () => {
    setAllowedMenus(ALL_NAV_MENUS.map(m => m.id));
  };

  const handleClearAllMenus = () => {
    setAllowedMenus(['dashboard', 'tentang-lentera']);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: User = {
      ...user,
      fullName: fullName.trim(),
      nip: nip.trim(),
      email: email.trim(),
      unitKerja,
      role,
      status,
      allowedMenus,
    };
    onUpdateUser(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Edit Data Pengguna & Hak Akses
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pengguna: <strong className="text-slate-800 dark:text-slate-200">{user.username}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                NIP Pegawai
              </label>
              <input
                type="text"
                required
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Username
              </label>
              <input
                type="text"
                disabled
                value={user.username}
                className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Resmi
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Unit Kerja
              </label>
              <select
                value={unitKerja}
                onChange={(e) => setUnitKerja(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
              >
                {UNIT_KERJA_LIST.filter(u => u !== 'Semua').map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Role Akses
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
              >
                <option value="Pegawai">Pegawai</option>
                <option value="Reviewer">Reviewer</option>
                <option value="Admin">Admin</option>
                <option value="Super Admin">Super Admin</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Status Akun
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="editStatus"
                  checked={status === 'Aktif'}
                  onChange={() => setStatus('Aktif')}
                  className="text-emerald-600"
                />
                <span className="text-emerald-600 font-semibold">Aktif</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="editStatus"
                  checked={status === 'Nonaktif'}
                  onChange={() => setStatus('Nonaktif')}
                  className="text-rose-600"
                />
                <span className="text-slate-500 font-medium">Nonaktif</span>
              </label>
            </div>
          </div>

          {/* Role-Based Menu Access Configuration */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Shield className="w-3.5 h-3.5 text-sky-600" />
                <span>Hak Akses Menu Navigasi (RBAC)</span>
              </div>
              <div className="flex gap-2 text-[10px]">
                <button
                  type="button"
                  onClick={handleSelectAllMenus}
                  className="text-sky-600 hover:underline font-bold"
                >
                  Pilih Semua
                </button>
                <span>&bull;</span>
                <button
                  type="button"
                  onClick={handleClearAllMenus}
                  className="text-slate-500 hover:underline"
                >
                  Reset Minimal
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              {ALL_NAV_MENUS.map((menu) => {
                const isChecked = allowedMenus.includes(menu.id);
                return (
                  <label
                    key={menu.id}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-[11px] cursor-pointer transition ${
                      isChecked
                        ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-300 dark:border-sky-800 text-sky-800 dark:text-sky-300 font-semibold'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleMenu(menu.id)}
                      className="rounded text-sky-600 focus:ring-sky-500"
                    />
                    <span className="truncate">{menu.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-sm transition cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
