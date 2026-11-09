import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  RefreshCw, 
  LogOut, 
  Printer, 
  FileDown, 
  Moon, 
  Sun, 
  Bell, 
  ChevronDown
} from 'lucide-react';
import { User, PushNotification } from '../types';

interface HeaderProps {
  currentUser: User;
  onLogout: () => void;
  onUploadExcelClick: () => void;
  onRefreshDataClick: () => void;
  onPrintDashboardClick: () => void;
  onExportPdfClick: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  notifications: PushNotification[];
  onOpenNotifications: () => void;
  lastSyncTime: number;
  isSyncing: boolean;
  cacheHitSpeed: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogout,
  onUploadExcelClick,
  onRefreshDataClick,
  onPrintDashboardClick,
  onExportPdfClick,
  isDarkMode,
  onToggleDarkMode,
  notifications,
  onOpenNotifications,
  lastSyncTime,
  isSyncing,
  cacheHitSpeed,
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [syncTimeText, setSyncTimeText] = useState('Sinkron');

  useEffect(() => {
    const updateText = () => {
      const diffSec = Math.floor((Date.now() - lastSyncTime) / 1000);
      if (diffSec < 10) setSyncTimeText('Real-time');
      else if (diffSec < 60) setSyncTimeText(`${diffSec}d lalu`);
      else setSyncTimeText(`${Math.floor(diffSec / 60)}m lalu`);
    };
    updateText();
    const interval = setInterval(updateText, 10000);
    return () => clearInterval(interval);
  }, [lastSyncTime]);

  return (
    <header className="bg-white/95 dark:bg-[#071325]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 py-2.5 sticky top-0 z-30 transition-colors shadow-xs">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left: Clean Brand Identity (Never truncated) */}
        <div className="shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
              LENTERA DUAL-LOOP LEARNING
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700 hidden sm:inline-block" />
            <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 hidden sm:inline-block">
              Kantor Perwakilan Bank Indonesia Provinsi Jawa Timur
            </span>
          </div>
          <h1 className="text-base sm:text-lg font-black text-[#0c2340] dark:text-white tracking-tight leading-tight mt-0.5 whitespace-nowrap">
            LENTERA LOOP DASHBOARD
          </h1>
        </div>

        {/* Right: Minimalist, Balanced Toolbar */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Status Capsule */}
          <div className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 text-[11px] font-medium text-slate-600 dark:text-slate-300">
            <span className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
            <span className="font-semibold text-slate-700 dark:text-slate-200">{syncTimeText}</span>
            <span className="text-slate-300 dark:text-slate-600">&bull;</span>
            <span className="text-slate-500">08 Nov 2026</span>
          </div>

          {/* Action Group */}
          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
            <button
              onClick={onUploadExcelClick}
              type="button"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs transition cursor-pointer"
              title="Unggah berkas Excel data PMK"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden lg:inline">Upload Excel</span>
            </button>

            <button
              onClick={onRefreshDataClick}
              type="button"
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs transition cursor-pointer disabled:opacity-50"
              title={`Refresh data & bersihkan cache (${cacheHitSpeed}ms)`}
            >
              <RefreshCw className={`w-3.5 h-3.5 text-sky-600 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden lg:inline">Refresh</span>
            </button>

            <button
              onClick={onPrintDashboardClick}
              type="button"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs transition cursor-pointer"
              title="Cetak tampilan dashboard"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden lg:inline">Print</span>
            </button>
          </div>

          {/* Monthly PDF Export Button */}
          <button
            onClick={onExportPdfClick}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition cursor-pointer shrink-0"
            title="Download Laporan PDF Resmi Bulanan"
          >
            <FileDown className="w-3.5 h-3.5 text-emerald-100" />
            <span className="hidden sm:inline">Ekspor PDF</span>
          </button>

          {/* Divider */}
          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-0.5 hidden sm:block" />

          {/* Push Notification Bell */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative p-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer shadow-xs"
            aria-label="Pusat Notifikasi"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="p-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer shadow-xs"
            aria-label="Toggle tema gelap/terang"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* User Profile & Account Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="inline-flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-700/80 transition cursor-pointer"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-700 text-white flex items-center justify-center text-[10px] font-black uppercase">
                {currentUser.username.substring(0, 2).toUpperCase()}
              </div>
              <div className="text-left leading-none hidden md:block">
                <span className="font-bold text-xs text-slate-900 dark:text-white block">{currentUser.username}</span>
                <span className="text-[10px] text-slate-400">{currentUser.role}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#0c182c] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 text-xs">
                  <div className="font-bold text-slate-900 dark:text-white">{currentUser.fullName}</div>
                  <div className="text-[10px] text-slate-400 truncate">{currentUser.email}</div>
                  <div className="mt-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    {currentUser.unitKerja}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    onLogout();
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 cursor-pointer transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar dari Akun</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
