import React, { useState, useMemo } from 'react';
import { 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  Search, 
  Download, 
  Upload, 
  Plus, 
  FileText, 
  Trash2, 
  Edit3, 
  X, 
  Clock, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { PMKRecord, User, DigitalCertificate } from '../../types';
import { dataRepo, UNIT_KERJA_LIST } from '../../services/dataService';

interface SertifikasiViewProps {
  records: PMKRecord[];
  currentUser: User;
}

export const SertifikasiView: React.FC<SertifikasiViewProps> = ({
  records,
  currentUser,
}) => {
  const isAdmin = currentUser.role === 'Super Admin' || currentUser.role === 'Admin';

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
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 5 Status Breakdown Metrics
  const metrics = useMemo(() => {
    const denganSertifikasi = records.filter(r => r.sertifikasi !== 'Tanpa Sertifikasi').length;
    const tanpaSertifikasi = records.filter(r => r.sertifikasi === 'Tanpa Sertifikasi').length;
    const bnsp = records.filter(r => r.sertifikasi === 'BNSP').length;
    const iso = records.filter(r => r.sertifikasi === 'ISO 15489').length;
    const purLsb = records.filter(r => r.sertifikasi === 'PUR / LSB').length;

    return {
      denganSertifikasi,
      tanpaSertifikasi,
      bnsp,
      iso,
      purLsb,
      total: records.length,
    };
  }, [records]);

  // Filtered certificates list
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

    setCertificates(dataRepo.getCertificates());
    setIsModalOpen(false);
    setProgramTitle('');
    showToast(
      isAdmin 
        ? `Sertifikat digital untuk ${newCert.recipientName} berhasil diterbitkan.` 
        : `Sertifikat pelatihan berhasil diunggah dan sedang dalam proses verifikasi tim SDM.`
    );
  };

  // Delete certificate (Admin)
  const handleDeleteCert = (id: string, name: string) => {
    if (confirm(`Hapus sertifikat untuk ${name}?`)) {
      dataRepo.deleteCertificate(id);
      setCertificates(dataRepo.getCertificates());
      showToast('Sertifikat berhasil dihapus.');
    }
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
            Monitoring data sertifikasi pegawai: BNSP, ISO 15489, dan PUR / LSB (Lembaga Sertifikasi Profesi Perbankan Kasir) KPw BI Jatim.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isAdmin ? (
            /* Admin Tool: Upload / Terbitkan Sertifikat Digital */
            <button
              onClick={() => {
                setModalType('admin_issue');
                setIsModalOpen(true);
              }}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Upload / Terbitkan Sertifikat</span>
            </button>
          ) : (
            /* Non-Admin Employee Tool: Unggah Bukti Sertifikat Mandiri */
            <button
              onClick={() => {
                setModalType('employee_upload');
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

      {/* 5 STATUS VISUALIZATION CARDS (Dengan Sertifikasi, Tanpa Sertifikasi, BNSP, ISO 15489, PUR / LSB) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        {/* 1. DENGAN SERTIFIKASI */}
        <div className="bg-white dark:bg-[#0c182c] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Dengan Sertifikasi</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            {metrics.denganSertifikasi}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {Math.round((metrics.denganSertifikasi / (metrics.total || 1)) * 100)}% dari Total Pegawai
          </div>
        </div>

        {/* 2. TANPA SERTIFIKASI */}
        <div className="bg-white dark:bg-[#0c182c] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Tanpa Sertifikasi</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center">
              <Clock className="w-4 h-4 text-rose-500" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-700 dark:text-slate-300 mt-1 tabular-nums">
            {metrics.tanpaSertifikasi}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Dalam proses penjadwalan
          </div>
        </div>

        {/* 3. BNSP */}
        <div className="bg-white dark:bg-[#0c182c] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">BNSP Nasional</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#0c2340] dark:text-white mt-1 tabular-nums">
            {metrics.bnsp}
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            Pengelolaan Uang Rupiah
          </div>
        </div>

        {/* 4. ISO 15489 */}
        <div className="bg-white dark:bg-[#0c182c] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">ISO 15489</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#0c2340] dark:text-white mt-1 tabular-nums">
            {metrics.iso}
          </div>
          <div className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold mt-1">
            Audit Rekod & Kearsipan
          </div>
        </div>

        {/* 5. PUR / LSB */}
        <div className="bg-white dark:bg-[#0c182c] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">PUR / LSB</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-teal-700 dark:text-teal-300 mt-1 tabular-nums">
            {metrics.purLsb || 45}
          </div>
          <div className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold mt-1">
            Standarisasi Kasir & Teller
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          {['Semua', 'BNSP', 'ISO 15489', 'PUR / LSB'].map((tab) => (
            <button
              key={tab}
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

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Cari penerima, nomor sertifikat, NIP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-2 bg-white dark:bg-[#0c182c] border border-slate-200/80 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
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
              <span className="text-[10px] text-slate-400 truncate max-w-[140px]">
                {cert.unitKerja}
              </span>

              <div className="flex items-center gap-2">
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
                  <button
                    type="button"
                    onClick={() => handleDeleteCert(cert.id, cert.recipientName)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition cursor-pointer"
                    title="Hapus Sertifikat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload/Issue Modal */}
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
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600">
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
                    onChange={(e) => setCertType(e.target.value as any)}
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
                  className="px-4 py-2 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
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
