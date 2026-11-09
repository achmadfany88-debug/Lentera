import React from 'react';
import { X, Printer, Download, CheckCircle2, Building, ShieldCheck } from 'lucide-react';
import { PMKRecord } from '../../types';
import { TOP_10_SELF_LEARNING, TOP_10_LEARNING_POINTS } from '../../services/dataService';
import { exportAndDownloadMonthlyReport } from '../../services/pdfExport';

interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: PMKRecord[];
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  isOpen,
  onClose,
  records,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    exportAndDownloadMonthlyReport({
      records,
      topSelfLearning: TOP_10_SELF_LEARNING,
      topLearningPoints: TOP_10_LEARNING_POINTS,
      periodLabel: 'Periode Akhir Bulan: November 2026',
      generatedBy: 'Admin (KPw BI Jatim)',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Cetak / Ekspor Laporan Bulanan LENTERA
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Dokumen resmi evaluasi Dual-Loop Learning KPw Bank Indonesia Provinsi Jawa Timur
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Preview Document Sheet */}
        <div className="mt-4 flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-sans print-page">
          
          {/* Header Block of Official Document */}
          <div className="border-b-2 border-slate-800 dark:border-slate-300 pb-4 mb-4 flex items-start justify-between">
            <div>
              <div className="text-xs font-black tracking-wider uppercase text-sky-900 dark:text-sky-300">
                BANK INDONESIA
              </div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                Kantor Perwakilan Bank Indonesia Provinsi Jawa Timur
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                LENTERA: Learning, Enrichment, Transformation, and Evaluation for Resulting Advancement
              </div>
            </div>
            <div className="text-right text-[11px]">
              <div className="font-mono font-bold text-slate-700 dark:text-slate-300">
                DOKUMEN RESMI AKHIR BULAN
              </div>
              <div className="text-slate-500">
                08 November 2026
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center my-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
              LAPORAN CAPAIAN DUAL-LOOP LEARNING BULAN NOVEMBER 2026
            </h3>
            <p className="text-xs text-slate-500">
              Menghubungkan Literasi Publik, Bank Kasus, dan Pembelajaran Internal Pegawai
            </p>
          </div>

          {/* Metric Summary Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 my-4 text-center">
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase">PESERTA</div>
              <div className="text-lg font-black text-slate-900 dark:text-white">305</div>
            </div>
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase">PROGRAM</div>
              <div className="text-lg font-black text-slate-900 dark:text-white">9</div>
            </div>
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase">SERTIFIKASI</div>
              <div className="text-lg font-black text-slate-900 dark:text-white">207</div>
            </div>
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase">NON SERTIF</div>
              <div className="text-lg font-black text-slate-900 dark:text-white">98</div>
            </div>
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase">BNSP</div>
              <div className="text-lg font-black text-teal-600">172</div>
            </div>
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase">ISO 15489</div>
              <div className="text-lg font-black text-sky-600">33</div>
            </div>
          </div>

          {/* Leaders Summary Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4 text-xs">
            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="font-bold text-slate-900 dark:text-white mb-2">
                Top 5 Jam Self Learning
              </div>
              <div className="space-y-1">
                {TOP_10_SELF_LEARNING.slice(0, 5).map(item => (
                  <div key={item.ranking} className="flex justify-between text-[11px]">
                    <span>{item.ranking}. {item.namaPegawai}</span>
                    <span className="font-bold font-mono">{item.value} Jam</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="font-bold text-slate-900 dark:text-white mb-2">
                Top 5 Learning Point
              </div>
              <div className="space-y-1">
                {TOP_10_LEARNING_POINTS.slice(0, 5).map(item => (
                  <div key={item.ranking} className="flex justify-between text-[11px]">
                    <span>{item.ranking}. {item.namaPegawai}</span>
                    <span className="font-bold font-mono text-emerald-600">{item.value} Pts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Verification Hash Note */}
          <div className="mt-6 pt-3 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Integritas Terverifikasi Enkripsi Digital Bank Indonesia</span>
            </div>
            <div className="font-mono">NO: BI-JATIM/LENTERA/2026/XI</div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Cetak Layar (Print)</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF Akhir Bulan</span>
          </button>
        </div>

      </div>
    </div>
  );
};
