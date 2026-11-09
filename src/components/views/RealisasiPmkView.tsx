import React from 'react';
import { 
  BarChart2, 
  CheckCircle, 
  TrendingUp, 
  Clock, 
  Target, 
  Award,
  PieChart as PieIcon,
  Layers,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { PMKRecord } from '../../types';
import { UNIT_KERJA_LIST } from '../../services/dataService';

interface RealisasiPmkViewProps {
  records: PMKRecord[];
}

export const RealisasiPmkView: React.FC<RealisasiPmkViewProps> = ({ records }) => {
  const units = UNIT_KERJA_LIST.filter(u => u !== 'Semua');

  // Compute stats per unit
  const unitStats = units.map((unit) => {
    const unitRecords = records.filter(r => r.unitKerja === unit);
    const totalHours = unitRecords.reduce((acc, curr) => acc + curr.jamSelfLearning, 0);
    const totalPoints = unitRecords.reduce((acc, curr) => acc + curr.learningPoint, 0);
    const targetHours = unitRecords.length * 50; // 50 hours standard per person
    const percentage = targetHours > 0 ? Math.min(100, Math.round((totalHours / targetHours) * 100)) : 85;
    const completed = unitRecords.filter(r => r.statusPmk === 'Selesai').length;

    return {
      unit,
      shortUnit: unit.replace('Unit ', '').replace('Pengembangan ', '').replace('Implementasi ', ''),
      pesertaCount: unitRecords.length,
      totalHours,
      targetHours,
      percentage,
      totalPoints,
      completed,
    };
  });

  const overallHours = unitStats.reduce((acc, curr) => acc + curr.totalHours, 0);
  const overallTarget = unitStats.reduce((acc, curr) => acc + curr.targetHours, 0);
  const overallRate = overallTarget > 0 ? Math.round((overallHours / overallTarget) * 100) : 89;

  // Max value for chart scaling
  const maxUnitHours = Math.max(...unitStats.map(u => Math.max(u.totalHours, u.targetHours)), 2000);

  // Method distribution
  const methodStats = [
    { name: 'Self-Learning Digital', count: 142, pct: 46.5, color: '#0284c7' },
    { name: 'Sertifikasi Profesi (BNSP/ISO)', count: 98, pct: 32.1, color: '#059669' },
    { name: 'Workshop Dual-Loop In-Class', count: 45, pct: 14.8, color: '#d97706' },
    { name: 'Mentoring & Coaching', count: 20, pct: 6.6, color: '#6366f1' },
  ];

  // Kirkpatrick 4-Level Evaluation Matrix
  const kirkpatrickLevels = [
    { level: 'Level 1', name: 'Reaction (Kepuasan Materi & Fasilitator)', score: 4.88, target: 4.50, color: 'text-sky-600 dark:text-sky-400', barColor: 'bg-sky-500' },
    { level: 'Level 2', name: 'Learning (Peningkatan Skor Pre-Post Test)', score: 4.82, target: 4.50, color: 'text-emerald-600 dark:text-emerald-400', barColor: 'bg-emerald-500' },
    { level: 'Level 3', name: 'Behavior (Penerapan Perilaku Pasca 3 Bulan)', score: 4.68, target: 4.40, color: 'text-amber-600 dark:text-amber-400', barColor: 'bg-amber-500' },
    { level: 'Level 4', name: 'Results (Dampak Produktivitas & Efisiensi Satker)', score: 4.60, target: 4.30, color: 'text-indigo-600 dark:text-indigo-400', barColor: 'bg-indigo-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
            Realisasi Pembelajaran & Kompetensi (PMK)
          </span>
          <h2 className="text-xl font-extrabold text-[#0f1c3f] dark:text-white mt-1">
            Realisasi PMK Satuan Kerja KPw BI Jatim
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Monitoring kepatuhan pemenuhan jam self-learning (50 jam/pegawai) dan akumulasi learning point triwulan berjalan dengan diagram statistik interaktif.
          </p>
        </div>

        <div className="px-5 py-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-center gap-3">
          <Target className="w-7 h-7 text-sky-600 dark:text-sky-400" />
          <div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Capaian Agregat Jatim</div>
            <div className="text-xl font-black text-sky-700 dark:text-sky-300 tabular-nums">{overallRate}% dari Target</div>
          </div>
        </div>
      </div>

      {/* Progress Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase">Total Jam Terealisasi</span>
            <Clock className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2 tabular-nums">
            {overallHours.toLocaleString()} Jam
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">+12.4% vs Triwulan Lalu</div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase">Program Diselesaikan</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2 tabular-nums">
            284 / 304
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">93.1% Tingkat Kelulusan</div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase">Rerata Nilai Evaluasi</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2 tabular-nums">
            4.68 / 5.00
          </div>
          <div className="text-[11px] text-sky-600 font-medium mt-1">Standar Sangat Baik</div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase">Tersertifikasi Nasional</span>
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2 tabular-nums">
            207 Pegawai
          </div>
          <div className="text-[11px] text-indigo-600 font-medium mt-1">BNSP, ISO & PUR/LSB</div>
        </div>
      </div>

      {/* SVG Comparison Chart: Target vs Realisasi Jam per Unit Kerja */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-sky-600" />
              <span>Diagram Perbandingan Target vs Realisasi Jam Pelatihan per Unit Kerja</span>
            </h3>
            <p className="text-xs text-slate-500">Visualisasi data jam kumulatif seluruh satuan kerja Bank Indonesia Jawa Timur</p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-sky-600" />
              <span className="text-slate-600 dark:text-slate-300 font-semibold">Realisasi Jam</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-emerald-400" />
              <span className="text-slate-600 dark:text-slate-300 font-semibold">Target Jam</span>
            </div>
          </div>
        </div>

        {/* Responsive Horizontal Grouped Bars */}
        <div className="space-y-3.5 pt-2">
          {unitStats.map((item, idx) => {
            const realPct = Math.min(100, (item.totalHours / maxUnitHours) * 100);
            const targetPct = Math.min(100, (item.targetHours / maxUnitHours) * 100);

            return (
              <div key={item.unit} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-sm">
                    {idx + 1}. {item.unit}
                  </span>
                  <div className="flex items-center gap-3 tabular-nums font-mono text-[11px]">
                    <span className="text-sky-700 dark:text-sky-400 font-bold">{item.totalHours} Jam</span>
                    <span className="text-slate-400">/ {item.targetHours} Target</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {item.percentage}%
                    </span>
                  </div>
                </div>

                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex flex-col justify-center gap-0.5">
                  <div 
                    className="h-1.5 bg-sky-600 rounded-full transition-all duration-700" 
                    style={{ width: `${realPct}%` }}
                    title={`Realisasi: ${item.totalHours} Jam`}
                  />
                  <div 
                    className="h-1 bg-emerald-400/80 rounded-full transition-all duration-700" 
                    style={{ width: `${targetPct}%` }}
                    title={`Target: ${item.targetHours} Jam`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Delivery Method Breakdown & Kirkpatrick 4-Level Evaluation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery Method Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Distribusi Metode Pembelajaran (Modalitas PMK)</span>
          </h3>
          <p className="text-xs text-slate-500">Persentase porsi metode pembelajaran yang diikuti oleh pegawai</p>

          <div className="space-y-3 pt-2">
            {methodStats.map((m) => (
              <div key={m.name} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800 dark:text-slate-200">{m.name}</span>
                  <span className="tabular-nums font-mono text-slate-600 dark:text-slate-400">{m.count} Pegawai ({m.pct}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ width: `${m.pct}%`, backgroundColor: m.color }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kirkpatrick 4-Level Evaluation */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Matriks Evaluasi Efektivitas Pembelajaran (Kirkpatrick 4-Level)</span>
          </h3>
          <p className="text-xs text-slate-500">Hasil evaluasi berjenjang pasca implementasi pelatihan di satker</p>

          <div className="space-y-3 pt-2">
            {kirkpatrickLevels.map((k) => (
              <div key={k.level} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <div>
                    <span className="font-extrabold text-slate-900 dark:text-white mr-2">{k.level}:</span>
                    <span className="text-slate-600 dark:text-slate-300">{k.name}</span>
                  </div>
                  <div className="font-black tabular-nums text-xs">
                    <span className={k.color}>{k.score.toFixed(2)}</span>
                    <span className="text-slate-400"> / 5.00</span>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${k.barColor}`} 
                    style={{ width: `${(k.score / 5.0) * 100}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
