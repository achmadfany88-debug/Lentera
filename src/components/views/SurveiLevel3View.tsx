import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Edit,
  Star, 
  Send, 
  FileText, 
  Sparkles, 
  AlertCircle,
  AlertTriangle,
  HelpCircle,
  Check,
  ChevronRight,
  ArrowLeft,
  X
} from 'lucide-react';
import { User, SurveyLevel3Form, SurveyQuestion } from '../../types';
import { dataRepo, UNIT_KERJA_LIST } from '../../services/dataService';

interface SurveiLevel3ViewProps {
  currentUser: User;
}

export const SurveiLevel3View: React.FC<SurveiLevel3ViewProps> = ({ currentUser }) => {
  const isAdmin = currentUser.role === 'Admin' || currentUser.role === 'Super Admin';
  const [surveys, setSurveys] = useState<SurveyLevel3Form[]>(() => dataRepo.getSurveys());
  const [activeSurveyToFill, setActiveSurveyToFill] = useState<SurveyLevel3Form | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [surveyToEdit, setSurveyToEdit] = useState<SurveyLevel3Form | null>(null);
  const [surveyToDelete, setSurveyToDelete] = useState<SurveyLevel3Form | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State for User Response
  const [respondentNip, setRespondentNip] = useState(currentUser.nip || '');
  const [respondentName, setRespondentName] = useState(currentUser.fullName || '');
  const [respondentUnit, setRespondentUnit] = useState(currentUser.unitKerja || UNIT_KERJA_LIST[1]);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State for Admin Survey Creator
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newProgram, setNewProgram] = useState('Literasi CBP Rupiah & Edukasi Publik');
  const [newUnit, setNewUnit] = useState('Semua');
  const [newQuestions, setNewQuestions] = useState<SurveyQuestion[]>([
    {
      id: 'q1',
      questionText: 'Sejauh mana Anda menerapkan materi pelatihan dalam prosedur tugas harian Anda?',
      type: 'scale'
    },
    {
      id: 'q2',
      questionText: 'Tingkat pengurangan deviasi atau kesalahan kerja setelah mengikuti program ini:',
      type: 'scale'
    },
    {
      id: 'q3',
      questionText: 'Seberapa besar dukungan atasan langsung dalam mengimplementasikan ide perbaikan kerja?',
      type: 'scale'
    },
    {
      id: 'q4',
      questionText: 'Uraikan kendala atau saran tindak lanjut perbaikan implementasi di unit kerja Anda:',
      type: 'text'
    }
  ]);

  // Form State for Editing Survey
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editProgram, setEditProgram] = useState('');
  const [editUnit, setEditUnit] = useState('Semua');
  const [editQuestions, setEditQuestions] = useState<SurveyQuestion[]>([]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddQuestion = (type: 'scale' | 'text', isEdit = false) => {
    const newQ: SurveyQuestion = {
      id: `q_${Date.now()}`,
      questionText: type === 'scale' 
        ? 'Evaluasi efektivitas dan dampak kompetensi kerja baru (skala 1 - 5):' 
        : 'Berikan uraian deskriptif pelaksanaan di lapangan:',
      type
    };

    if (isEdit) {
      setEditQuestions([...editQuestions, newQ]);
    } else {
      setNewQuestions([...newQuestions, newQ]);
    }
  };

  const handleRemoveQuestion = (idx: number, isEdit = false) => {
    if (isEdit) {
      if (editQuestions.length <= 1) {
        alert('Survei harus memiliki minimal 1 pertanyaan');
        return;
      }
      setEditQuestions(editQuestions.filter((_, i) => i !== idx));
    } else {
      if (newQuestions.length <= 1) {
        alert('Survei harus memiliki minimal 1 pertanyaan');
        return;
      }
      setNewQuestions(newQuestions.filter((_, i) => i !== idx));
    }
  };

  const handleCreateSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert('Judul survei tidak boleh kosong');
      return;
    }

    const created = dataRepo.addSurvey({
      title: newTitle.trim(),
      description: newDesc.trim() || 'Evaluasi penerapan perilaku kerja nyata pasca pelatihan sesuai Kirkpatrick Level 3 Framework.',
      targetProgram: newProgram,
      targetUnit: newUnit,
      isPublished: true,
      publishedBy: currentUser.fullName || currentUser.username,
      questions: newQuestions,
    });

    setSurveys(dataRepo.getSurveys());
    setIsCreateModalOpen(false);
    showToast(`Instrumen survei "${created.title}" berhasil dipublikasikan.`);
    setNewTitle('');
    setNewDesc('');
  };

  const handleOpenEditSurvey = (survey: SurveyLevel3Form) => {
    setSurveyToEdit(survey);
    setEditTitle(survey.title);
    setEditDesc(survey.description);
    setEditProgram(survey.targetProgram);
    setEditUnit(survey.targetUnit);
    setEditQuestions([...survey.questions]);
  };

  const handleSaveEditSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!surveyToEdit) return;

    const updated: SurveyLevel3Form = {
      ...surveyToEdit,
      title: editTitle.trim(),
      description: editDesc.trim(),
      targetProgram: editProgram.trim(),
      targetUnit: editUnit,
      questions: editQuestions,
    };

    dataRepo.updateSurvey(updated, currentUser.fullName || currentUser.username);
    setSurveys(dataRepo.getSurveys());
    setSurveyToEdit(null);
    showToast(`Instrumen survei "${updated.title}" berhasil diperbarui.`);
  };

  const handleConfirmDeleteSurvey = () => {
    if (!surveyToDelete) return;
    const title = surveyToDelete.title;
    dataRepo.deleteSurvey(surveyToDelete.id);
    setSurveys(dataRepo.getSurveys());
    setSurveyToDelete(null);
    showToast(`Survei "${title}" telah dihapus.`);
  };

  const handleStartFillSurvey = (survey: SurveyLevel3Form) => {
    setActiveSurveyToFill(survey);
    const initialAnswers: Record<string, number | string> = {};
    survey.questions.forEach(q => {
      if (q.type === 'scale') initialAnswers[q.id] = 5;
      else initialAnswers[q.id] = '';
    });
    setAnswers(initialAnswers);
  };

  const handleSubmitResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSurveyToFill) return;

    if (!respondentNip.trim() || !respondentName.trim()) {
      alert('Mohon lengkapi NIP dan Nama Pegawai.');
      return;
    }

    setIsSubmitting(true);

    const scaleValues: number[] = [];
    activeSurveyToFill.questions.forEach(q => {
      if (q.type === 'scale' && typeof answers[q.id] === 'number') {
        scaleValues.push(answers[q.id] as number);
      }
    });

    const average = scaleValues.length > 0 
      ? Math.round((scaleValues.reduce((a, b) => a + b, 0) / scaleValues.length) * 100) / 100 
      : 4.5;

    dataRepo.submitSurveyResponse({
      surveyId: activeSurveyToFill.id,
      participantNip: respondentNip.trim(),
      participantName: respondentName.trim(),
      unitKerja: respondentUnit,
      answers,
      averageScore: average,
    });

    setIsSubmitting(false);
    setActiveSurveyToFill(null);
    setSurveys(dataRepo.getSurveys());
    showToast('Terima kasih! Tanggapan survei evaluasi Anda telah berhasil direkam.');
  };

  // If user is currently filling a survey
  if (activeSurveyToFill) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-12">
        <button
          type="button"
          onClick={() => setActiveSurveyToFill(null)}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-sky-600 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Survei</span>
        </button>

        <div className="bg-gradient-to-r from-[#0f1c3f] to-[#1e3a8a] text-white p-7 rounded-2xl shadow-md border-t-4 border-emerald-400">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2">
            <ClipboardCheck className="w-4 h-4" />
            <span>Kuesioner Evaluasi Kirkpatrick Level 3 (Behavior)</span>
          </div>
          <h1 className="text-2xl font-black">{activeSurveyToFill.title}</h1>
          <p className="text-xs text-slate-200 mt-2 leading-relaxed">
            {activeSurveyToFill.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-slate-300">
            <span className="px-2.5 py-1 rounded bg-white/10 backdrop-blur-xs">Program: {activeSurveyToFill.targetProgram}</span>
            <span className="px-2.5 py-1 rounded bg-white/10 backdrop-blur-xs">Sasaran Unit: {activeSurveyToFill.targetUnit}</span>
          </div>
        </div>

        <form onSubmit={handleSubmitResponse} className="space-y-5">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-400 text-xs flex items-center justify-center font-bold">1</span>
              <span>Identitas Responden Pegawai</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  NIP Pegawai <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={respondentNip}
                  onChange={(e) => setRespondentNip(e.target.value)}
                  placeholder="19920101-201502-1-001"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Lengkap <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={respondentName}
                  onChange={(e) => setRespondentName(e.target.value)}
                  placeholder="Nama Lengkap Pegawai"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Unit Kerja
                </label>
                <select
                  value={respondentUnit}
                  onChange={(e) => setRespondentUnit(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {UNIT_KERJA_LIST.filter(u => u !== 'Semua').map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {activeSurveyToFill.questions.map((q, idx) => (
            <div key={q.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  <span className="text-sky-600 dark:text-sky-400 mr-2">{idx + 1}.</span>
                  {q.questionText}
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                  {q.type === 'scale' ? 'Skala 1 - 5' : 'Esai Uraian'}
                </span>
              </div>

              {q.type === 'scale' ? (
                <div className="pt-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-2 px-1">
                    <span>1 (Sangat Kurang Efektif)</span>
                    <span>3 (Cukup)</span>
                    <span>5 (Sangat Efektif & Berdampak)</span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((val) => {
                      const isSelected = answers[q.id] === val;
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setAnswers({ ...answers, [q.id]: val })}
                          className={`py-3 rounded-xl border text-sm font-extrabold flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                            isSelected
                              ? 'bg-sky-600 border-sky-600 text-white shadow-md'
                              : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span>{val}</span>
                          <span className="text-[10px] font-normal opacity-80">
                            {val === 5 ? 'Sangat Baik' : val === 4 ? 'Baik' : val === 3 ? 'Cukup' : val === 2 ? 'Kurang' : 'Buruk'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="pt-2">
                  <textarea
                    rows={3}
                    placeholder="Tuliskan pengalaman nyata, ide tindak lanjut, atau perbaikan implementasi..."
                    value={(answers[q.id] as string) || ''}
                    onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              )}
            </div>
          ))}

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setActiveSurveyToFill(null)}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Mengirim Tanggapan...' : 'Kirim Tanggapan Survei'}</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Standard Overview Page
  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xl border border-slate-700 flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
            Evaluasi Efektivitas Pembelajaran (Kirkpatrick Framework)
          </span>
          <h2 className="text-xl font-extrabold text-[#0f1c3f] dark:text-white mt-1">
            Survei Kirkpatrick Level 3 (Behavior & Implementation)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Pengukuran perubahan perilaku kerja nyata dan implementasi hasil pelatihan di unit kerja masing-masing setelah 3 bulan masa penerapan.
          </p>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Survei Baru</span>
          </button>
        )}
      </div>

      {/* Aggregate KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Instrumen Survei Aktif</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums">{surveys.length} Formulir</div>
          <span className="text-[11px] text-emerald-600 font-medium">Terverifikasi Satker SDM</span>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Total Responden Masuk</span>
          <div className="text-2xl font-extrabold text-sky-600 dark:text-sky-400 mt-1 tabular-nums">
            {surveys.reduce((acc, s) => acc + s.responsesCount, 0)} Pegawai
          </div>
          <span className="text-[11px] text-slate-500">Tercatat di Database</span>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Skor Rata-Rata Agregat</span>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1 tabular-nums">4.68 / 5.00</div>
          <span className="text-[11px] text-emerald-600 font-medium">Kategori: Sangat Baik</span>
        </div>
      </div>

      {/* Surveys List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-sky-600" />
            <span>Daftar Survei Kirkpatrick Level 3 Tersedia</span>
          </h3>
          <span className="text-xs text-slate-400">Pilih survei untuk mengisi evaluasi kerja</span>
        </div>

        {surveys.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 border border-slate-200 dark:border-slate-800 text-center">
            <ClipboardCheck className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">Belum ada survei yang tersedia</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              Saat ini belum ada formulir survei evaluasi Kirkpatrick Level 3 yang dipublikasikan oleh Administrator.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {surveys.map((survey) => (
              <div 
                key={survey.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-sky-300 dark:hover:border-sky-700 transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      Terpublikasi
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {survey.createdAt}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-2">
                    {survey.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {survey.description}
                  </p>

                  <div className="mt-3 py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Target Pelatihan:</span>
                      <span className="font-bold text-slate-700 dark:text-slate-200 truncate max-w-[180px]">{survey.targetProgram}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Jumlah Pertanyaan:</span>
                      <span className="font-bold">{survey.questions.length} Butir Soal</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Responden Terisi:</span>
                      <span className="font-bold text-sky-600 dark:text-sky-400">{survey.responsesCount} Pegawai</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  {/* Admin Tools: Edit & Hapus Survei */}
                  {isAdmin && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditSurvey(survey)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-slate-800 transition cursor-pointer"
                        title="Edit Instrumen Survei"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSurveyToDelete(survey)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition cursor-pointer"
                        title="Hapus Survei"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleStartFillSurvey(survey)}
                    className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
                  >
                    <span>Isi Survei</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Admin Creator Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Buat Instrumen Survei Baru
                  </h3>
                  <p className="text-xs text-slate-500">
                    Hanya dapat dibuat & dipublikasikan oleh Administrator / Super Admin
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSurvey} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Survei <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Evaluasi Perilaku Kerja - Pelatihan Sistem Pembayaran 2026"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Deskripsi & Instruksi Pengerjaan
                </label>
                <textarea
                  rows={2}
                  placeholder="Berikan panduan singkat pengisian bagi pegawai responden..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Sasaran Program PMK
                  </label>
                  <input
                    type="text"
                    value={newProgram}
                    onChange={(e) => setNewProgram(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Sasaran Unit Kerja
                  </label>
                  <select
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {UNIT_KERJA_LIST.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">
                    Daftar Butir Pertanyaan ({newQuestions.length})
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddQuestion('scale')}
                      className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold hover:bg-sky-100 cursor-pointer"
                    >
                      + Skala 1-5
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddQuestion('text')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold hover:bg-emerald-100 cursor-pointer"
                    >
                      + Esai Teks
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {newQuestions.map((q, idx) => (
                    <div key={q.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-2">
                      <span className="font-bold text-sky-600 mt-1">{idx + 1}.</span>
                      <div className="flex-1">
                        <input
                          type="text"
                          required
                          value={q.questionText}
                          onChange={(e) => {
                            const updated = [...newQuestions];
                            updated[idx].questionText = e.target.value;
                            setNewQuestions(updated);
                          }}
                          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 inline-block">
                          Tipe: {q.type === 'scale' ? 'Skala Penilaian 1 - 5' : 'Jawaban Uraian Teks Bebas'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(idx)}
                        className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm cursor-pointer"
                >
                  Publikasikan Survei
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Edit Survey Modal */}
      {surveyToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center justify-center">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Edit Instrumen Survei
                  </h3>
                  <p className="text-xs text-slate-500">ID: {surveyToEdit.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSurveyToEdit(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditSurvey} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Survei
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Deskripsi & Petunjuk
                </label>
                <textarea
                  rows={2}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Sasaran Program PMK
                  </label>
                  <input
                    type="text"
                    value={editProgram}
                    onChange={(e) => setEditProgram(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Sasaran Unit Kerja
                  </label>
                  <select
                    value={editUnit}
                    onChange={(e) => setEditUnit(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  >
                    {UNIT_KERJA_LIST.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">
                    Butir Pertanyaan ({editQuestions.length})
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddQuestion('scale', true)}
                      className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold hover:bg-sky-100 cursor-pointer"
                    >
                      + Skala 1-5
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddQuestion('text', true)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold hover:bg-emerald-100 cursor-pointer"
                    >
                      + Esai Teks
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {editQuestions.map((q, idx) => (
                    <div key={q.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-2">
                      <span className="font-bold text-sky-600 mt-1">{idx + 1}.</span>
                      <div className="flex-1">
                        <input
                          type="text"
                          required
                          value={q.questionText}
                          onChange={(e) => {
                            const updated = [...editQuestions];
                            updated[idx].questionText = e.target.value;
                            setEditQuestions(updated);
                          }}
                          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 inline-block">
                          Tipe: {q.type === 'scale' ? 'Skala Penilaian 1 - 5' : 'Jawaban Uraian Teks'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(idx, true)}
                        className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSurveyToEdit(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-sm cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-App Delete Confirmation Modal */}
      {surveyToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Hapus Formulir Survei?</h3>
                <p className="text-xs text-slate-500">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              Apakah Anda yakin ingin menghapus survei <strong className="text-slate-900 dark:text-white font-semibold">"{surveyToDelete.title}"</strong>?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSurveyToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteSurvey}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition cursor-pointer"
              >
                Hapus Survei
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
