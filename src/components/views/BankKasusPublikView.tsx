import React, { useState } from 'react';
import { 
  Briefcase, 
  Download, 
  MessageSquare, 
  Heart, 
  Smile, 
  Send, 
  Search, 
  PlusCircle, 
  Sparkles, 
  CheckCircle2, 
  Trash2, 
  Edit3,
  HelpCircle,
  MessageCircleQuestion,
  Lightbulb
} from 'lucide-react';
import { CaseStudy, User } from '../../types';
import { dataRepo, BANK_KASUS_CATEGORIES, UNIT_KERJA_LIST } from '../../services/dataService';

interface BankKasusPublikViewProps {
  currentUser: User;
}

export const BankKasusPublikView: React.FC<BankKasusPublikViewProps> = ({ currentUser }) => {
  const isAdmin = currentUser.role === 'Super Admin' || currentUser.role === 'Admin';
  
  const [cases, setCases] = useState<CaseStudy[]>(() => dataRepo.getCases());
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [search, setSearch] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form State for inputting Bank Kasus
  const [showInputForm, setShowInputForm] = useState(false);
  const [inputIssueTopic, setInputIssueTopic] = useState('');
  const [inputFeedbackType, setInputFeedbackType] = useState<'Feedback' | 'Pertanyaan'>('Feedback');
  const [inputSummary, setInputSummary] = useState('');
  const [inputCategory, setInputCategory] = useState('CBP Rupiah');
  const [inputUnit, setInputUnit] = useState(currentUser.unitKerja || 'Unit Distribusi Uang');

  // Comment Box State per card
  const [activeCommentCaseId, setActiveCommentCaseId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('💡');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredCases = cases.filter((c) => {
    const matchCategory = selectedCategory === 'Semua' || c.category === selectedCategory;
    const matchSearch = 
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.summary.toLowerCase().includes(search.toLowerCase()) ||
      c.authorUnit.toLowerCase().includes(search.toLowerCase()) ||
      (c.issueTopic && c.issueTopic.toLowerCase().includes(search.toLowerCase()));
    return matchCategory && matchSearch;
  });

  // Handle Submit New Case Study / Feedback
  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputIssueTopic.trim() || !inputSummary.trim()) return;

    const newCase = dataRepo.addCase({
      title: inputIssueTopic.trim(),
      authorUnit: inputUnit,
      targetAudience: 'Masyarakat & Pegawai Satker BI Jatim',
      summary: inputSummary.trim(),
      category: inputCategory,
      dualLoopImpact: `Masukan dari ${inputUnit} diintegrasikan ke dalam silabus evaluasi kebijakan triwulanan.`,
      tags: [inputCategory, inputFeedbackType],
      feedbackType: inputFeedbackType,
      issueTopic: inputIssueTopic.trim(),
    });

    setCases(dataRepo.getCases());
    setShowInputForm(false);
    setInputIssueTopic('');
    setInputSummary('');
    showToast(`Masukan Bank Kasus "${newCase.title}" berhasil dipublikasikan.`);
  };

  // Social Interaction: Toggle Like
  const handleToggleLike = (caseId: string) => {
    dataRepo.toggleLikeCase(caseId);
    setCases([...dataRepo.getCases()]);
  };

  // Social Interaction: Add Comment with Emoji
  const handleAddComment = (caseId: string) => {
    if (!commentText.trim()) return;

    dataRepo.addCommentToCase(caseId, {
      authorName: currentUser.fullName,
      authorUnit: currentUser.unitKerja,
      authorRole: currentUser.role,
      comment: commentText.trim(),
      emojiReaction: selectedEmoji,
    });

    setCases([...dataRepo.getCases()]);
    setCommentText('');
    showToast('Tanggapan Anda telah terkirim.');
  };

  // Delete Case (Admin or Author)
  const handleDeleteCase = (caseId: string) => {
    if (confirm('Hapus studi kasus ini dari repositori Bank Kasus?')) {
      dataRepo.deleteCase(caseId);
      setCases(dataRepo.getCases());
      showToast('Studi kasus telah dihapus.');
    }
  };

  const availableEmojis = ['👍', '❤️', '💡', '👏', '🔥', '🎯'];

  return (
    <div className="space-y-6">
      
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-2xl border border-emerald-500 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-[#0c182c] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Repositori Pengetahuan & Partisipasi Publik
          </span>
          <h2 className="text-xl font-extrabold text-[#0c2340] dark:text-white mt-1">
            Bank Kasus Literasi Publik Bank Indonesia Jatim
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Sistem kolaborasi interaktif antar-pegawai untuk mengkaji isu lapangan, memberikan feedback/pertanyaan, dan bertukar tanggapan layaknya media sosial.
          </p>
        </div>

        <button
          onClick={() => setShowInputForm(!showInputForm)}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{showInputForm ? 'Tutup Formulir' : 'Kirim Masukan Bank Kasus'}</span>
        </button>
      </div>

      {/* INPUT FORM SECTION (Isu yang dibahas, Jenis Masukan: Feedback / Pertanyaan, Uraian Kasus) */}
      {showInputForm && (
        <div className="bg-white dark:bg-[#0c182c] rounded-2xl p-6 border-2 border-emerald-500/30 shadow-md animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <h3 className="font-extrabold text-sm text-[#0c2340] dark:text-white">
                Formulir Masukan & Isu Strategis Bank Kasus
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">Semua akun dapat menyampaikan isu</span>
          </div>

          <form onSubmit={handleCreateCase} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Isu yang dibahas */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Isu yang Dibahas (Judul Permasalahan)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kendala Sinyal Mesin EDC / QRIS Pedagang Sayur di Pasar Tradisional"
                  value={inputIssueTopic}
                  onChange={(e) => setInputIssueTopic(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Jenis Masukan: Feedback vs Pertanyaan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Jenis Masukan
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-bold cursor-pointer transition ${
                    inputFeedbackType === 'Feedback'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-500'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}>
                    <input
                      type="radio"
                      name="feedbackType"
                      value="Feedback"
                      checked={inputFeedbackType === 'Feedback'}
                      onChange={() => setInputFeedbackType('Feedback')}
                      className="hidden"
                    />
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Feedback</span>
                  </label>

                  <label className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-bold cursor-pointer transition ${
                    inputFeedbackType === 'Pertanyaan'
                      ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-500'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}>
                    <input
                      type="radio"
                      name="feedbackType"
                      value="Pertanyaan"
                      checked={inputFeedbackType === 'Pertanyaan'}
                      onChange={() => setInputFeedbackType('Pertanyaan')}
                      className="hidden"
                    />
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Pertanyaan</span>
                  </label>
                </div>
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Kategori Isu
                </label>
                <select
                  value={inputCategory}
                  onChange={(e) => setInputCategory(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  {BANK_KASUS_CATEGORIES.filter(c => c !== 'Semua').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Unit Kerja Penyusun
                </label>
                <select
                  value={inputUnit}
                  onChange={(e) => setInputUnit(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  {UNIT_KERJA_LIST.filter(u => u !== 'Semua').map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Kolom Input Uraian Kasus */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Kolom Input Uraian Kasus & Temuan Lapangan
              </label>
              <textarea
                required
                rows={4}
                placeholder="Deskripsikan kronologi temuan, kendala yang dihadapi di lapangan, serta usulan solusi atau hal yang perlu direspons oleh satker terkait..."
                value={inputSummary}
                onChange={(e) => setInputSummary(e.target.value)}
                className="w-full text-xs p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowInputForm(false)}
                className="px-4 py-2 text-xs text-slate-500 hover:bg-slate-100 rounded-xl"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs cursor-pointer"
              >
                Kirim Masukan Kasus
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 11 CATEGORIES FILTER BAR (Semua, CBP Rupiah, Digitalisasi / QRIS, Perlindungan Konsumen, UMKM, dll.) */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white dark:bg-[#0c182c] border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs">
          {BANK_KASUS_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Cari isu kasus, uraian, atau unit penyusun..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-2 bg-white dark:bg-[#0c182c] border border-slate-200/80 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* SOCIAL MEDIA STYLE CASE FEED (Like, Comment, Emoji Reactions) */}
      <div className="space-y-4">
        {filteredCases.map((c) => {
          const isCommentOpen = activeCommentCaseId === c.id;

          return (
            <div 
              key={c.id}
              className="bg-white dark:bg-[#0c182c] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs transition"
            >
              {/* Header of Post */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                    {c.authorUnit.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-[#0c2340] dark:text-white">
                        {c.authorUnit}
                      </span>
                      {c.feedbackType && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.feedbackType === 'Pertanyaan'
                            ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200'
                            : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
                        }`}>
                          {c.feedbackType}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Dipublikasikan pada {c.date} &bull; Kategori: <strong className="text-emerald-600 dark:text-emerald-400">{c.category}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10.5px] text-slate-400">{c.id}</span>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleDeleteCase(c.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Hapus Kasus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Title & Topic */}
              <div className="mt-3.5">
                <h3 className="font-extrabold text-base text-[#0c2340] dark:text-white leading-snug">
                  {c.title}
                </h3>
                {c.issueTopic && (
                  <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    Fokus Masalah: #{c.issueTopic}
                  </div>
                )}
              </div>

              {/* Body Summary */}
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">
                {c.summary}
              </p>

              {/* Dual-Loop Impact Callout */}
              <div className="mt-3.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Dampak Pembelajaran Dual-Loop Satker:</span>
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-200 mt-1">
                  {c.dualLoopImpact}
                </div>
              </div>

              {/* Social Media Action Bar (Like, Comment, Emoji reactions, Download) */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  
                  {/* Like Button with counter */}
                  <button
                    type="button"
                    onClick={() => handleToggleLike(c.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition cursor-pointer font-bold ${
                      c.hasLiked
                        ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 border border-rose-200 dark:border-rose-800'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${c.hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{c.likes} Suka</span>
                  </button>

                  {/* Comment Trigger */}
                  <button
                    type="button"
                    onClick={() => setActiveCommentCaseId(isCommentOpen ? null : c.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition cursor-pointer font-bold"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-sky-500" />
                    <span>{c.comments.length} Tanggapan / Review</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => showToast(`Mengunduh berkas kajian: ${c.title}.pdf`)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition cursor-pointer text-xs font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Dokumen</span>
                </button>
              </div>

              {/* SOCIAL COMMENTS / REVIEWS SECTION */}
              {isCommentOpen && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-in fade-in">
                  
                  {/* List of Previous Comments */}
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {c.comments.length === 0 ? (
                      <div className="text-center py-4 text-xs text-slate-400">
                        Belum ada review untuk kasus ini. Jadilah yang pertama memberikan masukan!
                      </div>
                    ) : (
                      c.comments.map((cm) => (
                        <div key={cm.id} className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#0c2340] dark:text-white">{cm.authorName}</span>
                              <span className="text-[10px] text-slate-400">({cm.authorUnit})</span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{cm.authorRole}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {cm.emojiReaction && <span className="text-sm">{cm.emojiReaction}</span>}
                              <span className="text-[10px] text-slate-400">{cm.timestamp}</span>
                            </div>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                            {cm.comment}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Input New Comment + Emoji Selector */}
                  <div className="flex flex-col sm:flex-row items-stretch gap-2 pt-2">
                    
                    {/* Emoji Reaction Selector */}
                    <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                      {availableEmojis.map((em) => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => setSelectedEmoji(em)}
                          className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition cursor-pointer ${
                            selectedEmoji === em ? 'bg-white dark:bg-slate-700 shadow-xs scale-110' : 'hover:bg-white/50'
                          }`}
                        >
                          {em}
                        </button>
                      ))}
                    </div>

                    {/* Text input */}
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Tuliskan ulasan atau tanggapan Anda..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddComment(c.id);
                        }}
                        className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddComment(c.id)}
                        className="absolute right-2 top-2 p-1 text-emerald-600 hover:text-emerald-700 cursor-pointer"
                        title="Kirim Komentar"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
