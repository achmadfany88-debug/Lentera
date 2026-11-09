import React, { useState } from 'react';
import { X, Bell, CheckCheck, Send, Info, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { PushNotification } from '../../types';
import { dataRepo } from '../../services/dataService';
import { syncEngine } from '../../services/sync';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: PushNotification[];
  onRefreshNotifications: () => void;
  onNavigateTab?: (tabId: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onRefreshNotifications,
  onNavigateTab,
}) => {
  const [testTitle, setTestTitle] = useState('');
  const [testMessage, setTestMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<string>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );

  if (!isOpen) return null;

  const handleMarkAsRead = (id: string) => {
    dataRepo.markNotificationAsRead(id);
    onRefreshNotifications();
  };

  const handleMarkAllRead = () => {
    dataRepo.markAllNotificationsAsRead();
    onRefreshNotifications();
  };

  const handleRequestPushPermission = async () => {
    const res = await syncEngine.requestNotificationPermission();
    setPermissionStatus(res);
  };

  const handleTriggerPush = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testTitle.trim() || !testMessage.trim()) return;

    setIsSending(true);

    const newNotif = dataRepo.addNotification({
      title: testTitle.trim(),
      message: testMessage.trim(),
      type: 'urgent',
      linkTab: 'dashboard',
    });

    // Send native push if permitted
    syncEngine.sendPushNotification(testTitle.trim(), {
      body: testMessage.trim(),
      icon: '/favicon.ico',
    });

    // Broadcast cross-tab
    syncEngine.broadcast({
      type: 'PUSH_NOTIFICATION_BROADCAST',
      timestamp: Date.now(),
      payload: newNotif,
    });

    onRefreshNotifications();
    setTestTitle('');
    setTestMessage('');
    setIsSending(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Sistem Notifikasi Push Instan
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Peringatan real-time untuk pegawai dan satker
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Browser Permission Banner */}
        {permissionStatus !== 'granted' && (
          <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between text-xs shrink-0">
            <div className="text-amber-800 dark:text-amber-200">
              Aktifkan izin notifikasi browser untuk menerima pesan di desktop
            </div>
            <button
              onClick={handleRequestPushPermission}
              className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shrink-0 ml-2"
            >
              Izinkan
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-2.5 pr-1">
          <div className="flex items-center justify-between text-xs pb-1">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Daftar Pesan Masuk ({notifications.length})
            </span>
            {notifications.some(n => !n.read) && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Tandai Semua Dibaca</span>
              </button>
            )}
          </div>

          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                handleMarkAsRead(n.id);
                if (n.linkTab && onNavigateTab) {
                  onNavigateTab(n.linkTab);
                  onClose();
                }
              }}
              className={`p-3 rounded-xl border transition cursor-pointer ${
                !n.read 
                  ? 'bg-sky-50/70 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800' 
                  : 'bg-white dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {!n.read && <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />}
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                    {n.title}
                  </h4>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 pl-4">
                {n.message}
              </p>
            </div>
          ))}
        </div>

        {/* Broadcast Form (Trigger New Push Notification) */}
        <form onSubmit={handleTriggerPush} className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 shrink-0 space-y-2">
          <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
            Kirim Notifikasi Push Baru
          </div>
          <input
            type="text"
            required
            placeholder="Judul notifikasi..."
            value={testTitle}
            onChange={(e) => setTestTitle(e.target.value)}
            className="w-full text-xs px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
          />
          <input
            type="text"
            required
            placeholder="Isi pesan notifikasi kilat..."
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            className="w-full text-xs px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
          />
          <button
            type="submit"
            disabled={isSending}
            className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Kirim Notifikasi Push Instan</span>
          </button>
        </form>

      </div>
    </div>
  );
};
