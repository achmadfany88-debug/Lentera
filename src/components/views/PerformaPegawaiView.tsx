import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Award, 
  TrendingUp, 
  Filter, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Edit,
  X,
  ArrowRightLeft
} from 'lucide-react';
import { EmployeePerformance } from '../../types';
import { dataRepo, UNIT_KERJA_LIST } from '../../services/dataService';
import { exportMonthlyPDF } from '../../services/pdfExport';

export const PerformaPegawaiView: React.FC = () => {
  const [performanceList, setPerformanceList] = useState<EmployeePerformance[]>(() => dataRepo.getEmployeePerformanceList());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('Semua');
  const [selectedStatus, setSelectedStatus] = useState('Semua');
  const [expandedNip, setExpandedNip] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Edit Employee Modal State
  const [employeeToEdit, setEmployeeToEdit] = useState<EmployeePerformance | null>(null);
  const [editFullName, setEditFullName] = useState('');
  const [editNip, setEditNip] = useState('');
  const [editUnitKerja, setEditUnitKerja] = useState('');
  const [editTotalPmk, setEditTotalPmk] = useState(1);
  const [editHours, setEditHours] = useState(20);
  const [editPoints, setEditPoints] = useState(300);
  const [editScoreLevel3, setEditScoreLevel3] = useState(4.5);
  const [editStatus, setEditStatus] = useState<'Top Performer' | 'High Potential' | 'On Track' | 'Perlu Pendampingan'>('On Track');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3200);
  };

  const handleOpenEditModal = (emp: EmployeePerformance) => {
    setEmployeeToEdit(emp);
    setEditFullName(emp.fullName);
    setEditNip(emp.nip);
    setEditUnitKerja(emp.unitKerja);
    setEditTotalPmk(emp.totalPmkAttended);
    setEditHours(emp.totalSelfLearningHours);
    setEditPoints(emp.totalLearningPoints);
    setEditScoreLevel3(emp.behaviorScoreLevel3);
    setEditStatus(emp.performanceStatus);
  };

  const handleSaveEditEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeToEdit) return;

    const prevUnit = employeeToEdit.unitKerja;
    dataRepo.updateEmployeePerformance(employeeToEdit.nip, {
      nip: editNip.trim(),
      fullName: editFullName.trim(),
      unitKerja: editUnitKerja,
      totalPmkAttended: Number(editTotalPmk),
      totalSelfLearningHours: Number(editHours),
      totalLearningPoints: Number(editPoints),
      behaviorScoreLevel3: Number(editScoreLevel3),
      performanceStatus: editStatus,
    });

    setPerformanceList([...dataRepo.getEmployeePerformanceList()]);
    setEmployeeToEdit(null);

    if (prevUnit !== editUnitKerja) {
      showToast(`Rotasi Unit Kerja & data pegawai "${editFullName}" berhasil disimpan (${prevUnit} → ${editUnitKerja}).`);
    } else {
      showToast(`Data performa pegawai "${editFullName}" berhasil diperbarui.`);
    }
  };

  // Filtered performance records
  const filteredList = useMemo(() => {
    return performanceList.filter((item) => {
      const matchSearch = 
        item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nip.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.unitKerja.toLowerCase().includes(searchQuery.toLowerCase());
      const matchUnit = selectedUnit === 'Semua' || item.unitKerja === selectedUnit;
      const matchStatus = selectedStatus === 'Semua' || item.performanceStatus === selectedStatus;
      return matchSearch && matchUnit && matchStatus;
    });
  }, [performanceList, searchQuery, selectedUnit, selectedStatus]);

  // Statistics
  const topPerformers = performanceList.filter(p => p.performanceStatus === 'Top Performer').length;
  const highPotential = performanceList.filter(p => p.performanceStatus === 'High Potential').length;
  const onTrack = performanceList.filter(p => p.performanceStatus === 'On Track').length;
  const needSupport = performanceList.filter(p => p.performanceStatus === 'Perlu Pendampingan').length;

  const handleExportCSV = () => {
    const headers = ['NIP', 'Nama Pegawai', 'Unit Kerja', 'Total PMK Diikuti', 'Jam Self Learning', 'Learning Point', 'Skor Level 3', 'Skor Performa (0-100)', 'Status Performa'];
    const rows = filteredList.map(item => [
      `"${item.nip}"`,
      `"${item.fullName}"`,
      `"${item.unitKerja}"`,
      item.totalPmkAttended,
      item.totalSelfLearningHours,
      item.totalLearningPoints,
      item.behaviorScoreLevel3,
      item.overallPerformanceScore,
      `"${item.performanceStatus}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Performa_Pegawai_BI_Jatim_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    exportMonthlyPDF(dataRepo.getPMKData(), 'Performa Pegawai');
  };

  const toggleExpand = (nip: string) => {
    setExpandedNip(expandedNip === nip ? null : nip);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-2xl border border-emerald-500 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
            Matriks Evaluasi Kinerja & Pengembangan Pegawai
          </span>
          <h2 className="text-xl font-extrabold text-[#0f1c3f] dark:text-white mt-1">
            Matriks Performa Pegawai (Dual-Loop Learning)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Pemantauan menyeluruh kepatuhan jam pelatihan, keikutsertaan PMK, skor evaluasi perilaku Kirkpatrick Level 3, rotasi unit kerja, serta status performa seluruh pegawai BI Jatim.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Ekspor Excel (CSV)</span>
          </button>

          <button
            type="button"
            onClick={handleExportPDF}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Ekspor PDF Performa</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Top Performer</span>
          <div className="text-2xl font-black text-emerald-600 mt-1 tabular-nums">{topPerformers}</div>
          <span className="text-[10px] text-slate-400">Skor &ge; 90 (Kinerja Unggul)</span>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 uppercase">High Potential</span>
          <div className="text-2xl font-black text-sky-600 mt-1 tabular-nums">{highPotential}</div>
          <span className="text-[10px] text-slate-400">Skor 80 - 89 (Potensi Akselerasi)</span>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 uppercase">On Track</span>
          <div className="text-2xl font-black text-blue-600 mt-1 tabular-nums">{onTrack}</div>
          <span className="text-[10px] text-slate-400">Skor 70 - 79 (Target Tercapai)</span>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Perlu Pendampingan</span>
          <div className="text-2xl font-black text-amber-600 mt-1 tabular-nums">{needSupport}</div>
          <span className="text-[10px] text-slate-400">Skor &lt; 70 (Intervensi SDM)</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Cari berdasarkan nama, NIP, atau unit kerja pegawai..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
          >
            {UNIT_KERJA_LIST.map((unit) => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
          >
            <option value="Semua">Semua Status Performa</option>
            <option value="Top Performer">Top Performer</option>
            <option value="High Potential">High Potential</option>
            <option value="On Track">On Track</option>
            <option value="Perlu Pendampingan">Perlu Pendampingan</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">PEGAWAI / NIP</th>
                <th className="py-3 px-4">UNIT KERJA</th>
                <th className="py-3 px-4 text-center">KEIKUTSERTAAN PMK</th>
                <th className="py-3 px-4 text-center">JAM BELAJAR</th>
                <th className="py-3 px-4 text-center">LEARNING POINT</th>
                <th className="py-3 px-4 text-center">EVALUASI LEVEL 3</th>
                <th className="py-3 px-4 text-center">STATUS PERFORMA</th>
                <th className="py-3 px-4 text-right">AKSI & DETAIL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Tidak ditemukan data pegawai yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => {
                  const isExpanded = expandedNip === item.nip;
                  return (
                    <React.Fragment key={item.nip}>
                      <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 dark:text-white">{item.fullName}</div>
                          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{item.nip}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-700 dark:text-slate-300 max-w-[230px]">
                          <div className="truncate font-medium" title={item.unitKerja}>
                            {item.unitKerja}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-extrabold text-[11px]">
                            {item.totalPmkAttended} Sesi PMK
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-slate-800 dark:text-slate-200">
                          {item.totalSelfLearningHours} Jam
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-bold text-amber-600 dark:text-amber-400">{item.totalLearningPoints}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                            <span>{item.behaviorScoreLevel3.toFixed(2)}</span>
                            <span className="text-[10px] text-slate-400">/ 5.0</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            item.performanceStatus === 'Top Performer'
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                              : item.performanceStatus === 'High Potential'
                              ? 'bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300'
                              : item.performanceStatus === 'On Track'
                              ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                              : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                          }`}>
                            {item.performanceStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(item)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-600 text-sky-700 hover:text-white dark:bg-sky-950/60 dark:text-sky-300 dark:hover:bg-sky-600 dark:hover:text-white border border-sky-200/80 dark:border-sky-800 text-[11px] font-bold transition cursor-pointer"
                              title="Edit Data Pegawai & Rotasi Unit Kerja"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => toggleExpand(item.nip)}
                              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-sky-600 transition cursor-pointer"
                              title="Lihat riwayat topik pelatihan"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Riwayat Topik Pelatihan */}
                      {isExpanded && (
                        <tr className="bg-slate-50/60 dark:bg-slate-800/20">
                          <td colSpan={8} className="p-4 px-6 border-b border-slate-100 dark:border-slate-800">
                            <div className="space-y-2">
                              <h5 className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                                Riwayat Topik Pelatihan & Sertifikasi:
                              </h5>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {item.pmkHistory.map((hist, hIdx) => (
                                  <div key={hIdx} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                                    <div>
                                      <span className="font-bold text-slate-900 dark:text-white">{hist.programTitle}</span>
                                      <div className="text-[10px] text-slate-400">Tahun {hist.year} &bull; Nilai: {hist.score}</div>
                                    </div>
                                    <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                                      {hist.certType}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Edit Data Pegawai & Rotasi Unit Kerja */}
      {employeeToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#0c182c] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 flex items-center justify-center">
                  <Edit className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#0c2340] dark:text-white">
                    Edit Data & Rotasi Unit Kerja Pegawai
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Perbarui informasi pegawai, mutasi/rotasi satker, dan capaian pembelajaran
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEmployeeToEdit(null)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditEmployee} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Lengkap Pegawai <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    NIP Pegawai <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editNip}
                    onChange={(e) => setEditNip(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* Rotasi Unit Kerja Highlight Box */}
              <div className="p-3.5 rounded-xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-800/70 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-sky-900 dark:text-sky-300 flex items-center gap-1.5">
                    <ArrowRightLeft className="w-3.5 h-3.5 text-sky-600" />
                    <span>Unit Kerja (Mutasi / Rotasi Satker)</span>
                  </label>
                  {editUnitKerja !== employeeToEdit.unitKerja && (
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                      Rotasi Unit Kerja Aktif
                    </span>
                  )}
                </div>
                <select
                  value={editUnitKerja}
                  onChange={(e) => setEditUnitKerja(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-sky-300 dark:border-sky-700 rounded-xl px-3 py-2 font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
                >
                  {UNIT_KERJA_LIST.filter(u => u !== 'Semua').map((unit) => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
                {editUnitKerja !== employeeToEdit.unitKerja && (
                  <div className="text-[10.5px] text-sky-800 dark:text-sky-300">
                    Unit Kerja sebelumnya: <strong>{employeeToEdit.unitKerja}</strong> &rarr; Baru: <strong>{editUnitKerja}</strong>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Keikutsertaan PMK (Sesi)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={editTotalPmk}
                    onChange={(e) => setEditTotalPmk(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Jam Belajar (Jam)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="500"
                    value={editHours}
                    onChange={(e) => setEditHours(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Learning Point
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10000"
                    value={editPoints}
                    onChange={(e) => setEditPoints(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Evaluasi Level 3 (1.0 - 5.0)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="1.0"
                    max="5.0"
                    value={editScoreLevel3}
                    onChange={(e) => setEditScoreLevel3(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Status Performa
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white cursor-pointer"
                  >
                    <option value="Top Performer">Top Performer</option>
                    <option value="High Potential">High Potential</option>
                    <option value="On Track">On Track</option>
                    <option value="Perlu Pendampingan">Perlu Pendampingan</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEmployeeToEdit(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
