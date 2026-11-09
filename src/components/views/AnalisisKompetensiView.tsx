import React from 'react';
import { Layers, TrendingUp, CheckCircle, Target, Award, Shield } from 'lucide-react';

export const AnalisisKompetensiView: React.FC = () => {
  const competencyPillars = [
    {
      title: 'Kebanksentralan & Operasional Kas (PUR)',
      currentScore: 92,
      targetScore: 90,
      gap: '+2%',
      status: 'Target Terlampaui',
      focusArea: 'Standardisasi clean money policy, uji petik keaslian rupiah 3T Madura, dan sertifikasi BNSP kasir.',
    },
    {
      title: 'Sistem Pembayaran Ritel & Digitalisasi (QRIS)',
      currentScore: 88,
      targetScore: 85,
      gap: '+3%',
      status: 'Target Terlampaui',
      focusArea: 'Penguatan pengawasan transaksi nirsentuh, integrasi QRIS antarnegara, dan edukasi pasar tradisional.',
    },
    {
      title: 'Tata Kelola Kearsipan Rekod (ISO 15489)',
      currentScore: 94,
      targetScore: 90,
      gap: '+4%',
      status: 'Target Terlampaui',
      focusArea: 'Digitalisasi berkas statis & dinamis, perlindungan kerahasiaan data perbankan, dan kesiapan audit BPK.',
    },
    {
      title: 'Analitik Makroprudensial & Inflasi Pangan (GNPIP)',
      currentScore: 84,
      targetScore: 85,
      gap: '-1%',
      status: 'Sedang Akselerasi',
      focusArea: 'Pengolahan big data neraca pangan Jawa Timur dan model prediksi harga cabai & bawang merah.',
    },
    {
      title: 'Cyber Defense & Keamanan Informasi Digital',
      currentScore: 89,
      targetScore: 85,
      gap: '+4%',
      status: 'Target Terlampaui',
      focusArea: 'Kesadaran anti-phishing, perlindungan identitas digital, dan kepatuhan standar keamanan sistem BI.',
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
            Matriks Kompetensi Pegawai
          </span>
          <h2 className="text-xl font-extrabold text-[#0f1c3f] dark:text-white mt-1">
            Analisis Kompetensi & Gap Kebutuhan Satuan Kerja
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Evaluasi pemetaan kesenjangan kompetensi (gap analysis) berbasis standar okupasi Bank Indonesia dan proyeksi kebutuhan masa depan.
          </p>
        </div>

        <div className="px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-right">
          <div className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold uppercase">Indeks Keselarasan</div>
          <div className="text-xl font-black text-emerald-700 dark:text-emerald-300 tabular-nums">89.4% Siap</div>
        </div>
      </div>

      {/* Pillars Breakdown */}
      <div className="space-y-4">
        {competencyPillars.map((p, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">0{idx + 1}.</span>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{p.title}</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">{p.focusArea}</p>
              </div>

              <div className="flex items-center gap-4 shrink-0 sm:border-l sm:border-slate-100 dark:sm:border-slate-800 sm:pl-4">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase">Skor Saat Ini</div>
                  <div className="text-lg font-black text-slate-900 dark:text-white tabular-nums">{p.currentScore}%</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase">Target</div>
                  <div className="text-sm font-semibold text-slate-500 tabular-nums">{p.targetScore}%</div>
                </div>
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                  p.gap.startsWith('+') 
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                }`}>
                  {p.gap}
                </span>
              </div>
            </div>

            {/* Visual comparative bar */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
              <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    p.currentScore >= p.targetScore ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${p.currentScore}%` }}
                />
              </div>
              <span className="text-[11px] font-medium text-slate-500">{p.status}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
