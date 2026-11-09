import React, { useState } from 'react';
import { 
  GraduationCap, 
  PlayCircle, 
  BookOpen, 
  Clock, 
  Award, 
  Star, 
  CheckCircle, 
  Search, 
  Plus, 
  Trash2, 
  Edit,
  ArrowLeft,
  Check, 
  Sparkles, 
  HelpCircle,
  Video,
  FileText,
  UserCheck,
  X,
  AlertTriangle
} from 'lucide-react';
import { User, InternalCourse, CourseLesson, CourseQuizQuestion } from '../../types';
import { dataRepo, UNIT_KERJA_LIST } from '../../services/dataService';

interface PembelajaranInternalViewProps {
  currentUser: User;
}

export const PembelajaranInternalView: React.FC<PembelajaranInternalViewProps> = ({ currentUser }) => {
  const isAdmin = currentUser.role === 'Admin' || currentUser.role === 'Super Admin';
  const [courses, setCourses] = useState<InternalCourse[]>(() => dataRepo.getCourses());
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Flow State
  const [courseToEnroll, setCourseToEnroll] = useState<InternalCourse | null>(null);
  const [isDataDiriModalOpen, setIsDataDiriModalOpen] = useState(false);
  const [activeLearningCourse, setActiveLearningCourse] = useState<InternalCourse | null>(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // In-App Delete & Edit State
  const [courseToDelete, setCourseToDelete] = useState<InternalCourse | null>(null);
  const [courseToEdit, setCourseToEdit] = useState<InternalCourse | null>(null);

  // Pre-learning Personal Data Form
  const [nip, setNip] = useState(currentUser.nip || '');
  const [fullName, setFullName] = useState(currentUser.fullName || '');
  const [unitKerja, setUnitKerja] = useState(currentUser.unitKerja || UNIT_KERJA_LIST[1]);
  const [jabatan, setJabatan] = useState('Asisten Manajer / Staf Fungsional');
  const [currentEnrollmentId, setCurrentEnrollmentId] = useState<string>('');

  // Course Creator Modal (Admin only)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Teknis Kebanksentralan');
  const [newDuration, setNewDuration] = useState(8);
  const [newPoints, setNewPoints] = useState(120);
  const [newLevel, setNewLevel] = useState<'Fundamental' | 'Intermediate' | 'Advanced' | 'Sertifikasi'>('Intermediate');
  const [newLessonTitle, setNewLessonTitle] = useState('Pengenalan & Teori Dasar');
  const [newLessonContent, setNewLessonContent] = useState('Pembahasan kerangka operasional Bank Indonesia dan tata kelola proses kerja.');
  const [newQuestionText, setNewQuestionText] = useState('Manakah pernyataan yang paling tepat mengenai implementasi kebijakan ini?');
  const [optA, setOptA] = useState('Meningkatkan transparansi dan mitigasi risiko operasional');
  const [optB, setOptB] = useState('Menghilangkan prosedur reviu bertingkat');
  const [optC, setOptC] = useState('Menyerahkan wewenang penuh tanpa koordinasi');
  const [optD, setOptD] = useState('Mengabaikan standardisasi rekod kerja');
  const [correctOpt, setCorrectOpt] = useState(0);

  // Course Edit Modal State
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editCategory, setEditCategory] = useState('Teknis Kebanksentralan');
  const [editDuration, setEditDuration] = useState(8);
  const [editPoints, setEditPoints] = useState(120);
  const [editLevel, setEditLevel] = useState<'Fundamental' | 'Intermediate' | 'Advanced' | 'Sertifikasi'>('Intermediate');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const categories = ['Semua', 'Teknis Kebanksentralan', 'Pengelolaan Kas', 'Kearsipan & Tata Kelola', 'Sertifikasi Profesi', 'Ekonomi Moneter', 'Digital & IT'];

  const filteredCourses = courses.filter((c) => {
    const matchCat = selectedCategory === 'Semua' || c.category === selectedCategory;
    const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleStartCourseClick = (course: InternalCourse) => {
    setCourseToEnroll(course);
    setIsDataDiriModalOpen(true);
  };

  const handleConfirmDataDiri = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseToEnroll) return;

    if (!nip.trim() || !fullName.trim()) {
      alert('Mohon isi NIP dan Nama Lengkap sebelum memulai pembelajaran');
      return;
    }

    const enrollment = dataRepo.enrollInCourse({
      courseId: courseToEnroll.id,
      nip: nip.trim(),
      fullName: fullName.trim(),
      unitKerja,
      email: currentUser.email || `${nip}@bi.go.id`,
    });

    setCurrentEnrollmentId(enrollment.id);
    setIsDataDiriModalOpen(false);
    setActiveLearningCourse(courseToEnroll);
    setActiveLessonIndex(0);
    setIsQuizMode(false);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    showToast(`Data diri terverifikasi. Selamat belajar modul ${courseToEnroll.title}!`);
  };

  const handleSelectQuizAnswer = (qIndex: number, optionIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [qIndex]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    if (!activeLearningCourse) return;
    const totalQuestions = activeLearningCourse.quiz.length;
    let correctCount = 0;

    activeLearningCourse.quiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / (totalQuestions || 1)) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);

    dataRepo.completeCourseLesson(currentEnrollmentId, score);
    setCourses(dataRepo.getCourses());
    showToast(`Selamat! Anda menyelesaikan kursus dengan nilai ${score}/100. Poin dan jam belajar telah diperbarui.`);
  };

  const handleCreateCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert('Judul kursus wajib diisi');
      return;
    }

    const created = dataRepo.addCourse({
      title: newTitle.trim(),
      description: newDesc.trim() || 'Modul pembelajaran self-learning terstruktur bagi pegawai KPw Bank Indonesia Provinsi Jawa Timur.',
      category: newCategory,
      instructor: currentUser.fullName || 'Tim Instruktur Internal BI Jatim',
      level: newLevel,
      totalDurationHours: Number(newDuration) || 8,
      learningPoints: Number(newPoints) || 100,
      rating: 4.9,
      isPublished: true,
      publishedBy: currentUser.fullName || currentUser.username,
      lessons: [
        {
          id: `ls-${Date.now()}-1`,
          title: newLessonTitle,
          durationMinutes: 45,
          contentMarkdown: newLessonContent,
          keyPoints: [
            'Pemahaman kerangka regulasi dan kebijakan operasional BI',
            'Penerapan standar mitigasi risiko dan kepatuhan kerja',
            'Metrik keberhasilan kinerja satker'
          ]
        }
      ],
      quiz: [
        {
          id: `qz-${Date.now()}-1`,
          question: newQuestionText,
          options: [optA, optB, optC, optD],
          correctIndex: correctOpt,
          explanation: 'Jawaban tepat mencerminkan prinsip tata kelola dan akuntabilitas kerja Bank Indonesia.'
        }
      ]
    });

    setCourses(dataRepo.getCourses());
    setIsCreateModalOpen(false);
    showToast(`Modul "${created.title}" berhasil dipublikasikan.`);
    setNewTitle('');
    setNewDesc('');
  };

  // Open Edit Modal
  const handleOpenEdit = (course: InternalCourse) => {
    setCourseToEdit(course);
    setEditTitle(course.title);
    setEditDesc(course.description);
    setEditCategory(course.category);
    setEditDuration(course.totalDurationHours);
    setEditPoints(course.learningPoints);
    setEditLevel(course.level);
  };

  // Save Edit Course
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseToEdit) return;

    const updated: InternalCourse = {
      ...courseToEdit,
      title: editTitle.trim(),
      description: editDesc.trim(),
      category: editCategory,
      totalDurationHours: Number(editDuration) || 8,
      learningPoints: Number(editPoints) || 100,
      level: editLevel,
    };

    dataRepo.updateCourse(updated, currentUser.fullName || currentUser.username);
    setCourses(dataRepo.getCourses());
    setCourseToEdit(null);
    showToast(`Modul "${updated.title}" berhasil diperbarui.`);
  };

  // Execute in-app delete confirmation
  const handleConfirmDelete = () => {
    if (!courseToDelete) return;
    const title = courseToDelete.title;
    dataRepo.deleteCourse(courseToDelete.id);
    setCourses(dataRepo.getCourses());
    setCourseToDelete(null);
    showToast(`Modul "${title}" telah dihapus.`);
  };

  // ACTIVE LEARNING ENVIRONMENT PLAYER
  if (activeLearningCourse) {
    const currentLesson = activeLearningCourse.lessons[activeLessonIndex] || activeLearningCourse.lessons[0];

    return (
      <div className="max-w-5xl mx-auto space-y-6 pb-16">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setActiveLearningCourse(null)}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-sky-600 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Keluar dari Ruang Belajar</span>
          </button>
          
          <div className="flex items-center gap-3 text-xs">
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              Peserta: <strong className="text-slate-900 dark:text-white">{fullName}</strong> ({nip})
            </span>
            <span className="px-2.5 py-1 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold">
              {unitKerja}
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#0f1c3f] via-[#1e3a8a] to-[#047857] text-white p-6 sm:p-8 rounded-3xl shadow-lg border-t-4 border-amber-400">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
              {activeLearningCourse.category}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-xs font-bold">
              Tingkat: {activeLearningCourse.level}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">{activeLearningCourse.title}</h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-2 max-w-3xl leading-relaxed">
            {activeLearningCourse.description}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-200">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-300" />
              <span>{activeLearningCourse.totalDurationHours} Jam Belajar</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-300" />
              <span>{activeLearningCourse.learningPoints} Poin Kredit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Rating {activeLearningCourse.rating} / 5.0</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 h-fit">
            <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
              Daftar Silabus & Evaluasi
            </h3>

            <div className="space-y-1.5">
              {activeLearningCourse.lessons.map((lesson, idx) => {
                const isActive = !isQuizMode && activeLessonIndex === idx;
                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => {
                      setIsQuizMode(false);
                      setActiveLessonIndex(idx);
                    }}
                    className={`w-full text-left p-3 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                      isActive 
                        ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800' 
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 shrink-0 text-sky-600" />
                      <span className="line-clamp-1">{idx + 1}. {lesson.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">{lesson.durationMinutes}m</span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setIsQuizMode(true)}
                className={`w-full text-left p-3 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer mt-2 ${
                  isQuizMode
                    ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 shrink-0 text-amber-500" />
                  <span>Kuis Uji Pemahaman ({activeLearningCourse.quiz.length} Soal)</span>
                </div>
                {quizSubmitted ? (
                  <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold">
                    {quizScore}%
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-600">Wajib</span>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {!isQuizMode ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl flex flex-col items-center justify-center text-white p-6 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #38bdf8 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                  <div className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-xl cursor-pointer group-hover:scale-110 transition">
                    <PlayCircle className="w-8 h-8" />
                  </div>
                  <span className="mt-3 text-xs font-semibold text-slate-300">
                    Klik untuk memutar video pembelajaran interaktif
                  </span>
                  <div className="absolute bottom-3 left-4 text-[11px] font-mono text-emerald-400 bg-black/50 px-2 py-0.5 rounded">
                    LENTERA E-LEARNING PLAYER &bull; {currentLesson.durationMinutes} Menit
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {currentLesson.title}
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {currentLesson.contentMarkdown}
                  </p>
                </div>

                {currentLesson.keyPoints && currentLesson.keyPoints.length > 0 && (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Poin Inti Pembelajaran (Key Takeaways):</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      {currentLesson.keyPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsQuizMode(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer"
                  >
                    <span>Lanjut ke Kuis Pemahaman</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                      <span>Kuis Evaluasi Mandiri</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Jawab seluruh butir soal untuk mengklaim {activeLearningCourse.learningPoints} poin & {activeLearningCourse.totalDurationHours} jam belajar.
                    </p>
                  </div>
                  {quizSubmitted && quizScore !== null && (
                    <div className="text-right">
                      <div className="text-2xl font-black text-emerald-600">{quizScore}/100</div>
                      <div className="text-[10px] text-emerald-500 font-bold">Lulus Evaluasi</div>
                    </div>
                  )}
                </div>

                {activeLearningCourse.quiz.map((q, qIdx) => (
                  <div key={q.id} className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      <span className="text-sky-600 dark:text-sky-400 mr-1.5">{qIdx + 1}.</span>
                      {q.question}
                    </h4>

                    <div className="space-y-2">
                      {q.options.map((option, optIdx) => {
                        const isSelected = quizAnswers[qIdx] === optIdx;
                        const isCorrect = q.correctIndex === optIdx;
                        let btnStyle = 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100';

                        if (quizSubmitted) {
                          if (isCorrect) btnStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold';
                          else if (isSelected) btnStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-800 dark:text-rose-300';
                        } else if (isSelected) {
                          btnStyle = 'bg-sky-50 dark:bg-sky-950/60 border-sky-500 text-sky-800 dark:text-sky-200 font-bold ring-2 ring-sky-500';
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={quizSubmitted}
                            onClick={() => handleSelectQuizAnswer(qIdx, optIdx)}
                            className={`w-full text-left p-3 rounded-xl border text-xs flex items-center justify-between transition cursor-pointer ${btnStyle}`}
                          >
                            <span>{option}</span>
                            {quizSubmitted && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && q.explanation && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg">
                        <strong>Pembahasan:</strong> {q.explanation}
                      </p>
                    )}
                  </div>
                ))}

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setIsQuizMode(false)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                  >
                    Kembali ke Materi
                  </button>

                  {!quizSubmitted ? (
                    <button
                      type="button"
                      onClick={handleSubmitQuiz}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer"
                    >
                      Kirim Jawaban Kuis
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveLearningCourse(null)}
                      className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md cursor-pointer"
                    >
                      Selesai & Simpan Pencapaian
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // STANDARD COURSE CATALOGUE VIEW
  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xl border border-slate-700 flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner - CLEAN NO ZENIUS / QUIPPER */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
            Kurikulum Pembelajaran Internal Mandiri
          </span>
          <h2 className="text-xl font-extrabold text-[#0f1c3f] dark:text-white mt-1">
            Katalog Pembelajaran Internal (Self Learning)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Akses modul video, bacaan analitis, kuis pemahaman kompetensi, serta perekaman jam belajar dan learning point pegawai secara real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Input Modul Baru (Admin)</span>
            </button>
          )}

          <div className="px-4 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-right">
            <div className="text-[10px] text-sky-700 dark:text-sky-300 font-bold uppercase">Target Jam Minimum</div>
            <div className="text-lg font-black text-sky-900 dark:text-sky-100 tabular-nums">50 Jam / Pegawai</div>
          </div>
        </div>
      </div>

      {/* Search and Category Filter */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Cari materi pembelajaran, modul, atau kata kunci topik..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-bold transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCourses.map((m) => (
          <div 
            key={m.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono text-sky-600 dark:text-sky-400 text-[11px] font-bold">{m.id}</span>
                <span className="px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-[10px] font-semibold">
                  {m.level}
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">
                {m.title}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {m.description}
              </p>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                Fasilitator: <span className="text-slate-700 dark:text-slate-300 font-medium">{m.instructor}</span>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-bold">{m.totalDurationHours} Jam</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span className="font-bold text-amber-600 dark:text-amber-400">{m.learningPoints} Poin</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="font-bold">{m.rating}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {m.enrolledStudentsCount} Pegawai Selesai
              </span>

              <div className="flex items-center gap-1.5">
                {/* Admin Tools: Edit & Hapus Modul Pembelajaran */}
                {isAdmin && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(m)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-slate-800 transition cursor-pointer"
                      title="Edit Modul Pembelajaran"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setCourseToDelete(m)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition cursor-pointer"
                      title="Hapus Modul Pembelajaran"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => handleStartCourseClick(m)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  <span>Mulai Belajar</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mandatory Pre-Study Data Diri Modal */}
      {isDataDiriModalOpen && courseToEnroll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Verifikasi Data Diri Pegawai
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Sebelum sesi pembelajaran dimulai, lengkapi data diri Anda
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDataDiriModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300">
              Modul yang akan dipelajari: <strong className="font-bold">{courseToEnroll.title}</strong> ({courseToEnroll.totalDurationHours} Jam &bull; {courseToEnroll.learningPoints} Poin). Data skor akan direkam secara real-time.
            </div>

            <form onSubmit={handleConfirmDataDiri} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  NIP Pegawai <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
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
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nama Lengkap Pegawai"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Unit Kerja
                </label>
                <select
                  value={unitKerja}
                  onChange={(e) => setUnitKerja(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {UNIT_KERJA_LIST.filter(u => u !== 'Semua').map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Posisi / Jabatan
                </label>
                <input
                  type="text"
                  required
                  value={jabatan}
                  onChange={(e) => setJabatan(e.target.value)}
                  placeholder="e.g. Asisten Manajer / Pelaksana"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsDataDiriModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-sm cursor-pointer"
                >
                  Mulai Sesi Belajar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Create Course Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Input Modul Pembelajaran Internal
                  </h3>
                  <p className="text-xs text-slate-500">
                    Khusus akun Administrator & Super Admin Bank Indonesia
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCourseSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Modul Pembelajaran <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Akselerasi Digitalisasi Sistem Pembayaran & QRIS 2026"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Ringkasan & Deskripsi Kursus
                </label>
                <textarea
                  rows={2}
                  placeholder="Jelaskan tujuan dan kompetensi yang diharapkan..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  >
                    {categories.filter(c => c !== 'Semua').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Durasi (Jam)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Learning Points
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={newPoints}
                    onChange={(e) => setNewPoints(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2.5">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-sky-600" />
                  <span>Materi Bacaan / Video Pembuka</span>
                </div>
                <input
                  type="text"
                  placeholder="Judul Materi Pertama"
                  value={newLessonTitle}
                  onChange={(e) => setNewLessonTitle(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5"
                />
                <textarea
                  rows={2}
                  placeholder="Teks uraian materi pembelajaran..."
                  value={newLessonContent}
                  onChange={(e) => setNewLessonContent(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 space-y-2.5">
                <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>Kuis Uji Pemahaman (Pilihan Ganda)</span>
                </div>
                <input
                  type="text"
                  placeholder="Pertanyaan Kuis"
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Pilihan A"
                    value={optA}
                    onChange={(e) => setOptA(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Pilihan B"
                    value={optB}
                    onChange={(e) => setOptB(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Pilihan C"
                    value={optC}
                    onChange={(e) => setOptC(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Pilihan D"
                    value={optD}
                    onChange={(e) => setOptD(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Kunci Jawaban:</span>
                  <select
                    value={correctOpt}
                    onChange={(e) => setCorrectOpt(Number(e.target.value))}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1"
                  >
                    <option value={0}>Pilihan A</option>
                    <option value={1}>Pilihan B</option>
                    <option value={2}>Pilihan C</option>
                    <option value={3}>Pilihan D</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
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
                  Publikasikan Kursus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Edit Course Modal */}
      {courseToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center justify-center">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Edit Modul Pembelajaran
                  </h3>
                  <p className="text-xs text-slate-500">ID: {courseToEdit.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCourseToEdit(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Modul
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
                  Deskripsi Modul
                </label>
                <textarea
                  rows={2}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  >
                    {categories.filter(c => c !== 'Semua').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tingkat
                  </label>
                  <select
                    value={editLevel}
                    onChange={(e) => setEditLevel(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  >
                    <option value="Fundamental">Fundamental</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Sertifikasi">Sertifikasi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Durasi (Jam)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={editDuration}
                    onChange={(e) => setEditDuration(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Learning Points
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={editPoints}
                    onChange={(e) => setEditPoints(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setCourseToEdit(null)}
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
      {courseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Hapus Modul Pembelajaran?</h3>
                <p className="text-xs text-slate-500">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              Apakah Anda yakin ingin menghapus modul <strong className="text-slate-900 dark:text-white font-semibold">"{courseToDelete.title}"</strong>?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCourseToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition cursor-pointer"
              >
                Hapus Modul
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
