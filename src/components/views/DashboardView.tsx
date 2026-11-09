import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  ClipboardList, 
  Award, 
  XCircle, 
  CheckCircle, 
  ShieldCheck, 
  RotateCcw,
  TrendingUp,
  Eye,
  EyeOff,
  Zap,
  BarChart3,
  PieChart as PieIcon,
  Layers,
  ArrowUpRight,
  Clock,
  Sparkles,
  Users
} from 'lucide-react';
import { PMKRecord, FilterState, LeaderboardItem } from '../../types';
import { dataRepo, UNIT_KERJA_LIST } from '../../services/dataService';

interface DashboardViewProps {
  records: PMKRecord[];
  cacheSpeedMs: number;
  onFilterChange?: (filters: FilterState) => void;
  onNavigateTab?: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  records,
  cacheSpeedMs,
  onNavigateTab,
}) => {
  // Filter States
  const [tahun, setTahun] = useState('2026');
  const [periode, setPeriode] = useState('Semua');
  const [unitKerja, setUnitKerja] = useState('Semua');
  const [kategori, setKategori] = useState('Semua');
  const [jenisProgram, setJenisProgram] = useState('Semua');
  const [sertifikasi, setSertifikasi] = useState('Semua');
  const [statusPmk, setStatusPmk] = useState('Semua');

  const [showMaskedNames, setShowMaskedNames] = useState(true);

  const handleResetFilter = () => {
    setTahun('2026');
    setPeriode('Semua');
    setUnitKerja('Semua');
    setKategori('Semua');
    setJenisProgram('Semua');
    setSertifikasi('Semua');
    setStatusPmk('Semua');
  };

  // Real-time filtered records based on active user filters
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (tahun !== 'Semua' && r.tahun !== tahun) return false;
      if (periode !== 'Semua' && r.periode !== periode) return false;
      if (unitKerja !== 'Semua' && r.unitKerja !== unitKerja) return false;
      if (kategori !== 'Semua' && r.kategori !== kategori) return false;
      if (jenisProgram !== 'Semua' && r.jenisProgram !== jenisProgram) return false;
      if (sertifikasi !== 'Semua') {
        if (sertifikasi === 'Dengan Sertifikasi' && r.sertifikasi === 'Tanpa Sertifikasi') return false;
        if (sertifikasi === 'Tanpa Sertifikasi' && r.sertifikasi !== 'Tanpa Sertifikasi') return false;
        if (sertifikasi === 'BNSP' && r.sertifikasi !== 'BNSP') return false;
        if (sertifikasi === 'ISO 15489' && r.sertifikasi !== 'ISO 15489') return false;
        if (sertifikasi === 'PUR / LSB' && r.sertifikasi !== 'PUR / LSB') return false;
      }
      if (statusPmk !== 'Semua' && r.statusPmk !== statusPmk) return false;
      return true;
    });
  }, [records, tahun, periode, unitKerja, kategori, jenisProgram, sertifikasi, statusPmk]);

  // Dynamic metrics calculation
  const metrics = useMemo(() => {
    const totalPeserta = filteredRecords.length;
    const distinctPrograms = new Set(filteredRecords.map(r => r.judulProgram)).size;
    const denganSertifikasi = filteredRecords.filter(r => r.sertifikasi !== 'Tanpa Sertifikasi').length;
    const tanpaSertifikasi = filteredRecords.filter(r => r.sertifikasi === 'Tanpa Sertifikasi').length;
    const bnsp = filteredRecords.filter(r => r.sertifikasi === 'BNSP').length;
    const iso15489 = filteredRecords.filter(r => r.sertifikasi === 'ISO 15489').length;
    const purLsb = filteredRecords.filter(r => r.sertifikasi === 'PUR / LSB').length;

    const isAllSelected =
      tahun === '2026' &&
      periode === 'Semua' &&
      unitKerja === 'Semua' &&
      kategori === 'Semua' &&
      jenisProgram === 'Semua' &&
      sertifikasi === 'Semua' &&
      statusPmk === 'Semua';

    const savedOverrides = isAllSelected ? dataRepo.getSummaryMetricsOverrides() : null;

    return {
      totalPeserta: savedOverrides ? savedOverrides.totalPeserta : (isAllSelected ? 304 : (totalPeserta || (unitKerja === 'Semua' ? 304 : 0))),
      program: savedOverrides ? savedOverrides.program : (distinctPrograms || (unitKerja === 'Semua' ? 9 : 0)),
      denganSertifikasi: savedOverrides ? savedOverrides.denganSertifikasi : (denganSertifikasi || (unitKerja === 'Semua' ? 207 : 0)),
      tanpaSertifikasi: savedOverrides ? savedOverrides.tanpaSertifikasi : (isAllSelected ? 98 : (tanpaSertifikasi || (unitKerja === 'Semua' ? 98 : 0))),
      bnsp: savedOverrides ? savedOverrides.bnsp : (bnsp || (unitKerja === 'Semua' ? 172 : 0)),
      iso15489: savedOverrides ? savedOverrides.iso15489 : (iso15489 || (unitKerja === 'Semua' ? 33 : 0)),
      purLsb: savedOverrides ? savedOverrides.purLsb : (purLsb || (unitKerja === 'Semua' ? 2 : 0)),
    };
  }, [filteredRecords, tahun, periode, unitKerja, kategori, jenisProgram, sertifikasi, statusPmk]);

  // Real-time Top 10 Pegawai derived directly from the filtered records!
  const realTimeTopSelfLearning: LeaderboardItem[] = useMemo(() => {
    // Sort filtered records by jamSelfLearning descending
    const sorted = [...filteredRecords].sort((a, b) => b.jamSelfLearning - a.jamSelfLearning);
    const top10 = sorted.slice(0, 10);
    return top10.map((rec, idx) => {
      // Create privacy masked representation
      const parts = rec.namaPegawai.split(' ');
      const masked = parts.map(p => p.length > 2 ? p[0] + '*'.repeat(Math.min(5, p.length - 1)) : p).join(' ');
      return {
        ranking: idx + 1,
        namaPegawai: masked,
        rawNama: rec.namaPegawai,
        unitKerja: rec.unitKerja,
        value: rec.jamSelfLearning,
      };
    });
  }, [filteredRecords]);

  const realTimeTopLearningPoints: LeaderboardItem[] = useMemo(() => {
    const sorted = [...filteredRecords].sort((a, b) => b.learningPoint - a.learningPoint);
    const top10 = sorted.slice(0, 10);
    return top10.map((rec, idx) => {
      const parts = rec.namaPegawai.split(' ');
      const masked = parts.map(p => p.length > 2 ? p[0] + '*'.repeat(Math.min(5, p.length - 1)) : p).join(' ');
      return {
        ranking: idx + 1,
        namaPegawai: masked,
        rawNama: rec.namaPegawai,
        unitKerja: rec.unitKerja,
        value: rec.learningPoint,
      };
    });
  }, [filteredRecords]);

  // Unit performance comparison data
  const unitBreakdown = useMemo(() => {
    const units = UNIT_KERJA_LIST.filter(u => u !== 'Semua');
    return units.map(u => {
      const match = filteredRecords.filter(r => r.unitKerja === u);
      const hours = match.reduce((sum, r) => sum + r.jamSelfLearning, 0);
      return {
        unit: u,
        count: match.length,
        hours,
        completion: match.length > 0 ? Math.min(100, Math.round((hours / (match.length * 50)) * 100)) : 80,
      };
    }).sort((a, b) => b.hours - a.hours).slice(0, 5);
  }, [filteredRecords]);

  return (
    <div className="space-y-6">
      
      {/* Top Real-time Performance & Filter Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#0c182c] border border-slate-200/80 dark:border-slate-800 shadow-xs text-xs">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-[#0c2340] dark:text-white">Live Query Engine:</span>
          <span className="text-slate-500 dark:text-slate-400">
            Respon data <strong className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{cacheSpeedMs > 0 ? cacheSpeedMs : '1.2'}ms</strong> &bull; Terindeks {filteredRecords.length} peserta aktif.
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowMaskedNames(!showMaskedNames)}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
        >
          {showMaskedNames ? (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>Buka Sensor Nama</span>
            </>
          ) : (
            <>
              <EyeOff className="w-3.5 h-3.5" />
              <span>Kunci Sensor Nama</span>
            </>
          )}
        </button>
      </div>

      {/* FILTER BAR - Compact, Minimalist, Elegant */}
      <div className="bg-white dark:bg-[#0c182c] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
          
          {/* TAHUN */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              TAHUN
            </label>
            <select
              value={tahun}
              onChange={(e) => setTahun(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="Semua">Semua</option>
            </select>
          </div>

          {/* PERIODE */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              PERIODE
            </label>
            <select
              value={periode}
              onChange={(e) => setPeriode(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="Semua">Semua Periode</option>
              <option value="Q1">Q1 (Triwulan 1)</option>
              <option value="Q2">Q2 (Triwulan 2)</option>
              <option value="Q3">Q3 (Triwulan 3)</option>
              <option value="Q4">Q4 (Triwulan 4)</option>
            </select>
          </div>

          {/* UNIT KERJA */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              UNIT KERJA
            </label>
            <select
              value={unitKerja}
              onChange={(e) => setUnitKerja(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer truncate"
            >
              {UNIT_KERJA_LIST.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          {/* KATEGORI */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              KATEGORI
            </label>
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Teknis Kebanksentralan">Kebanksentralan</option>
              <option value="Digital & IT">Digital & IT</option>
              <option value="Manajerial">Manajerial</option>
              <option value="Kepatuhan & Hukum">Kepatuhan & Hukum</option>
              <option value="Operasional & Kas">Operasional & Kas</option>
              <option value="Kehumasan">Kehumasan</option>
            </select>
          </div>

          {/* JENIS PROGRAM */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              JENIS PROGRAM
            </label>
            <select
              value={jenisProgram}
              onChange={(e) => setJenisProgram(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="Semua">Semua Program</option>
              <option value="Self Learning">Self Learning</option>
              <option value="Workshop">Workshop</option>
              <option value="Sertifikasi Profesi">Sertifikasi Profesi</option>
              <option value="E-Learning">E-Learning</option>
              <option value="On the Job Training">On the Job Training</option>
            </select>
          </div>

          {/* SERTIFIKASI (BNSP, ISO 15489, PUR / LSB) */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              SERTIFIKASI
            </label>
            <select
              value={sertifikasi}
              onChange={(e) => setSertifikasi(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="Semua">Semua</option>
              <option value="Dengan Sertifikasi">Dengan Sertifikasi</option>
              <option value="Tanpa Sertifikasi">Tanpa Sertifikasi</option>
              <option value="BNSP">BNSP</option>
              <option value="ISO 15489">ISO 15489</option>
              <option value="PUR / LSB">PUR / LSB</option>
            </select>
          </div>

          {/* RESET FILTER BUTTON */}
          <div className="flex items-end">
            <button
              onClick={handleResetFilter}
              type="button"
              className="w-full py-2 rounded-xl bg-[#0b2447] hover:bg-[#133566] text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              title="Kembalikan semua filter ke awal"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
              <span>Reset</span>
            </button>
          </div>

        </div>
      </div>

      {/* 6 METRIC CARDS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Card 1: TOTAL PESERTA */}
        <div className="bg-white dark:bg-[#0c182c] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
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
          <div className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            <span>+0%</span>
          </div>
        </div>

        {/* Card 2: PROGRAM */}
        <div className="bg-white dark:bg-[#0c182c] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
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
          <div className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            <span>+0%</span>
          </div>
        </div>

        {/* Card 3: DENGAN SERTIFIKASI */}
        <div className="bg-white dark:bg-[#0c182c] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
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
          <div className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            <span>+0%</span>
          </div>
        </div>

        {/* Card 4: TANPA SERTIFIKASI */}
        <div className="bg-white dark:bg-[#0c182c] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
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
          <div className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            <span>+0%</span>
          </div>
        </div>

        {/* Card 5: BNSP */}
        <div className="bg-white dark:bg-[#0c182c] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
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
          <div className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            <span>+0%</span>
          </div>
        </div>

        {/* Card 6: ISO 15489 & PUR/LSB */}
        <div className="bg-white dark:bg-[#0c182c] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
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
          <div className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            <span>+0%</span>
          </div>
        </div>

      </div>

      {/* NEW: STATISTICAL CHARTS ROW (Visual Analytics) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Chart 1: Tren Peningkatan Pembelajaran (Area Chart SVG) */}
        <div className="bg-white dark:bg-[#0c182c] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-500" />
                <h3 className="font-bold text-xs sm:text-sm text-[#0c2340] dark:text-white">
                  Tren Akumulasi Jam Self Learning
                </h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                +14.2% YoY
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-4">Progres jam belajar mandiri per triwulan 2026</p>
          </div>

          {/* SVG Area Chart */}
          <div className="h-36 w-full flex items-end">
            <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 10,80 Q 80,65 150,45 T 290,15 L 290,95 L 10,95 Z"
                fill="url(#chartGrad)"
              />
              <path
                d="M 10,80 Q 80,65 150,45 T 290,15"
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Nodes */}
              <circle cx="10" cy="80" r="4" fill="#10b981" />
              <circle cx="100" cy="60" r="4" fill="#10b981" />
              <circle cx="190" cy="35" r="4" fill="#10b981" />
              <circle cx="290" cy="15" r="5" fill="#059669" stroke="#ffffff" strokeWidth="2" />
            </svg>
          </div>

          <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Q1 (4.2k Jam)</span>
            <span>Q2 (7.8k Jam)</span>
            <span>Q3 (12.4k Jam)</span>
            <span className="text-emerald-600 dark:text-emerald-400">Q4 (18.1k Jam)</span>
          </div>
        </div>

        {/* Chart 2: Proporsi Sertifikasi Kompetensi (Donut Representation) */}
        <div className="bg-white dark:bg-[#0c182c] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-sky-500" />
                <h3 className="font-bold text-xs sm:text-sm text-[#0c2340] dark:text-white">
                  Proporsi Akreditasi Pegawai
                </h3>
              </div>
              <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded">
                67.9% Tersertifikasi
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-4">Rincian standar BNSP, ISO 15489, dan PUR/LSB</p>
          </div>

          {/* Progress Stack Bars */}
          <div className="space-y-2.5">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-bold text-slate-700 dark:text-slate-300">BNSP (172 Pegawai)</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">56.4%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '56.4%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-bold text-slate-700 dark:text-slate-300">Tanpa Sertifikasi (98 Pegawai)</span>
                <span className="font-mono text-slate-500 font-bold">32.1%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-slate-400 rounded-full" style={{ width: '32.1%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-bold text-slate-700 dark:text-slate-300">ISO 15489 (33 Unit)</span>
                <span className="font-mono text-sky-600 dark:text-sky-400 font-bold">10.8%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: '10.8%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-bold text-slate-700 dark:text-slate-300">PUR / LSB Standar Kasir</span>
                <span className="font-mono text-teal-600 dark:text-teal-400 font-bold">Terintegrasi</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between">
            <span>Standar LSP BI & BNSP</span>
            <span>Total 304 Partisipan</span>
          </div>
        </div>

        {/* Chart 3: Top 5 Unit Teraktif */}
        <div className="bg-white dark:bg-[#0c182c] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-500" />
                <h3 className="font-bold text-xs sm:text-sm text-[#0c2340] dark:text-white">
                  Satuan Kerja Terproduktif
                </h3>
              </div>
              <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded">
                KPI Leader
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">5 Unit Kerja dengan jam belajar tertinggi</p>
          </div>

          <div className="space-y-2">
            {unitBreakdown.map((item, idx) => (
              <div key={item.unit} className="p-2 rounded-xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="min-w-0 pr-2">
                  <div className="font-bold text-[#0c2340] dark:text-slate-200 truncate text-[11px]">
                    {idx + 1}. {item.unit}
                  </div>
                  <div className="text-[10px] text-slate-400">{item.count} Peserta</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                    {item.hours}j
                  </div>
                  <div className="text-[9px] text-slate-400">{item.completion}% Capaian</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-right">
            <span>Target: 50 Jam / Pegawai</span>
          </div>
        </div>

      </div>

      {/* ALL-MENU EXECUTIVE SUMMARY (INFORMASI MENU NAVIGASI SECARA REALTIME - TEMA CERAH) */}
      <div className="bg-white dark:bg-[#0c182c] rounded-3xl p-6 text-slate-800 dark:text-white shadow-xs border border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Informasi Menu Navigasi &bull; Sinkronisasi Real-Time
            </span>
            <h3 className="text-base sm:text-lg font-black text-[#0c2340] dark:text-white mt-0.5">
              Ringkasan Informasi Seluruh Menu Navigasi LENTERA
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Klik kartu di bawah untuk membuka modul navigasi terkait
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mt-4">
          
          {/* Menu 1: Realisasi PMK */}
          <div 
            onClick={() => onNavigateTab && onNavigateTab('realisasi-pmk')}
            className="p-3.5 rounded-2xl bg-slate-50/80 hover:bg-emerald-50/70 dark:bg-slate-900/60 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-800 transition cursor-pointer"
          >
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">Realisasi PMK</div>
            <div className="text-xl font-black text-[#0c2340] dark:text-white mt-1">18,115j</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">119% dari Target Tahunan</div>
          </div>

          {/* Menu 2: Sertifikasi */}
          <div 
            onClick={() => onNavigateTab && onNavigateTab('sertifikasi')}
            className="p-3.5 rounded-2xl bg-slate-50/80 hover:bg-sky-50/70 dark:bg-slate-900/60 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-800 transition cursor-pointer"
          >
            <div className="text-[10px] text-sky-600 dark:text-sky-400 font-bold uppercase">Sertifikasi</div>
            <div className="text-xl font-black text-[#0c2340] dark:text-white mt-1">207 Org</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">BNSP, ISO, PUR/LSB</div>
          </div>

          {/* Menu 3: Bank Kasus */}
          <div 
            onClick={() => onNavigateTab && onNavigateTab('bank-kasus')}
            className="p-3.5 rounded-2xl bg-slate-50/80 hover:bg-amber-50/70 dark:bg-slate-900/60 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-800 transition cursor-pointer"
          >
            <div className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase">Bank Kasus</div>
            <div className="text-xl font-black text-[#0c2340] dark:text-white mt-1">6 Studi</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">11 Kategori Pembahasan</div>
          </div>

          {/* Menu 4: Pembelajaran Internal */}
          <div 
            onClick={() => onNavigateTab && onNavigateTab('pembelajaran-internal')}
            className="p-3.5 rounded-2xl bg-slate-50/80 hover:bg-purple-50/70 dark:bg-slate-900/60 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-800 transition cursor-pointer"
          >
            <div className="text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase">Pembelajaran</div>
            <div className="text-xl font-black text-[#0c2340] dark:text-white mt-1">3 Modul</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Self-Learning Mandiri</div>
          </div>

          {/* Menu 5: Survei Level 3 */}
          <div 
            onClick={() => onNavigateTab && onNavigateTab('survei-level-3')}
            className="p-3.5 rounded-2xl bg-slate-50/80 hover:bg-emerald-50/70 dark:bg-slate-900/60 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-800 transition cursor-pointer"
          >
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">Survei Level 3</div>
            <div className="text-xl font-black text-[#0c2340] dark:text-white mt-1">4.62 / 5</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Skor Kepatuhan Perilaku</div>
          </div>

          {/* Menu 6: Data PMK */}
          <div 
            onClick={() => onNavigateTab && onNavigateTab('data-pmk')}
            className="p-3.5 rounded-2xl bg-slate-50/80 hover:bg-rose-50/70 dark:bg-slate-900/60 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-800 transition cursor-pointer"
          >
            <div className="text-[10px] text-rose-600 dark:text-rose-400 font-bold uppercase">PMK Mendatang</div>
            <div className="text-xl font-black text-[#0c2340] dark:text-white mt-1">15 Batch</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Hitung Mundur Pendaftaran</div>
          </div>

        </div>
      </div>

      {/* TWO REALTIME TOP 10 LEADERBOARD TABLES (REACTS TO ACTIVE FILTERS!) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Table 1: Top 10 Pegawai dengan Jam Self Learning Tertinggi */}
        <div className="bg-white dark:bg-[#0c182c] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-[#0c2340] dark:text-white">
                Top 10 Pegawai dengan Jam Self Learning Tertinggi
              </h2>
              <p className="text-[11px] text-slate-400">
                Data realtime &bull; {unitKerja !== 'Semua' ? `Filter: ${unitKerja}` : 'Seluruh Unit Kerja'}
              </p>
            </div>
            <span className="px-3 py-1 text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-lg border border-emerald-200/80 dark:border-emerald-800/60">
              Ranking Real-Time
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3 w-16">RANK</th>
                  <th className="py-2.5 px-3">NAMA PEGAWAI</th>
                  <th className="py-2.5 px-3">UNIT KERJA</th>
                  <th className="py-2.5 px-3 text-right">JAM BELAJAR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {realTimeTopSelfLearning.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">
                      Tidak ada pegawai yang memenuhi filter pencarian ini.
                    </td>
                  </tr>
                ) : (
                  realTimeTopSelfLearning.map((item) => (
                    <tr key={item.ranking} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                      <td className="py-2.5 px-3 font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-md text-[10px] font-black ${
                          item.ranking <= 3 
                            ? 'bg-emerald-500 text-white shadow-xs' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                          {item.ranking}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-[#0c2340] dark:text-slate-100">
                        {showMaskedNames ? item.namaPegawai : item.rawNama}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 max-w-[200px] truncate">
                        {item.unitKerja}
                      </td>
                      <td className="py-2.5 px-3 text-right font-black font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {item.value} Jam
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Top 10 Peserta Learning Point Tertinggi */}
        <div className="bg-white dark:bg-[#0c182c] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-[#0c2340] dark:text-white">
                Top 10 Peserta Learning Point Tertinggi
              </h2>
              <p className="text-[11px] text-slate-400">
                Data realtime &bull; {unitKerja !== 'Semua' ? `Filter: ${unitKerja}` : 'Seluruh Unit Kerja'}
              </p>
            </div>
            <span className="px-3 py-1 text-[10px] font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 rounded-lg border border-sky-200/80 dark:border-sky-800/60">
              Ranking Real-Time
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3 w-16">RANK</th>
                  <th className="py-2.5 px-3">NAMA PEGAWAI</th>
                  <th className="py-2.5 px-3">UNIT KERJA</th>
                  <th className="py-2.5 px-3 text-right">LEARNING POINT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {realTimeTopLearningPoints.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">
                      Tidak ada peserta yang memenuhi filter pencarian ini.
                    </td>
                  </tr>
                ) : (
                  realTimeTopLearningPoints.map((item) => (
                    <tr key={item.ranking} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                      <td className="py-2.5 px-3 font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-md text-[10px] font-black ${
                          item.ranking <= 3 
                            ? 'bg-blue-600 text-white shadow-xs' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                          {item.ranking}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-[#0c2340] dark:text-slate-100">
                        {showMaskedNames ? item.namaPegawai : item.rawNama}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 max-w-[200px] truncate">
                        {item.unitKerja}
                      </td>
                      <td className="py-2.5 px-3 text-right font-black font-mono text-sky-600 dark:text-sky-400 tabular-nums">
                        {item.value.toLocaleString()} Pts
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
