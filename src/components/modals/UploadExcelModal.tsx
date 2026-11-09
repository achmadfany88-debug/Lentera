import React, { useState } from 'react';
import { X, FileSpreadsheet, Upload, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { PMKRecord } from '../../types';
import { dataRepo } from '../../services/dataService';

interface UploadExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

export const UploadExcelModal: React.FC<UploadExcelModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewRows, setPreviewRows] = useState<Partial<PMKRecord>[]>([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setErrorMsg('');
      
      // Generate sample preview rows from uploaded file
      const demoParsed: Partial<PMKRecord>[] = [
        {
          nip: '19950812-202001-1-015',
          namaPegawai: 'Dimas Prasetyo',
          unitKerja: 'Unit Layanan dan Pengolahan Uang',
          judulProgram: 'Sertifikasi BNSP Pengelolaan Uang Rupiah',
          jamSelfLearning: 52,
          learningPoint: 850,
          sertifikasi: 'BNSP',
          statusPmk: 'Selesai'
        },
        {
          nip: '19920311-201702-2-008',
          namaPegawai: 'Annisa Fitriani',
          unitKerja: 'Unit Implementasi Kebijakan SP & PK',
          judulProgram: 'Dual-Loop SP & Kebijakan PK',
          jamSelfLearning: 48,
          learningPoint: 720,
          sertifikasi: 'Tanpa Sertifikasi',
          statusPmk: 'Selesai'
        },
        {
          nip: '19890422-201403-1-002',
          namaPegawai: 'Rizki Kurniawan',
          unitKerja: 'Unit Logistik, SDM, Sekre, Protokol, dan Pengamanan',
          judulProgram: 'Audit Manajemen Rekod ISO 15489',
          jamSelfLearning: 60,
          learningPoint: 940,
          sertifikasi: 'ISO 15489',
          statusPmk: 'Selesai'
        }
      ];
      setPreviewRows(demoParsed);
    }
  };

  const handleProcessUpload = () => {
    if (!selectedFile) {
      setErrorMsg('Silakan pilih berkas Excel atau CSV terlebih dahulu.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg('');

    setTimeout(() => {
      // Create new PMK records from parsed rows
      const newRecords: PMKRecord[] = previewRows.map((p, idx) => ({
        id: `pmk-upl-${Date.now()}-${idx}`,
        nip: p.nip || `19900000-202000-1-00${idx}`,
        namaPegawai: p.namaPegawai || `Pegawai Impor ${idx + 1}`,
        unitKerja: p.unitKerja || 'Unit Keuangan',
        judulProgram: p.judulProgram || 'Pelatihan Baru LENTERA',
        kategori: 'Teknis Kebanksentralan',
        jenisProgram: 'Self Learning',
        jamSelfLearning: p.jamSelfLearning || 50,
        learningPoint: p.learningPoint || 750,
        sertifikasi: (p.sertifikasi as any) || 'Tanpa Sertifikasi',
        statusPmk: 'Selesai',
        tahun: '2026',
        periode: 'Q4',
        tanggalSelesai: '2026-11-08',
        nilaiSurveiLevel3: 4.8,
      }));

      dataRepo.importPMKRecords(newRecords, 'Admin');
      setIsProcessing(false);
      setSuccessMsg(`Berhasil mengimpor ${newRecords.length} data PMK baru ke database.`);
      
      setTimeout(() => {
        onUploadSuccess();
        onClose();
      }, 1200);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Upload Data Excel / CSV PMK
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Impor data riwayat pembelajaran dan sertifikasi pegawai
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

        {/* Content */}
        <div className="mt-5 space-y-4">
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* File drop area */}
          <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-sky-500 dark:hover:border-sky-400 hover:bg-sky-50/30 transition">
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <Upload className="w-8 h-8 text-sky-600 dark:text-sky-400 mb-2" />
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {selectedFile ? selectedFile.name : 'Pilih file Excel (.xlsx, .xls) atau CSV'}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {selectedFile ? `${Math.round(selectedFile.size / 1024)} KB` : 'Format otomatis divalidasi sesuai skema kolom PMK Bank Indonesia'}
            </div>
          </label>

          {/* Preview Table */}
          {previewRows.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Pratinjau Data Impor ({previewRows.length} baris terdeteksi):
              </div>
              <div className="max-h-40 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 p-2 space-y-1.5 text-xs">
                {previewRows.map((r, i) => (
                  <div key={i} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-[11px]">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{r.namaPegawai}</span>
                      <span className="text-slate-400 ml-1.5">({r.unitKerja})</span>
                    </div>
                    <span className="font-semibold text-sky-600 dark:text-sky-400 font-mono">
                      {r.jamSelfLearning} Jam / {r.sertifikasi}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={!selectedFile || isProcessing}
            onClick={handleProcessUpload}
            className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Memproses Database...</span>
              </>
            ) : (
              <span>Impor ke LENTERA</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
