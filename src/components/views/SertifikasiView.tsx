import React, { useState, useMemo } from 'react';
import { 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  CheckCircle,
  XCircle,
  GraduationCap,
  ClipboardList,
  TrendingUp,
  Search, 
  Download, 
  Upload, 
  Plus, 
  FileText, 
  Trash2, 
  Edit3, 
  X, 
  Check, 
  RotateCcw,
  Users,
  AlertTriangle
} from 'lucide-react';
import { PMKRecord, User, DigitalCertificate, CertType } from '../../types';
import { dataRepo, UNIT_KERJA_LIST, PROGRAM_LIST } from '../../services/dataService';

interface SertifikasiViewProps {
  records: PMKRecord[];
  currentUser: User;
  onRefreshRecords?: () => void;
}

export const SertifikasiView: React.FC<SertifikasiViewProps> = ({
  records,
  currentUser,
  onRefreshRecords,
}) => {
  const isAdmin = currentUser.role === 'Super Admin' || currentUser.role === 'Admin';

  // Local synced records state so edits/deletions reflect immediately
  const [localRecords, setLocalRecords] = useState<PMKRecord[]>(records);
  React.useEffect(() => {
    setLocalRecords(records);
  }, [records]);

  // Summary Metric Overrides state
  const [metricOverrides, setMetricOverrides] = useState(() => dataRepo.getSummaryMetricsOverrides());
  const [isEditMetricsModalOpen, setIsEditMetricsModalOpen] = useState(false);
  const [metricsForm, setMetricsForm] = useState({
    totalPeserta: 304,
    program: 9,
    denganSertifikasi: 207,
    tanpaSertifikasi: 98,
    bnsp: 172,
    iso15489: 33,
    purLsb: 45,
  });

  // 304 Participants Table Filter & Search State
  const [participantFilterTab, setParticipantFilterTab] = useState<
    'Semua' | 'Dengan Sertifikasi' | 'Tanpa Sertifikasi' | 'BNSP' | 'ISO 15489' | 'PUR / LSB'
  >('Semua');
  const [participantUnitFilter, setParticipantUnitFilter] = useState<string>('Semua');
  const [participantSearch, setParticipantSearch] = useState<string>('');

  // Edit / Delete Participant Record Modal State (for the 304 rows)
  const [editingParticipant, setEditingParticipant] = useState<PMKRecord | null>(null);
  const [deletingParticipant, setDeletingParticipant] = useState<PMKRecord | null>(null);

  // Digital Certificates Repository State
  const [activeCertTab, setActiveCertTab] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [certificates, setCertificates] = useState<DigitalCertificate[]>(() => dataRepo.getCertificates());

  // Upload/Add Certificate Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'admin_issue' | 'employee_upload'>('employee_upload');
  const [recipientNip, setRecipientNip] = useState(currentUser.nip);
  const [recipientName, setRecipientName] = useState(currentUser.fullName);
  const [recipientUnit, setRecipientUnit] = useState(currentUser.unitKerja || UNIT_KERJA_LIST[1]);
  const [programTitle, setProgramTitle] = useState('');
  const [certType, setCertType] = useState<'BNSP' | 'ISO 15489' | 'PUR / LSB'>('BNSP');
  const [certNumber, setCertNumber] = useState(`BI-${Date.now().toString().slice(-4)}`);
  const [issueDate, setIssueDate] = useState('2026-11-08');
  const [validUntil, setValidUntil] = useState('2029-11-08');

  // Edit / Delete Digital Certificate Modal State
  const [editingCert, setEditingCert] = useState<DigitalCertificate | null>(null);
  const [deletingCert, setDeletingCert] = useState<DigitalCertificate | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Computed metrics with support for Admin overrides
  const metrics = useMemo(() => {
    const calcDenganSertifikasi = localRecords.filter(r => r.sertifikasi !== 'Tanpa Sertifikasi').length;
    const calcTanpaSertifikasi = localRecords.filter(r => r.sertifikasi === 'Tanpa Sertifikasi').length;
    const calcBnsp = localRecords.filter(r => r.sertifikasi === 'BNSP').length;
    const calcIso = localRecords.filter(r => r.sertifikasi === 'ISO 15489').length;
    const calcPurLsb = localRecords.filter(r => r.sertifikasi === 'PUR / LSB').length;
    const calcTotal = localRecords.length;

    return {
      totalPeserta: metricOverrides ? metricOverrides.totalPeserta : calcTotal,
      program: metricOverrides ? metricOverrides.program : 9,
      denganSertifikasi: metricOverrides ? metricOverrides.denganSertifikasi : calcDenganSertifikasi,
      tanpaSertifikasi: metricOverrides
        ? metricOverrides.tanpaSertifikasi
        : (calcTotal === 304 && calcTanpaSertifikasi === 97 ? 98 : calcTanpaSertifikasi),
      bnsp: metricOverrides ? metricOverrides.bnsp : calcBnsp,
      iso15489: metricOverrides ? metricOverrides.iso15489 : calcIso,
      purLsb: metricOverrides ? metricOverrides.purLsb : (calcPurLsb || 2),
      rawDenganCount: calcDenganSertifikasi,
      rawTanpaCount: calcTanpaSertifikasi,
      rawBnspCount: calcBnsp,
      rawIsoCount: calcIso,
      rawPurLsbCount: calcPurLsb,
      rawTotalCount: calcTotal,
    };
  }, [localRecords, metricOverrides]);

  // Open Edit Summary Metrics Modal
  const handleOpenEditMetrics = () => {
    setMetricsForm({
      totalPeserta: metrics.totalPeserta,
      program: metrics.program,
      denganSertifikasi: metrics.denganSertifikasi,
      tanpaSertifikasi: metrics.tanpaSertifikasi,
      bnsp: metrics.bnsp,
      iso15489: metrics.iso15489,
      purLsb: metrics.purLsb,
    });
    setIsEditMetricsModalOpen(true);
  };

  const handleSaveMetricsForm = (e: React.FormEvent) => {
    e.preventDefault();
    dataRepo.saveSummaryMetricsOverrides(metricsForm, currentUser.fullName);
    setMetricOverrides({ ...metricsForm });
    setIsEditMetricsModalOpen(false);
    showToast('Tampilan statistik ringkasan sertifikasi berhasil diperbarui.');
  };

  const handleResetMetricsOverrides = () => {
    dataRepo.resetSummaryMetricsOverrides(currentUser.fullName);
    setMetricOverrides(null);
    setIsEditMetricsModalOpen(false);
    showToast('Statistik ringkasan dikembalikan ke perhitungan otomatis data peserta.');
  };

  // Filtered 304 participants list (Dengan Sertifikasi & Tanpa Sertifikasi)
  const filteredParticipants = useMemo(() => {
    return localRecords.filter((rec) => {
      if (participantUnitFilter !== 'Semua' && rec.unitKerja !== participantUnitFilter) {
        return false;
      }
      if (participantFilterTab === 'Dengan Sertifikasi' && rec.sertifikasi === 'Tanpa Sertifikasi') {
        return false;
      }
      if (participantFilterTab === 'Tanpa Sertifikasi' && rec.sertifikasi !== 'Tanpa Sertifikasi') {
        return false;
      }
      if (participantFilterTab === 'BNSP' && rec.sertifikasi !== 'BNSP') {
        return false;
      }
      if (participantFilterTab === 'ISO 15489' && rec.sertifikasi !== 'ISO 15489') {
        return false;
      }
      if (participantFilterTab === 'PUR / LSB' && rec.sertifikasi !== 'PUR / LSB') {
        return false;
      }
      if (participantSearch.trim() !== '') {
        const q = participantSearch.toLowerCase();
        const matchName = rec.namaPegawai.toLowerCase().includes(q);
        const matchNip = rec.nip.toLowerCase().includes(q);
        const matchUnit = rec.unitKerja.toLowerCase().includes(q);
        const matchProg = rec.judulProgram.toLowerCase().includes(q);
        const matchCert = rec.sertifikasi.toLowerCase().includes(q);
        if (!matchName && !matchNip && !matchUnit && !matchProg && !matchCert) return false;
      }
      return true;
    });
  }, [localRecords, participantFilterTab, participantUnitFilter, participantSearch]);

  // Save Edited Participant Record (from the 304 table)
  const handleSaveParticipantEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingParticipant) return;

    dataRepo.updatePMKRecord(editingParticipant, currentUser.fullName);
    const updatedList = [...dataRepo.getPMKData()];
    setLocalRecords(updatedList);
    if (onRefreshRecords) onRefreshRecords();
    setEditingParticipant(null);
    showToast(`Data sertifikasi peserta "${editingParticipant.namaPegawai}" berhasil diperbarui.`);
  };

  // Confirm Delete Participant Record (from the 304 table)
  const handleConfirmDeleteParticipant = () => {
    if (!deletingParticipant) return;
    const name = deletingParticipant.namaPegawai;
    dataRepo.deletePMKRecord(deletingParticipant.id, currentUser.fullName);
    const updatedList = [...dataRepo.getPMKData()];
    setLocalRecords(updatedList);
    if (onRefreshRecords) onRefreshRecords();
    setDeletingParticipant(null);
    showToast(`Data peserta "${name}" berhasil dihapus.`);
  };

  // Filtered digital certificates list
  const filteredCerts = useMemo(() => {
    return certificates.filter((c) => {
      const matchSearch = 
        c.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.nip.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.programTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.certNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.unitKerja.toLowerCase().includes(searchQuery.toLowerCase());

      const matchTab = 
        activeCertTab === 'Semua' ||
        (activeCertTab === 'BNSP' && c.certType === 'BNSP') ||
        (activeCertTab === 'ISO 15489' && c.certType === 'ISO 15489') ||
        (activeCertTab === 'PUR / LSB' && c.certType === 'PUR / LSB');

      return matchSearch && matchTab;
    });
  }, [certificates, searchQuery, activeCertTab]);

  // Download certificate simulation
  const handleDownloadCert = (cert: DigitalCertificate) => {
    showToast(`Mengunduh Sertifikat Digital Resmi: ${cert.certNumber}.pdf`);
  };

  // Submit Certificate Form (Admin publish or Employee upload)
  const handleSubmitCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!programTitle.trim()) return;

    const newCert = dataRepo.addCertificate({
      certNumber: certNumber.trim(),
      nip: recipientNip.trim(),
      recipientName: recipientName.trim(),
      unitKerja: recipientUnit,
      programTitle: programTitle.trim(),
      certType,
      issueDate,
      validUntil,
      uploadedByRole: isAdmin ? 'Admin' : 'Pegawai',
      uploadedByName: currentUser.fullName,
      status: isAdmin ? 'Terverifikasi' : 'Menunggu Verifikasi',
    });

    setCertificates([...dataRepo.getCertificates()]);
    setIsModalOpen(false);
    setProgramTitle('');
    showToast(
      isAdmin 
        ? `Sertifikat digital untuk ${newCert.recipientName} berhasil diterbitkan.` 
        : `Sertifikat pelatihan berhasil diunggah dan sedang dalam proses verifikasi tim SDM.`
    );
  };

  // Save Edited Digital Certificate
  const handleSaveEditedCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert) return;
    dataRepo.updateCertificate(editingCert, currentUser.fullName);
    setCertificates([...dataRepo.getCertificates()]);
    setEditingCert(null);
    showToast(`Sertifikat digital "${editingCert.recipientName}" berhasil diperbarui.`);
  };

  // Confirm Delete Digital Certificate
  const handleConfirmDeleteCert = () => {
    if (!deletingCert) return;
    const name = deletingCert.recipientName;
    dataRepo.deleteCertificate(deletingCert.id, currentUser.fullName);
    setCertificates([...dataRepo.getCertificates()]);
    setDeletingCert(null);
    showToast(`Sertifikat digital untuk "${name}" berhasil dihapus.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-2xl border border-emerald-500 flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white dark:bg-[#0c182c] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Standardisasi & Akreditasi Profesi Bank Indonesia
          </span>
          <h2 className="text-xl font-extrabold text-[#0c2340] dark:text-white mt-1">
            Status & Repositori Sertifikasi Digital Pegawai
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Monitoring data sertifikasi {metrics.totalPeserta} pegawai (Dengan Sertifikasi & Tanpa Sertifikasi): BNSP, ISO 15489, dan PUR / LSB KPw BI Provinsi Jawa Timur.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {isAdmin && (
            <button
              onClick={handleOpenEditMetrics}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 dark:hover:bg-sky-900/70 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Ringkasan Statistik</span>
            </button>
          )}

          {isAdmin ? (
            <button
              onClick={() => {
                setModalType('admin_issue');
                setCertNumber(`BI-${Date.now().toString().slice(-4)}`);
                setIsModalOpen(true);
              }}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Upload / Terbitkan Sertifikat</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setModalType('employee_upload');
                setCertNumber(`BI-${Date.now().toString().slice(-4)}`);
                setIsModalOpen(true);
              }}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Unggah Sertifikat Digital Pelatihan</span>
            </button>
          )}
        </div>
      </div>

      {/* 6 SUMMARY METRIC CARDS (Matching User Reference Screenshot + Editable by Super Admin & Admin) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* 1. TOTAL PESERTA */}
        <div className="bg-white dark:bg-[#0c182c] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs relative group">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase block">
                TOTAL PESERTA
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#0c2340] dark:text-white mt-1 tabular-nums">
                {metrics.totalPeserta}
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-300 flex items-center justify-center border border-sky-100 dark:border-sky-800/60">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between">
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-3 h-3" />
              <span>+0%</span>
            </div>
            {isAdmin && (
              <button
                type="button"
                onClick={handleOpenEditMetrics}
                className="p-1 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Edit Total Peserta"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 2. PROGRAM */}
        <div className="bg-white dark:bg-[#0c182c] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs relative group">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase block">
                PROGRAM
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#0c2340] dark:text-white mt-1 tabular-nums">
                {metrics.program}
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center border border-emerald-100 dark:border-emerald-800/60">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between">
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-3 h-3" />
              <span>+0%</span>
            </div>
            {isAdmin && (
              <button
                type="button"
                onClick={handleOpenEditMetrics}
                className="p-1 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Edit Jumlah Program"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 3. DENGAN SERTIFIKASI */}
        <div className="bg-white dark:bg-[#0c182c] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs relative group">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase block truncate">
                DENGAN SERTIFIKASI
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#0c2340] dark:text-white mt-1 tabular-nums">
                {metrics.denganSertifikasi}
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-300 flex items-center justify-center border border-teal-100 dark:border-teal-800/60">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between">
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-3 h-3" />
              <span>+0%</span>
            </div>
            {isAdmin && (
              <button
                type="button"
                onClick={handleOpenEditMetrics}
                className="p-1 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Edit Dengan Sertifikasi"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 4. TANPA SERTIFIKASI */}
        <div className="bg-white dark:bg-[#0c182c] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs relative group">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase block truncate">
                TANPA SERTIFIKASI
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#0c2340] dark:text-white mt-1 tabular-nums">
                {metrics.tanpaSertifikasi}
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-rose-900/60">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between">
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-3 h-3" />
              <span>+0%</span>
            </div>
            {isAdmin && (
              <button
                type="button"
                onClick={handleOpenEditMetrics}
                className="p-1 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Edit Tanpa Sertifikasi"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 5. BNSP */}
        <div className="bg-white dark:bg-[#0c182c] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs relative group">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase block">
                BNSP
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#0c2340] dark:text-white mt-1 tabular-nums">
                {metrics.bnsp}
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center border border-emerald-100 dark:border-emerald-800/60">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between">
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-3 h-3" />
              <span>+0%</span>
            </div>
            {isAdmin && (
              <button
                type="button"
                onClick={handleOpenEditMetrics}
                className="p-1 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Edit BNSP"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 6. ISO 15489 */}
        <div className="bg-white dark:bg-[#0c182c] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs relative group">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase block">
                ISO 15489
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#0c2340] dark:text-white mt-1 tabular-nums">
                {metrics.iso15489}
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 flex items-center justify-center border border-blue-100 dark:border-blue-800/60">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between">
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-3 h-3" />
              <span>+0%</span>
            </div>
            {isAdmin && (
              <button
                type="button"
                onClick={handleOpenEditMetrics}
                className="p-1 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Edit ISO 15489"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>

      {/* ===================================================================== */}
      {/* DATA 304 PESERTA SERTIFIKASI (MAX 15 ROWS VISIBLE + SCROLL DOWNWARDS) */}
      {/* ===================================================================== */}
      <div className="bg-white dark:bg-[#0c182c] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        
        {/* Section Header & Filters */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <h3 className="text-base font-extrabold text-[#0c2340] dark:text-white">
                  Daftar Data {localRecords.length} Peserta (Dengan Sertifikasi &amp; Tanpa Sertifikasi)
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Menampilkan maksimal <strong>15 baris</strong> pada layar utama — gulir (scroll) tabel ke bawah untuk melihat seluruh <strong>{filteredParticipants.length}</strong> data peserta.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold">
                Dengan Sertifikasi: {metrics.rawDenganCount} Peserta
              </span>
              <span className="px-3 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-[11px] font-bold">
                Tanpa Sertifikasi: {metrics.rawTanpaCount} Peserta
              </span>
            </div>
          </div>

          {/* Filter Tabs & Search Input */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-xl">
              {(
                [
                  { id: 'Semua', label: `Semua (${metrics.rawTotalCount})` },
                  { id: 'Dengan Sertifikasi', label: `Dengan Sertifikasi (${metrics.rawDenganCount})` },
                  { id: 'Tanpa Sertifikasi', label: `Tanpa Sertifikasi (${metrics.rawTanpaCount})` },
                  { id: 'BNSP', label: `BNSP (${metrics.rawBnspCount})` },
                  { id: 'ISO 15489', label: `ISO 15489 (${metrics.rawIsoCount})` },
                  { id: 'PUR / LSB', label: `PUR / LSB (${metrics.rawPurLsbCount})` },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setParticipantFilterTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    participantFilterTab === tab.id
                      ? 'bg-white dark:bg-slate-900 text-[#0c2340] dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <select
                value={participantUnitFilter}
                onChange={(e) => setParticipantUnitFilter(e.target.value)}
                className="w-full sm:w-52 text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer truncate"
              >
                {UNIT_KERJA_LIST.map((u) => (
                  <option key={u} value={u}>
                    {u === 'Semua' ? 'Semua Unit Kerja' : u}
                  </option>
                ))}
              </select>

              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Cari nama peserta, NIP, program..."
                  value={participantSearch}
                  onChange={(e) => setParticipantSearch(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Table Container: Max 15 rows visible (15 * 44px = 660px + 42px sticky header = 702px) */}
        <div className="max-h-[702px] overflow-y-auto overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-slate-100/95 dark:bg-slate-900/95 backdrop-blur-xs border-b border-slate-200 dark:border-slate-800 text-[10.5px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <tr className="h-[42px]">
                <th className="py-2.5 px-4 w-12 text-center">No</th>
                <th className="py-2.5 px-4">Nama Peserta &amp; NIP</th>
                <th className="py-2.5 px-4">Asal Unit Kerja</th>
                <th className="py-2.5 px-4">Program Pelatihan / PMK</th>
                <th className="py-2.5 px-4">Status Sertifikasi</th>
                <th className="py-2.5 px-4">Jenis Sertifikasi</th>
                <th className="py-2.5 px-4 text-center">Status PMK</th>
                {isAdmin && <th className="py-2.5 px-4 text-right">Aksi Admin</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-xs">
              {filteredParticipants.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 8 : 7} className="py-10 text-center text-slate-400">
                    Tidak ada data peserta yang sesuai dengan pencarian/filter.
                  </td>
                </tr>
              ) : (
                filteredParticipants.map((rec, index) => {
                  const hasCert = rec.sertifikasi !== 'Tanpa Sertifikasi';
                  return (
                    <tr
                      key={rec.id}
                      className="h-[44px] hover:bg-sky-50/50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-2 px-4 text-center font-mono text-[11px] text-slate-400">
                        {index + 1}
                      </td>
                      <td className="py-2 px-4">
                        <div className="font-bold text-[#0c2340] dark:text-white leading-tight">
                          {rec.namaPegawai}
                        </div>
                        <div className="text-[10.5px] font-mono text-slate-400">
                          NIP: {rec.nip}
                        </div>
                      </td>
                      <td className="py-2 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium max-w-[230px] truncate">
                          {rec.unitKerja}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <div className="font-semibold text-slate-700 dark:text-slate-200 max-w-[240px] truncate" title={rec.judulProgram}>
                          {rec.judulProgram}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {rec.kategori} &bull; {rec.periode} {rec.tahun}
                        </div>
                      </td>
                      <td className="py-2 px-4">
                        {hasCert ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10.5px] font-bold">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Dengan Sertifikasi</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-[10.5px] font-bold">
                            <XCircle className="w-3 h-3" />
                            <span>Tanpa Sertifikasi</span>
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[10.5px] font-bold ${
                            rec.sertifikasi === 'BNSP'
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : rec.sertifikasi === 'ISO 15489'
                              ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                              : rec.sertifikasi === 'PUR / LSB'
                              ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {rec.sertifikasi}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            rec.statusPmk === 'Selesai'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                              : rec.statusPmk === 'On-Going'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                              : 'bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300'
                          }`}
                        >
                          {rec.statusPmk}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="py-2 px-4 text-right">
                          <div className="inline-flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditingParticipant({ ...rec })}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 dark:hover:bg-sky-900 text-sky-700 dark:text-sky-300 text-[11px] font-bold transition cursor-pointer"
                              title="Edit Data Sertifikasi Peserta"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingParticipant(rec)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-300 text-[11px] font-bold transition cursor-pointer"
                              title="Hapus Data Peserta"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Hapus</span>
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <span>
            Menampilkan <strong>{Math.min(15, filteredParticipants.length)} baris pertama</strong> di area pandang dari total <strong>{filteredParticipants.length} peserta</strong> (Gulir ke bawah untuk melihat baris ke-16 hingga ke-{filteredParticipants.length}).
          </span>
          {isAdmin && (
            <span className="text-sky-600 dark:text-sky-400 font-semibold">
              Mode Akses {currentUser.role}: Seluruh data peserta dapat diedit dan dihapus.
            </span>
          )}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* REPOSITORI DOKUMEN SERTIFIKAT DIGITAL PEGAWAI                         */}
      {/* ===================================================================== */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-[#0c2340] dark:text-white">
              Repositori Berkas Sertifikat Digital Pegawai
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Daftar dokumen sertifikat digital terverifikasi yang dapat diunduh{isAdmin ? ', diedit, dan dihapus oleh Admin / Super Admin' : ''}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              {['Semua', 'BNSP', 'ISO 15489', 'PUR / LSB'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveCertTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeCertTab === tab
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Cari sertifikat digital, nomor, NIP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 bg-white dark:bg-[#0c182c] border border-slate-200/80 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>

        {/* Digital Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCerts.map((cert) => (
            <div 
              key={cert.id}
              className="bg-white dark:bg-[#0c182c] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-emerald-500/40 transition"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                    cert.certType === 'BNSP'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : cert.certType === 'ISO 15489'
                      ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                      : 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                  }`}>
                    {cert.certType}
                  </span>

                  <span className="text-[10.5px] font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{cert.status}</span>
                  </span>
                </div>

                <h4 className="font-extrabold text-sm text-[#0c2340] dark:text-white">
                  {cert.recipientName}
                </h4>
                <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                  NIP: {cert.nip}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-2.5">
                  {cert.programTitle}
                </div>
                <div className="text-[10.5px] font-mono text-slate-400 mt-1">
                  No. Registrasi: {cert.certNumber}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-400 truncate max-w-[130px]" title={cert.unitKerja}>
                  {cert.unitKerja}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleDownloadCert(cert)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold hover:bg-emerald-100 transition cursor-pointer"
                    title="Unduh Sertifikat PDF"
                  >
                    <Download className="w-3 h-3" />
                    <span>Unduh</span>
                  </button>

                  {isAdmin && (
                    <>
                      <button
                        type="button"
                        onClick={() => setEditingCert({ ...cert })}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-[11px] font-bold transition cursor-pointer"
                        title="Edit Sertifikat"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingCert(cert)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 text-[11px] font-bold transition cursor-pointer"
                        title="Hapus Sertifikat"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Hapus</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MODAL 1: EDIT RINGKASAN STATISTIK SERTIFIKASI (6 CARDS)               */}
      {/* ===================================================================== */}
      {isEditMetricsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#0c182c] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#0c2340] dark:text-white">
                    Edit Ringkasan Statistik Sertifikasi
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Sesuaikan angka tampilan kartu statistik pada menu Sertifikasi &amp; Dashboard
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditMetricsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMetricsForm} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    TOTAL PESERTA
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={metricsForm.totalPeserta}
                    onChange={(e) => setMetricsForm({ ...metricsForm, totalPeserta: Number(e.target.value) })}
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    PROGRAM
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={metricsForm.program}
                    onChange={(e) => setMetricsForm({ ...metricsForm, program: Number(e.target.value) })}
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    DENGAN SERTIFIKASI
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={metricsForm.denganSertifikasi}
                    onChange={(e) => setMetricsForm({ ...metricsForm, denganSertifikasi: Number(e.target.value) })}
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    TANPA SERTIFIKASI
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={metricsForm.tanpaSertifikasi}
                    onChange={(e) => setMetricsForm({ ...metricsForm, tanpaSertifikasi: Number(e.target.value) })}
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    BNSP
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={metricsForm.bnsp}
                    onChange={(e) => setMetricsForm({ ...metricsForm, bnsp: Number(e.target.value) })}
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    ISO 15489
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={metricsForm.iso15489}
                    onChange={(e) => setMetricsForm({ ...metricsForm, iso15489: Number(e.target.value) })}
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleResetMetricsOverrides}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset ke Hitungan Otomatis</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditMetricsModalOpen(false)}
                    className="px-4 py-2 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs cursor-pointer"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 2: EDIT DATA PESERTA (FROM THE 304 PARTICIPANTS TABLE)          */}
      {/* ===================================================================== */}
      {editingParticipant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#0c182c] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#0c2340] dark:text-white">
                    Edit Data Sertifikasi Peserta
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Perbarui informasi pegawai, unit kerja, program, dan status sertifikasi
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingParticipant(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveParticipantEdit} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Nama Pegawai
                  </label>
                  <input
                    type="text"
                    required
                    value={editingParticipant.namaPegawai}
                    onChange={(e) => setEditingParticipant({ ...editingParticipant, namaPegawai: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    NIP Pegawai
                  </label>
                  <input
                    type="text"
                    required
                    value={editingParticipant.nip}
                    onChange={(e) => setEditingParticipant({ ...editingParticipant, nip: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Asal Unit Kerja
                </label>
                <select
                  value={editingParticipant.unitKerja}
                  onChange={(e) => setEditingParticipant({ ...editingParticipant, unitKerja: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  {UNIT_KERJA_LIST.filter((u) => u !== 'Semua').map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Judul Program Pelatihan / Sertifikasi
                </label>
                <input
                  type="text"
                  required
                  list="sertifikasi-program-list"
                  value={editingParticipant.judulProgram}
                  onChange={(e) => setEditingParticipant({ ...editingParticipant, judulProgram: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
                <datalist id="sertifikasi-program-list">
                  {PROGRAM_LIST.map((p) => (
                    <option key={p} value={p} />
                  ))}
                </datalist>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Status &amp; Jenis Sertifikasi
                  </label>
                  <select
                    value={editingParticipant.sertifikasi}
                    onChange={(e) =>
                      setEditingParticipant({
                        ...editingParticipant,
                        sertifikasi: e.target.value as CertType,
                      })
                    }
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="BNSP">Dengan Sertifikasi — BNSP</option>
                    <option value="ISO 15489">Dengan Sertifikasi — ISO 15489</option>
                    <option value="PUR / LSB">Dengan Sertifikasi — PUR / LSB</option>
                    <option value="Tanpa Sertifikasi">Tanpa Sertifikasi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Status Pelaksanaan PMK
                  </label>
                  <select
                    value={editingParticipant.statusPmk}
                    onChange={(e) =>
                      setEditingParticipant({
                        ...editingParticipant,
                        statusPmk: e.target.value as 'Selesai' | 'On-Going' | 'Terjadwal',
                      })
                    }
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="Selesai">Selesai</option>
                    <option value="On-Going">On-Going</option>
                    <option value="Terjadwal">Terjadwal</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingParticipant(null)}
                  className="px-4 py-2 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 3: KONFIRMASI HAPUS DATA PESERTA (304 TABLE)                    */}
      {/* ===================================================================== */}
      {deletingParticipant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#0c182c] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-[#0c2340] dark:text-white">
                  Hapus Data Sertifikasi Peserta?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Anda yakin ingin menghapus data peserta <strong>{deletingParticipant.namaPegawai}</strong> (NIP: {deletingParticipant.nip}) dari daftar sertifikasi?
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setDeletingParticipant(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteParticipant}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs cursor-pointer"
              >
                Ya, Hapus Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 4: EDIT SERTIFIKAT DIGITAL PEGAWAI                              */}
      {/* ===================================================================== */}
      {editingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#0c182c] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#0c2340] dark:text-white">
                    Edit Sertifikat Digital Pegawai
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Perbarui detail berkas sertifikat digital pada repositori
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingCert(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedCert} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    NIP Pegawai
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCert.nip}
                    onChange={(e) => setEditingCert({ ...editingCert, nip: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Nama Penerima
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCert.recipientName}
                    onChange={(e) => setEditingCert({ ...editingCert, recipientName: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Unit Kerja
                </label>
                <select
                  value={editingCert.unitKerja}
                  onChange={(e) => setEditingCert({ ...editingCert, unitKerja: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  {UNIT_KERJA_LIST.filter((u) => u !== 'Semua').map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Judul Program Pelatihan / Sertifikasi
                </label>
                <input
                  type="text"
                  required
                  value={editingCert.programTitle}
                  onChange={(e) => setEditingCert({ ...editingCert, programTitle: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Jenis Standarisasi
                  </label>
                  <select
                    value={editingCert.certType}
                    onChange={(e) =>
                      setEditingCert({
                        ...editingCert,
                        certType: e.target.value as 'BNSP' | 'ISO 15489' | 'PUR / LSB',
                      })
                    }
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="BNSP">BNSP</option>
                    <option value="ISO 15489">ISO 15489</option>
                    <option value="PUR / LSB">PUR / LSB</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Nomor Sertifikat
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCert.certNumber}
                    onChange={(e) => setEditingCert({ ...editingCert, certNumber: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Status Verifikasi
                  </label>
                  <select
                    value={editingCert.status}
                    onChange={(e) =>
                      setEditingCert({
                        ...editingCert,
                        status: e.target.value as 'Terverifikasi' | 'Menunggu Verifikasi',
                      })
                    }
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="Terverifikasi">Terverifikasi</option>
                    <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingCert(null)}
                  className="px-4 py-2 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 5: KONFIRMASI HAPUS SERTIFIKAT DIGITAL                          */}
      {/* ===================================================================== */}
      {deletingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#0c182c] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-[#0c2340] dark:text-white">
                  Hapus Berkas Sertifikat Digital?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Anda yakin ingin menghapus sertifikat digital <strong>{deletingCert.programTitle}</strong> milik <strong>{deletingCert.recipientName}</strong>?
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setDeletingCert(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteCert}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs cursor-pointer"
              >
                Ya, Hapus Sertifikat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 6: UPLOAD / TERBITKAN SERTIFIKAT DIGITAL BARU                   */}
      {/* ===================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#0c182c] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#0c2340] dark:text-white">
                    {modalType === 'admin_issue' ? 'Terbitkan Sertifikat Digital Pegawai' : 'Unggah Bukti Sertifikat Pelatihan'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {modalType === 'admin_issue' ? 'Penerbitan akreditasi resmi BI Jatim' : 'Kirimkan berkas bukti kompetensi Anda untuk diverifikasi'}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitCert} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    NIP Pegawai
                  </label>
                  <input
                    type="text"
                    required
                    value={recipientNip}
                    onChange={(e) => setRecipientNip(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Nama Penerima
                  </label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Unit Kerja
                </label>
                <select
                  value={recipientUnit}
                  onChange={(e) => setRecipientUnit(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  {UNIT_KERJA_LIST.filter(u => u !== 'Semua').map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Judul Program Pelatihan / Sertifikasi
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sertifikasi Pengelolaan Uang Rupiah (BNSP)"
                  value={programTitle}
                  onChange={(e) => setProgramTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Jenis Standarisasi
                  </label>
                  <select
                    value={certType}
                    onChange={(e) => setCertType(e.target.value as 'BNSP' | 'ISO 15489' | 'PUR / LSB')}
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="BNSP">BNSP Nasional</option>
                    <option value="ISO 15489">ISO 15489 Kearsipan</option>
                    <option value="PUR / LSB">PUR / LSB Kasir Perbankan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Nomor Sertifikat
                  </label>
                  <input
                    type="text"
                    required
                    value={certNumber}
                    onChange={(e) => setCertNumber(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>
              </div>

              {/* Upload file mockup */}
              <div className="border border-dashed border-slate-200 dark:border-slate-700 p-3 rounded-xl text-center">
                <FileText className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                <span className="text-xs text-slate-500">Pilih berkas sertifikat digital (PDF, PNG, JPG)</span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs cursor-pointer"
                >
                  {modalType === 'admin_issue' ? 'Terbitkan Sertifikat' : 'Unggah Sertifikat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
