import React from 'react';
import { Info, CheckCircle, Shield, Award, Compass, BookOpen, Sparkles, Building2 } from 'lucide-react';

export const TentangLenteraView: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#0a1c3d] via-[#0f2756] to-[#163674] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-sky-800/40 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-400/30 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Platform Pembelajaran Unggulan KPw BI Jawa Timur</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Mengenal LENTERA
          </h2>
          <p className="text-sm text-sky-100 font-medium mt-1">
            Learning, Enrichment, Transformation, and Evaluation for Resulting Advancement
          </p>
          <p className="text-xs sm:text-sm text-slate-300 mt-4 leading-relaxed">
            LENTERA merupakan platform terpadu Kantor Perwakilan Bank Indonesia Provinsi Jawa Timur yang mengintegrasikan tiga pilar strategis: 
            <strong> Literasi Publik</strong>, <strong>Bank Kasus Empiris</strong>, dan <strong>Pembelajaran Internal Pegawai</strong> dalam ekosistem Dual-Loop Learning untuk mewujudkan keunggulan bank sentral yang adaptif dan berdampak nyata bagi masyarakat.
          </p>
        </div>
      </div>

      {/* 4 Pilar Pokok L.E.N.T.E.R.A */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 flex items-center justify-center font-black text-sm mb-3">
            L
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Learning</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            Pembelajaran terstruktur berbasis kompetensi okupasi kebanksentralan dengan pemenuhan target jam self-learning 50 jam per pegawai.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 flex items-center justify-center font-black text-sm mb-3">
            E
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Enrichment</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            Pengayaan wawasan dari studi kasus nyata di lapangan, interaksi masyarakat, dan praktik kepemimpinan bank sentral kontemporer.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-black text-sm mb-3">
            T
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Transformation</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            Metamorfosis proses kerja dan budaya inovasi melalui siklus umpan balik double-loop yang merestrukturisasi efektivitas kebijakan satker.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-black text-sm mb-3">
            A
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Advancement</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            Peningkatan akreditasi kompetensi dengan pengakuan sertifikasi profesi nasional BNSP dan pemenuhan standar kearsipan internasional ISO 15489.
          </p>
        </div>

      </div>

      {/* Institutional Profile */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-[#004b87] text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-900/20">
          <Building2 className="w-8 h-8" />
        </div>
        <div className="flex-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            Kantor Perwakilan Bank Indonesia Provinsi Jawa Timur
          </h4>
          <p>
            Jl. Pahlawan No. 105, Alun-alun Contong, Kec. Bubutan, Surabaya, Jawa Timur 60174. 
            Mendukung stabilitas nilai rupiah, kelancaran sistem pembayaran non-tunai dan tunai, serta akselerasi pertumbuhan ekonomi inklusif di 38 kabupaten/kota se-Jawa Timur.
          </p>
        </div>
      </div>

    </div>
  );
};
