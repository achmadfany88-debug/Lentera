import React, { useState, useMemo } from 'react';
import { 
  History, 
  Search, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Filter, 
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { AuditLog, AuditAction } from '../../types';

interface AuditLogViewProps {
  logs: AuditLog[];
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ logs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('Semua');

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchSearch = 
        log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.ipAddress.includes(searchQuery);

      const matchAction = actionFilter === 'Semua' || log.action === actionFilter;
      return matchSearch && matchAction;
    });
  }, [logs, searchQuery, actionFilter]);

  const handleExportCSV = () => {
    const headers = ['ID', 'Timestamp', 'User', 'Aksi', 'Modul', 'Detail', 'IP Address', 'Status'];
    const rows = filteredLogs.map(l => [
      l.id,
      `"${l.timestamp}"`,
      `"${l.userName}"`,
      l.action,
      `"${l.module}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      l.ipAddress,
      l.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Audit_Log_LENTERA_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
              Sistem Audit Trail Standar BI
            </span>
            <span className="text-slate-400">&bull;</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Governance & Compliance</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            Log Aktivitas Pengguna & Audit Perubahan Data
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Pencatatan setiap interaksi kredensial, modifikasi data pengguna, unggahan file excel, ekspor laporan, dan sinkronisasi data secara mendalam.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm transition cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4 text-sky-600" />
          <span>Ekspor Log (CSV)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Cari log berdasarkan user, rincian aktivitas, modul, atau alamat IP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
          >
            <option value="Semua">Semua Jenis Aksi</option>
            <option value="LOGIN_SUCCESS">Login Berhasil</option>
            <option value="LOGIN_FAILED">Login Gagal</option>
            <option value="USER_CREATE">Tambah User Baru</option>
            <option value="USER_UPDATE">Update User</option>
            <option value="USER_DELETE">Hapus User</option>
            <option value="DATA_UPLOAD">Upload Data Excel</option>
            <option value="DATA_EXPORT_PDF">Ekspor PDF Bulanan</option>
            <option value="CACHE_REFRESH">Cache Refresh</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4 w-40">TIMESTAMP</th>
                <th className="py-3 px-4">USER PELAKSANA</th>
                <th className="py-3 px-4">AKSI</th>
                <th className="py-3 px-4">MODUL</th>
                <th className="py-3 px-4">RINCIAN AKTIVITAS</th>
                <th className="py-3 px-4">IP ADDRESS</th>
                <th className="py-3 px-4 text-center">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Tidak ada catatan aktivitas yang cocok dengan kriteria filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {log.userName}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">
                      {log.module}
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 max-w-md">
                      {log.details}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                      {log.ipAddress}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {log.status === 'Success' && (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Sukses</span>
                        </span>
                      )}
                      {log.status === 'Warning' && (
                        <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 text-[11px] font-bold">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Peringatan</span>
                        </span>
                      )}
                      {log.status === 'Error' && (
                        <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 text-[11px] font-bold">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Gagal</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
