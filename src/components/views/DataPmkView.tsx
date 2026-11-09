import React, { useState, useEffect, useMemo } from 'react';
import { 
  Database, 
  Calendar, 
  Users, 
  Clock, 
  CheckCircle2, 
  Award, 
  ShieldAlert, 
  FileEdit, 
  Plus, 
  ListOrdered, 
  Sliders, 
  ChevronRight, 
  X, 
  Send, 
  Search, 
  AlertCircle,
  AlertTriangle,
  Eye,
  Trash2,
  Edit
} from 'lucide-react';
import { UpcomingPMKSession, PMKTopicRequest, User, RegisteredParticipant, CertType } from '../../types';
import { dataRepo, UNIT_KERJA_LIST } from '../../services/dataService';

interface DataPmkViewProps {
  currentUser: User;
}

export const DataPmkView: React.FC<DataPmkViewProps> = ({ currentUser }) => {
  const isAdmin = currentUser.role === 'Super Admin' || currentUser.role === 'Admin';

  const [sessions, setSessions] = useState<UpcomingPMKSession[]>(() => dataRepo.getUpcomingSessions());
  const [topicRequests, setTopicRequests] = useState<PMKTopicRequest[]>(() => dataRepo.getTopicRequests());
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Countdown timer state (updates every second)
  const [currentTime, setCurrentTime] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Modal States
  const [viewParticipantsSession, setViewParticipantsSession] = useState<UpcomingPMKSession | null>(null);
  const [limitModalSession, setLimitModalSession] = useState<UpcomingPMKSession | null>(null);
  const [newLimitValue, setNewLimitValue] = useState(25);

  // Session Edit & Delete Modal States
  const [sessionToEdit, setSessionToEdit] = useState<UpcomingPMKSession | null>(null);
  const [sessionToDelete, setSessionToDelete] = useState<UpcomingPMKSession | null>(null);
  const [isAddSessionModalOpen, setIsAddSessionModalOpen] = useState(false);

  // Edit Session Form fields
  const [editTopicTitle, setEditTopicTitle] = useState('');
  const [editBatchNumber, setEditBatchNumber] = useState(1);
  const [editCertType, setEditCertType] = useState<'BNSP' | 'ISO 15489' | 'PUR / LSB' | 'Tanpa Sertifikasi'>('BNSP');
  const [editExecutionDate, setEditExecutionDate] = useState('');
  const [editExecutionTime, setEditExecutionTime] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editTrainerName, setEditTrainerName] = useState('');
  const [editMaxParticipants, setEditMaxParticipants] = useState(30);
  const [editDeadline, setEditDeadline] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Add Session Form fields
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newBatchNumber, setNewBatchNumber] = useState(202616);
  const [newCertType, setNewCertType] = useState<'BNSP' | 'ISO 15489' | 'PUR / LSB' | 'Tanpa Sertifikasi'>('BNSP');
  const [newExecutionDate, setNewExecutionDate] = useState('2026-12-10');
  const [newExecutionTime, setNewExecutionTime] = useState('08:30 - 16:00 WIB');
  const [newLocation, setNewLocation] = useState('Auditorium KPw Bank Indonesia Provinsi Jawa Timur');
  const [newTrainerName, setNewTrainerName] = useState('Tim Fasilitator BINS');
  const [newMaxParticipants, setNewMaxParticipants] = useState(30);
  const [newDeadline, setNewDeadline] = useState('2026-12-08T23:59:59Z');
  const [newDescription, setNewDescription] = useState('Sesi pelatihan kompetensi dan sertifikasi pegawai.');

  // Topic Request Form Modal (for non-admin employees)
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestTopicTitle, setRequestTopicTitle] = useState('');
  const [requestRationale, setRequestRationale] = useState('');
  const [requestCompetency, setRequestCompetency] = useState('Teknis Kebanksentralan');

  // Topic Requests List Modal ("Data Request")
  const [isRequestsListOpen, setIsRequestsListOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Live countdown calculation helper
  const calculateCountdown = (deadlineIso: string) => {
    const diff = new Date(deadlineIso).getTime() - currentTime;
    if (diff <= 0) {
      return { expired: true, text: 'Pendaftaran Ditutup' };
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return {
      expired: false,
      days,
      hours,
      minutes,
      seconds,
      text: `${days}h ${hours}j ${minutes}m ${seconds}d`,
    };
  };

  // Register Current User to PMK Session
  const handleRegisterSession = (session: UpcomingPMKSession) => {
    const defaultUnit = currentUser.unitKerja === 'BI Jatim' ? 'Unit Logistik, SDM, Sekre, Protokol, dan Pengamanan' : currentUser.unitKerja;
    const res = dataRepo.registerToPMKSession(session.id, {
      nip: currentUser.nip,
      fullName: currentUser.fullName,
      unitKerja: defaultUnit,
      email: currentUser.email,
    });

    if (res.success) {
      const updatedList = [...dataRepo.getUpcomingSessions()];
      setSessions(updatedList);
      if (viewParticipantsSession && viewParticipantsSession.id === session.id) {
        const refreshed = updatedList.find(x => x.id === session.id) || null;
        setViewParticipantsSession(refreshed);
      }
      showToast(res.message);
    } else {
      showToast(res.message);
    }
  };

  // Cancel Registration from PMK Session
  const handleCancelRegistration = (sessionId: string, targetNip: string) => {
    const res = dataRepo.cancelPMKRegistration(sessionId, targetNip, currentUser.fullName);
    if (res.success) {
      const updatedList = [...dataRepo.getUpcomingSessions()];
      setSessions(updatedList);
      if (viewParticipantsSession && viewParticipantsSession.id === sessionId) {
        const refreshed = updatedList.find(x => x.id === sessionId) || null;
        setViewParticipantsSession(refreshed);
      }
      showToast(res.message);
    } else {
      showToast(res.message);
    }
  };

  // Admin Tool: Update Limit of Participants
  const handleSaveLimit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!limitModalSession) return;

    dataRepo.updateSessionLimit(limitModalSession.id, newLimitValue, currentUser.fullName);
    setSessions([...dataRepo.getUpcomingSessions()]);
    setLimitModalSession(null);
    showToast(`Limit peserta berhasil diubah menjadi ${newLimitValue} orang.`);
  };

  // Open Edit Session Modal
  const handleOpenEditSession = (session: UpcomingPMKSession) => {
    setSessionToEdit(session);
    setEditTopicTitle(session.topicTitle);
    setEditBatchNumber(session.batchNumber);
    setEditCertType(session.certType);
    setEditExecutionDate(session.executionDate);
    setEditExecutionTime(session.executionTime);
    setEditLocation(session.location);
    setEditTrainerName(session.trainerName);
    setEditMaxParticipants(session.maxParticipants);
    setEditDeadline(session.registrationDeadline);
    setEditDescription(session.description || '');
  };

  // Save Edit Session
  const handleSaveEditSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionToEdit) return;

    const updated: UpcomingPMKSession = {
      ...sessionToEdit,
      topicTitle: editTopicTitle.trim(),
      batchNumber: Number(editBatchNumber),
      certType: editCertType,
      executionDate: editExecutionDate,
      executionTime: editExecutionTime,
      location: editLocation,
      trainerName: editTrainerName,
      maxParticipants: Number(editMaxParticipants),
      registrationDeadline: editDeadline,
      description: editDescription,
      status: sessionToEdit.registeredParticipants.length >= Number(editMaxParticipants) ? 'Full' : 'Open',
    };

    dataRepo.updateUpcomingSession(updated, currentUser.fullName || currentUser.username);
    setSessions([...dataRepo.getUpcomingSessions()]);
    setSessionToEdit(null);
    showToast(`Sesi "${updated.topicTitle}" berhasil diperbarui.`);
  };

  // Confirm In-App Delete Session
  const handleConfirmDeleteSession = () => {
    if (!sessionToDelete) return;
    const title = sessionToDelete.topicTitle;
    dataRepo.deleteUpcomingSession(sessionToDelete.id, currentUser.fullName || currentUser.username);
    setSessions([...dataRepo.getUpcomingSessions()]);
    setSessionToDelete(null);
    showToast(`Sesi "${title}" telah dihapus.`);
  };

  // Handle Add New Session
  const handleAddSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSession: UpcomingPMKSession = {
      id: `SESS-${Date.now()}`,
      topicTitle: newTopicTitle.trim(),
      batchNumber: Number(newBatchNumber),
      certType: newCertType,
      executionDate: newExecutionDate,
      executionTime: newExecutionTime,
      location: newLocation,
      trainerName: newTrainerName,
      maxParticipants: Number(newMaxParticipants),
      registeredParticipants: [],
      registrationDeadline: newDeadline,
      description: newDescription,
      status: 'Open',
    };

    dataRepo.getUpcomingSessions().unshift(newSession);
    dataRepo.saveUpcomingSessions();
    setSessions([...dataRepo.getUpcomingSessions()]);
    setIsAddSessionModalOpen(false);
    showToast(`Sesi baru "${newSession.topicTitle}" berhasil ditambahkan.`);
  };

  // Non-Admin: Submit Topic Request
  const handleSubmitTopicRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestTopicTitle.trim()) return;

    dataRepo.addTopicRequest({
      topicTitle: requestTopicTitle.trim(),
      rationale: requestRationale.trim() || 'Peningkatan efisiensi proses kerja di satuan kerja.',
      targetCompetency: requestCompetency,
      proposedByNip: currentUser.nip,
      proposedByName: currentUser.fullName,
      unitKerja: currentUser.unitKerja,
    });

    setTopicRequests([...dataRepo.getTopicRequests()]);
    setIsRequestModalOpen(false);
    setRequestTopicTitle('');
    setRequestRationale('');
    showToast('Usulan topik PMK berhasil dikirim ke Satker SDM.');
  };

  // Admin: Update Topic Request Status
  const handleUpdateStatus = (id: string, status: 'Menunggu Review' | 'Disetujui' | 'Dijadwalkan') => {
    dataRepo.updateTopicRequestStatus(id, status);
    setTopicRequests([...dataRepo.getTopicRequests()]);
    showToast(`Status usulan diperbarui menjadi ${status}.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-2xl border border-emerald-500 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white dark:bg-[#0c182c] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Jadwal Sesi Pelatihan Terverifikasi
            </span>
            <span className="text-slate-300 dark:text-slate-700">&bull;</span>
            <span className="text-[10.5px] font-semibold text-slate-400">15 Batch Mendatang</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#0c2340] dark:text-white mt-1">
            Data PMK & Sesi Pelatihan Terjadwal (15 Sesi Terbuka)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Pendaftaran mandiri sesi pembelajaran PMK, batas waktu registrasi hitung mundur real-time, verifikasi kuota, dan repositori usulan topik pegawai.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          
          {/* Admin: Tambah Sesi PMK Baru */}
          {isAdmin && (
            <button
              onClick={() => setIsAddSessionModalOpen(true)}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Sesi PMK</span>
            </button>
          )}

          {/* Tombol Data Request */}
          <button
            onClick={() => setIsRequestsListOpen(true)}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs transition cursor-pointer"
          >
            <ListOrdered className="w-4 h-4 text-sky-600" />
            <span>Data Request ({topicRequests.length})</span>
          </button>

          {/* Tombol Request Topik PMK (Hanya untuk akun selain Admin/Super Admin) */}
          {!isAdmin && (
            <button
              onClick={() => setIsRequestModalOpen(true)}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Request Topik PMK Baru</span>
            </button>
          )}

        </div>
      </div>

      {/* 15 SESSIONS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sessions.slice(0, 15).map((s, idx) => {
          const countdown = calculateCountdown(s.registrationDeadline);
          const isUserRegistered = s.registeredParticipants.some(p => p.nip === currentUser.nip);
          const isFull = s.registeredParticipants.length >= s.maxParticipants;
          const percentageFilled = Math.min(100, Math.round((s.registeredParticipants.length / s.maxParticipants) * 100));

          return (
            <div 
              key={s.id}
              className="bg-white dark:bg-[#0c182c] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-emerald-500/40 transition"
            >
              <div>
                {/* Header: Batch & Cert Badge */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <span className="font-mono text-[10.5px] font-bold text-slate-400">
                    Sesi #{idx + 1} &bull; Batch {s.batchNumber}
                  </span>
                  
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                    s.certType === 'BNSP'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
                      : s.certType === 'ISO 15489'
                      ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200'
                      : s.certType === 'PUR / LSB'
                      ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                  }`}>
                    {s.certType}
                  </span>
                </div>

                {/* Topic Title */}
                <h3 className="font-extrabold text-sm text-[#0c2340] dark:text-white leading-snug line-clamp-2">
                  {s.topicTitle}
                </h3>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                  Instruktur: <strong className="text-slate-700 dark:text-slate-300">{s.trainerName}</strong>
                </div>

                {/* Schedule & Location */}
                <div className="mt-3 space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{s.executionDate} &bull; {s.executionTime}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-1">
                    Lokasi: {s.location}
                  </div>
                </div>

                {/* Countdown Live Timer */}
                <div className="mt-3.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-[10.5px]">
                    <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold uppercase">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Sisa Waktu Registrasi:</span>
                    </div>
                    <span className={`font-mono font-bold text-[10px] ${countdown.expired ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {countdown.expired ? 'DITUTUP' : 'DIBUKA'}
                    </span>
                  </div>

                  <div className="mt-1.5 text-center">
                    {countdown.expired ? (
                      <span className="text-xs font-bold text-rose-500">Waktu Pendaftaran Telah Berakhir</span>
                    ) : (
                      <span className="font-mono text-xs font-black tracking-widest text-[#0c2340] dark:text-white flex items-center justify-center gap-1">
                        <span className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 shadow-xs border">{countdown.days}h</span>
                        <span>:</span>
                        <span className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 shadow-xs border">{countdown.hours}j</span>
                        <span>:</span>
                        <span className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 shadow-xs border">{countdown.minutes}m</span>
                        <span>:</span>
                        <span className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 shadow-xs border">{countdown.seconds}d</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Quota & Participants Counter */}
                <div className="mt-3">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-slate-500 font-medium">Kapasitas Peserta:</span>
                    <span className="font-bold text-[#0c2340] dark:text-white font-mono">
                      {s.registeredParticipants.length} / {s.maxParticipants} Peserta
                    </span>
                  </div>
                  
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        percentageFilled >= 90 ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${percentageFilled}%` }}
                    />
                  </div>
                </div>

              </div>

              {/* Action Buttons Row */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                
                {/* View Participants Popup Button */}
                <button
                  type="button"
                  onClick={() => setViewParticipantsSession(s)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 text-sky-600" />
                  <span>Daftar Peserta</span>
                </button>

                <div className="flex items-center gap-1">
                  
                  {/* Admin Tools: Limit Quota, Edit, Hapus */}
                  {isAdmin && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setLimitModalSession(s);
                          setNewLimitValue(s.maxParticipants);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                        title="Atur Limit Kuota Peserta"
                      >
                        <Sliders className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEditSession(s)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                        title="Edit Sesi PMK"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setSessionToDelete(s)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition cursor-pointer"
                        title="Hapus Sesi PMK"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {/* Register / Cancel Button */}
                  {isUserRegistered ? (
                    <button
                      type="button"
                      onClick={() => handleCancelRegistration(s.id, currentUser.nip)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-600 dark:hover:text-white"
                      title="Klik untuk membatalkan pendaftaran PMK"
                    >
                      Batal Daftar
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isFull || countdown.expired}
                      onClick={() => handleRegisterSession(s)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
                        isFull || countdown.expired
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {isFull ? 'Penuh' : 'Daftar PMK'}
                    </button>
                  )}
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* POPUP 1: Scrollable Participants List */}
      {viewParticipantsSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#0c182c] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#0c2340] dark:text-white">Daftar Peserta Terdaftar</h3>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{viewParticipantsSession.topicTitle}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewParticipantsSession(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-2 flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300 shrink-0">
              <span>Total Peserta: {viewParticipantsSession.registeredParticipants.length} Orang</span>
              <span className="text-emerald-600 font-mono">Batas: {viewParticipantsSession.maxParticipants}</span>
            </div>

            <div className="overflow-y-auto space-y-2.5 pr-1 flex-1">
              {viewParticipantsSession.registeredParticipants.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  Belum ada peserta yang mendaftar pada sesi ini.
                </div>
              ) : (
                viewParticipantsSession.registeredParticipants.map((p, idx) => {
                  const canCancelParticipant = p.nip === currentUser.nip || isAdmin;
                  return (
                    <div key={p.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="text-slate-400 text-[10px] font-mono">{idx + 1}.</span>
                          <span className="truncate">{p.namaPegawai}</span>
                          {p.nip === currentUser.nip && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[9px] font-extrabold">
                              Anda
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Asal Unit Kerja:</span>
                          <span className="truncate">{p.unitKerja}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-md bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-300 text-[10px] font-bold border border-slate-200 dark:border-slate-700">
                          {p.unitKerja}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-slate-400">{p.registeredAt}</span>
                          {canCancelParticipant && (
                            <button
                              type="button"
                              onClick={() => handleCancelRegistration(viewParticipantsSession.id, p.nip)}
                              className="px-2 py-0.5 rounded bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 text-[10px] font-bold transition cursor-pointer"
                            >
                              Batalkan
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setViewParticipantsSession(null)}
                className="px-4 py-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP 2: Admin Quota Limiter */}
      {limitModalSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-[#0c182c] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#0c2340] dark:text-white">Batasi Limit Peserta</h3>
                  <p className="text-[10px] text-slate-400">Khusus Super Admin & Admin</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLimitModalSession(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLimit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Maksimal Peserta Batch {limitModalSession.batchNumber}
                </label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={newLimitValue}
                  onChange={(e) => setNewLimitValue(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setLimitModalSession(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs"
                >
                  Simpan Limit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP 3: Admin Edit Sesi PMK Modal */}
      {sessionToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white dark:bg-[#0c182c] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 flex items-center justify-center">
                  <Edit className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#0c2340] dark:text-white">Edit Sesi PMK</h3>
                  <p className="text-[10px] text-slate-400">ID: {sessionToEdit.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSessionToEdit(null)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditSession} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Topik Pelatihan PMK <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editTopicTitle}
                  onChange={(e) => setEditTopicTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    No. Batch
                  </label>
                  <input
                    type="number"
                    value={editBatchNumber}
                    onChange={(e) => setEditBatchNumber(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Jenis Sertifikasi
                  </label>
                  <select
                    value={editCertType}
                    onChange={(e) => setEditCertType(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  >
                    <option value="BNSP">BNSP</option>
                    <option value="ISO 15489">ISO 15489</option>
                    <option value="PUR / LSB">PUR / LSB</option>
                    <option value="Tanpa Sertifikasi">Tanpa Sertifikasi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tanggal Pelaksanaan
                  </label>
                  <input
                    type="date"
                    value={editExecutionDate}
                    onChange={(e) => setEditExecutionDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Waktu Pelaksanaan
                  </label>
                  <input
                    type="text"
                    value={editExecutionTime}
                    onChange={(e) => setEditExecutionTime(e.target.value)}
                    placeholder="08:30 - 16:00 WIB"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Instruktur / Trainer
                  </label>
                  <input
                    type="text"
                    value={editTrainerName}
                    onChange={(e) => setEditTrainerName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kapasitas Maksimal Peserta
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={editMaxParticipants}
                    onChange={(e) => setEditMaxParticipants(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Lokasi Pelatihan
                </label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSessionToEdit(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-xs cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP 4: In-App Delete Sesi PMK Confirmation */}
      {sessionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-[#0c182c] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Hapus Sesi PMK?</h3>
                <p className="text-xs text-slate-500">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              Apakah Anda yakin ingin menghapus sesi <strong className="text-slate-900 dark:text-white font-semibold">"{sessionToDelete.topicTitle}"</strong> (Batch {sessionToDelete.batchNumber})?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSessionToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteSession}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition cursor-pointer"
              >
                Hapus Sesi PMK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP 5: Admin Add New Sesi PMK Modal */}
      {isAddSessionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white dark:bg-[#0c182c] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#0c2340] dark:text-white">Tambah Sesi PMK Baru</h3>
                  <p className="text-[10px] text-slate-400">Khusus Super Admin & Admin</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddSessionModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSessionSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Topik Pelatihan PMK <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Masterclass Keamanan Informasi & Cyber Defense"
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    No. Batch
                  </label>
                  <input
                    type="number"
                    value={newBatchNumber}
                    onChange={(e) => setNewBatchNumber(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Jenis Sertifikasi
                  </label>
                  <select
                    value={newCertType}
                    onChange={(e) => setNewCertType(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  >
                    <option value="BNSP">BNSP</option>
                    <option value="ISO 15489">ISO 15489</option>
                    <option value="PUR / LSB">PUR / LSB</option>
                    <option value="Tanpa Sertifikasi">Tanpa Sertifikasi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tanggal Pelaksanaan
                  </label>
                  <input
                    type="date"
                    value={newExecutionDate}
                    onChange={(e) => setNewExecutionDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Waktu Pelaksanaan
                  </label>
                  <input
                    type="text"
                    value={newExecutionTime}
                    onChange={(e) => setNewExecutionTime(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Instruktur / Trainer
                  </label>
                  <input
                    type="text"
                    value={newTrainerName}
                    onChange={(e) => setNewTrainerName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kapasitas Maksimal Peserta
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={newMaxParticipants}
                    onChange={(e) => setNewMaxParticipants(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Lokasi Pelatihan
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddSessionModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs cursor-pointer"
                >
                  Tambahkan Sesi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP 6: Non-Admin Request Topik Form Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#0c182c] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                  <FileEdit className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#0c2340] dark:text-white">Form Usulan Topik PMK</h3>
                  <p className="text-[10px] text-slate-400">Usulan diteruskan ke Satker SDM BI Jatim</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRequestModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitTopicRequest} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Topik yang Diusulkan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Workshop Analisis Makroprudensial & KEKDA 2026"
                  value={requestTopicTitle}
                  onChange={(e) => setRequestTopicTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Bidang Kompetensi
                </label>
                <select
                  value={requestCompetency}
                  onChange={(e) => setRequestCompetency(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                >
                  <option value="Teknis Kebanksentralan">Teknis Kebanksentralan</option>
                  <option value="Sistem Pembayaran & QRIS">Sistem Pembayaran & QRIS</option>
                  <option value="Manajemen Kas & CBP Rupiah">Manajemen Kas & CBP Rupiah</option>
                  <option value="Kearsipan ISO 15489">Kearsipan ISO 15489</option>
                  <option value="Ekonomi & Inflasi Daerah">Ekonomi & Inflasi Daerah</option>
                  <option value="Data Analytics & IT">Data Analytics & IT</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Urgensi & Kebutuhan Tugas Harian
                </label>
                <textarea
                  rows={3}
                  placeholder="Uraikan bagaimana topik ini menunjang efektivitas dan produktivitas di unit kerja Anda..."
                  value={requestRationale}
                  onChange={(e) => setRequestRationale(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Usulan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP 7: Topic Requests Drawer ("Data Request") */}
      {isRequestsListOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white dark:bg-[#0c182c] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 flex items-center justify-center">
                  <ListOrdered className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#0c2340] dark:text-white">Daftar Usulan Topik PMK Pegawai</h3>
                  <p className="text-[10px] text-slate-400">Total {topicRequests.length} usulan topik tersimpan</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRequestsListOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 pr-1 py-3 flex-1">
              {topicRequests.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-400">
                  Belum ada usulan topik yang diajukan.
                </div>
              ) : (
                topicRequests.map((req) => (
                  <div key={req.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-xs text-[#0c2340] dark:text-white">{req.topicTitle}</h4>
                        <div className="text-[10.5px] text-slate-400 mt-0.5">
                          Diusulkan oleh: <strong className="text-slate-700 dark:text-slate-300">{req.proposedByName}</strong> ({req.unitKerja}) &bull; {req.submittedAt}
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 border ${
                        req.status === 'Disetujui'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : req.status === 'Dijadwalkan'
                          ? 'bg-sky-50 text-sky-700 border-sky-300'
                          : 'bg-amber-50 text-amber-700 border-amber-300'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      <strong>Kebutuhan Kompetensi:</strong> {req.rationale}
                    </p>

                    {isAdmin && (
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Status Persetujuan:</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(req.id, 'Disetujui')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold hover:bg-emerald-100 text-[11px] cursor-pointer"
                        >
                          Setujui
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(req.id, 'Dijadwalkan')}
                          className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 font-bold hover:bg-sky-100 text-[11px] cursor-pointer"
                        >
                          Jadwalkan ke Batch
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setIsRequestsListOpen(false)}
                className="px-4 py-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl cursor-pointer"
              >
                Tutup Halaman Request
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
