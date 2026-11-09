/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { User, PMKRecord, PushNotification, NavTabId } from './types';
import { dataRepo, TOP_10_SELF_LEARNING, TOP_10_LEARNING_POINTS } from './services/dataService';
import { appCache } from './services/cache';
import { syncEngine } from './services/sync';
import { exportAndDownloadMonthlyReport } from './services/pdfExport';

// Components
import { LoginPage } from './components/LoginPage';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';

// Views
import { DashboardView } from './components/views/DashboardView';
import { RealisasiPmkView } from './components/views/RealisasiPmkView';
import { SertifikasiView } from './components/views/SertifikasiView';
import { AnalisisKompetensiView } from './components/views/AnalisisKompetensiView';
import { BankKasusPublikView } from './components/views/BankKasusPublikView';
import { PembelajaranInternalView } from './components/views/PembelajaranInternalView';
import { SurveiLevel3View } from './components/views/SurveiLevel3View';
import { DataPmkView } from './components/views/DataPmkView';
import { PerformaPegawaiView } from './components/views/PerformaPegawaiView';
import { UserManagementView } from './components/views/UserManagementView';
import { AuditLogView } from './components/views/AuditLogView';
import { TentangLenteraView } from './components/views/TentangLenteraView';

// Modals
import { UploadExcelModal } from './components/modals/UploadExcelModal';
import { NotificationCenter } from './components/modals/NotificationCenter';
import { PrintReportModal } from './components/modals/PrintReportModal';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('lentera_current_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('lentera_theme_pref');
      if (saved !== null) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState<NavTabId>('dashboard');
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  // Data States
  const [records, setRecords] = useState<PMKRecord[]>(() => dataRepo.getPMKData());
  const [users, setUsers] = useState<User[]>(() => dataRepo.getUsers());
  const [notifications, setNotifications] = useState<PushNotification[]>(() => dataRepo.getNotifications());
  const [auditLogs, setAuditLogs] = useState(() => dataRepo.getAuditLogs());

  // Performance Telemetry
  const [cacheSpeedMs, setCacheSpeedMs] = useState(1.4);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(Date.now());

  // Modals
  const [isUploadExcelOpen, setIsUploadExcelOpen] = useState(false);
  const [isNotifCenterOpen, setIsNotifCenterOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<{ title: string; message: string } | null>(null);

  // Sync dark mode class on documentElement
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('lentera_theme_pref', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('lentera_theme_pref', 'light');
    }
  }, [isDarkMode]);

  // Subscribe to Realtime Cross-Device / Cross-Tab Sync
  useEffect(() => {
    const unsubscribe = syncEngine.subscribe((msg) => {
      setLastSyncTime(msg.timestamp);

      if (msg.type === 'USER_UPDATED') {
        setUsers(dataRepo.getUsers());
        setAuditLogs(dataRepo.getAuditLogs());
      } else if (msg.type === 'PMK_DATA_SYNCED') {
        setRecords(dataRepo.getPMKData());
        setAuditLogs(dataRepo.getAuditLogs());
      } else if (msg.type === 'PUSH_NOTIFICATION_BROADCAST') {
        setNotifications(dataRepo.getNotifications());
        if (msg.payload) {
          setActiveToast({
            title: msg.payload.title || 'Notifikasi Baru',
            message: msg.payload.message || 'Informasi penting diterima.',
          });
          setTimeout(() => setActiveToast(null), 4000);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Data Refresh with Cache measurement
  const handleRefreshData = useCallback(async () => {
    setIsSyncing(true);
    const start = performance.now();

    // Check cache hit & invalidate
    appCache.invalidate('pmk');
    const fresh = dataRepo.getPMKData();
    setRecords([...fresh]);
    setAuditLogs(dataRepo.getAuditLogs());
    setUsers(dataRepo.getUsers());

    const duration = Math.round((performance.now() - start) * 10) / 10;
    setCacheSpeedMs(duration > 0 ? duration : 0.8);
    setLastSyncTime(Date.now());
    setIsSyncing(false);

    dataRepo.logActivity({
      userId: currentUser?.id || 'admin',
      userName: currentUser?.fullName || 'Admin',
      action: 'CACHE_REFRESH',
      module: 'Performance Engine',
      details: `Data berhasil di-refresh & diindeks ulang dalam ${duration}ms`,
      status: 'Success'
    });
  }, [currentUser]);

  // Logout Handler
  const handleLogout = () => {
    if (currentUser) {
      dataRepo.logActivity({
        userId: currentUser.id,
        userName: currentUser.username,
        action: 'LOGOUT',
        module: 'Autentikasi',
        details: 'User keluar dari sesi aktif LENTERA',
        status: 'Success'
      });
    }
    localStorage.removeItem('lentera_current_session');
    setCurrentUser(null);
  };

  // Export Monthly PDF Handler
  const handleExportMonthlyPdf = () => {
    exportAndDownloadMonthlyReport({
      records,
      topSelfLearning: TOP_10_SELF_LEARNING,
      topLearningPoints: TOP_10_LEARNING_POINTS,
      periodLabel: 'Periode Akhir Bulan: November 2026',
      generatedBy: currentUser ? `${currentUser.fullName} (${currentUser.role})` : 'Administrator LENTERA',
    });
  };

  // If user is not authenticated, render Login Page
  if (!currentUser) {
    return (
      <LoginPage 
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setUsers(dataRepo.getUsers());
          setRecords(dataRepo.getPMKData());
          setAuditLogs(dataRepo.getAuditLogs());
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Toast Notification Banner */}
      {activeToast && (
        <div className="fixed top-5 right-5 z-50 max-w-sm bg-slate-900/95 dark:bg-sky-950/95 text-white p-4 rounded-2xl shadow-2xl border border-sky-500/40 backdrop-blur-md animate-in slide-in-from-top-5">
          <div className="font-bold text-xs text-sky-400">{activeToast.title}</div>
          <div className="text-xs text-slate-200 mt-1">{activeToast.message}</div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar matching screenshot */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          isOpenMobile={isOpenMobile}
          onCloseMobile={() => setIsOpenMobile(false)}
          currentUser={currentUser}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          
          {/* Top Header matching screenshot */}
          <Header
            currentUser={currentUser}
            onLogout={handleLogout}
            onUploadExcelClick={() => setIsUploadExcelOpen(true)}
            onRefreshDataClick={handleRefreshData}
            onPrintDashboardClick={() => setIsPrintModalOpen(true)}
            onExportPdfClick={handleExportMonthlyPdf}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            notifications={notifications}
            onOpenNotifications={() => setIsNotifCenterOpen(true)}
            lastSyncTime={lastSyncTime}
            isSyncing={isSyncing}
            cacheHitSpeed={cacheSpeedMs}
          />

          {/* Mobile hamburger menu toggle */}
          <div className="lg:hidden px-4 py-2 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => setIsOpenMobile(true)}
              className="px-3 py-1.5 rounded-lg bg-sky-600 text-white font-bold cursor-pointer"
            >
              Menu Navigasi
            </button>
            <span className="font-bold text-slate-700 dark:text-slate-300 capitalize">
              {activeTab.replace('-', ' ')}
            </span>
          </div>

          {/* Dynamic Views Viewport */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardView 
                records={records}
                cacheSpeedMs={cacheSpeedMs}
                onNavigateTab={(tab) => setActiveTab(tab as NavTabId)}
              />
            )}

            {activeTab === 'realisasi-pmk' && (
              <RealisasiPmkView records={records} />
            )}

            {activeTab === 'sertifikasi' && (
              <SertifikasiView records={records} currentUser={currentUser} />
            )}

            {activeTab === 'analisis-kompetensi' && (
              <AnalisisKompetensiView />
            )}

            {activeTab === 'bank-kasus' && (
              <BankKasusPublikView currentUser={currentUser} />
            )}

            {activeTab === 'pembelajaran-internal' && (
              <PembelajaranInternalView currentUser={currentUser} />
            )}

            {activeTab === 'survei-level-3' && (
              <SurveiLevel3View currentUser={currentUser} />
            )}

            {activeTab === 'data-pmk' && (
              <DataPmkView currentUser={currentUser} />
            )}

            {activeTab === 'performa-pegawai' && (
              <PerformaPegawaiView />
            )}

            {activeTab === 'manajemen-user' && (
              <UserManagementView 
                users={users}
                currentUser={currentUser}
                onRefreshUsers={() => setUsers(dataRepo.getUsers())}
              />
            )}

            {activeTab === 'log-aktivitas' && (
              <AuditLogView logs={auditLogs} />
            )}

            {activeTab === 'tentang-lentera' && (
              <TentangLenteraView />
            )}
          </main>

        </div>

      </div>

      {/* Modals */}
      <UploadExcelModal
        isOpen={isUploadExcelOpen}
        onClose={() => setIsUploadExcelOpen(false)}
        onUploadSuccess={() => {
          setRecords(dataRepo.getPMKData());
          setAuditLogs(dataRepo.getAuditLogs());
          setActiveToast({
            title: 'Upload Excel Berhasil',
            message: 'Database PMK LENTERA telah diperbarui dan terindeks.',
          });
        }}
      />

      <NotificationCenter
        isOpen={isNotifCenterOpen}
        onClose={() => setIsNotifCenterOpen(false)}
        notifications={notifications}
        onRefreshNotifications={() => setNotifications(dataRepo.getNotifications())}
        onNavigateTab={(tab) => setActiveTab(tab as NavTabId)}
      />

      <PrintReportModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        records={records}
      />

    </div>
  );
}
