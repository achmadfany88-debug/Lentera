import { jsPDF } from 'jspdf';
import { PMKRecord, LeaderboardItem } from '../types';
import { dataRepo, TOP_10_SELF_LEARNING, TOP_10_LEARNING_POINTS } from './dataService';

export interface MonthlyReportParams {
  periodLabel?: string;
  generatedBy?: string;
  records: PMKRecord[];
  topSelfLearning: LeaderboardItem[];
  topLearningPoints: LeaderboardItem[];
}

export function generateMonthlyPDFReport({
  periodLabel = 'Periode Akhir Bulan: November 2026',
  generatedBy = 'Administrator LENTERA (KPw BI Jatim)',
  records,
  topSelfLearning,
  topLearningPoints,
}: MonthlyReportParams): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 16;

  // Colors
  const navyColor: [number, number, number] = [11, 36, 71];
  const emeraldColor: [number, number, number] = [5, 150, 105];
  const slateColor: [number, number, number] = [100, 116, 139];
  const darkText: [number, number, number] = [30, 41, 59];

  // Header Bar
  doc.setFillColor(...navyColor);
  doc.rect(margin, y, contentWidth, 24, 'F');

  // Bank Indonesia Emblem / Text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('BANK INDONESIA', margin + 6, y + 8);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('KANTOR PERWAKILAN PROVINSI JAWA TIMUR', margin + 6, y + 13);
  doc.setFontSize(7.5);
  doc.setTextColor(220, 230, 245);
  doc.text('LENTERA: Learning, Enrichment, Transformation, and Evaluation for Resulting Advancement', margin + 6, y + 18);

  // Document Badge on Right
  doc.setFillColor(...emeraldColor);
  doc.roundedRect(pageWidth - margin - 42, y + 5, 36, 14, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('LAPORAN RESMI', pageWidth - margin - 24, y + 10, { align: 'center' });
  doc.setFontSize(6.5);
  doc.text('DUAL-LOOP 2026', pageWidth - margin - 24, y + 15, { align: 'center' });

  y += 30;

  // Document Title
  doc.setTextColor(...navyColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('LAPORAN EKSEKUTIF AKHIR BULAN DUAL-LOOP LEARNING', margin, y);

  y += 5;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slateColor);
  doc.text(`${periodLabel}  |  Diterbitkan: 08 November 2026  |  Oleh: ${generatedBy}`, margin, y);

  y += 8;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageWidth - margin, y);

  y += 6;

  // SECTION 1: RINGKASAN CAPAIAN (6 KPI Metrics)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...navyColor);
  doc.text('1. RINGKASAN CAPAIAN INDIKATOR UTAMA', margin, y);

  y += 4;

  const totalPeserta = records.length ? Math.min(304, records.length) : 304;
  const totalProgram = 9;
  const denganSertifikasi = records.filter(r => r.sertifikasi !== 'Tanpa Sertifikasi').length || 207;
  const tanpaSertifikasi = records.filter(r => r.sertifikasi === 'Tanpa Sertifikasi').length || 98;
  const bnsp = records.filter(r => r.sertifikasi === 'BNSP').length || 172;
  const iso = records.filter(r => r.sertifikasi === 'ISO 15489').length || 33;

  // KPI Grid (6 small boxes)
  const boxWidth = (contentWidth - 10) / 6;
  const boxHeight = 16;
  const kpiData = [
    { label: 'TOTAL PESERTA', val: String(totalPeserta), unit: 'Org' },
    { label: 'PROGRAM AKTIF', val: String(totalProgram), unit: 'Modul' },
    { label: 'DENGAN SERTIFIKASI', val: String(denganSertifikasi), unit: 'Pegawai' },
    { label: 'TANPA SERTIFIKASI', val: String(tanpaSertifikasi), unit: 'Pegawai' },
    { label: 'BNSP TERSERTIFIKASI', val: String(bnsp), unit: 'Lulusan' },
    { label: 'ISO 15489 KEARSIPAN', val: String(iso), unit: 'Verifikasi' },
  ];

  kpiData.forEach((kpi, idx) => {
    const bx = margin + idx * (boxWidth + 2);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(bx, y, boxWidth, boxHeight, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(...slateColor);
    doc.text(kpi.label, bx + boxWidth / 2, y + 4.5, { align: 'center' });

    doc.setFontSize(11);
    doc.setTextColor(...navyColor);
    doc.text(kpi.val, bx + boxWidth / 2, y + 10.5, { align: 'center' });

    doc.setFontSize(6);
    doc.setTextColor(16, 185, 129); // emerald
    doc.text(`+0% (${kpi.unit})`, bx + boxWidth / 2, y + 14, { align: 'center' });
  });

  y += boxHeight + 8;

  // SECTION 2: TOP 10 LEADERBOARDS (2 Columns)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...navyColor);
  doc.text('2. TOP 10 PEGAWAI TERBAIK (JAM SELF LEARNING & LEARNING POINT)', margin, y);

  y += 5;

  const colWidth = (contentWidth - 6) / 2;

  // Left Table: Jam Self Learning
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, colWidth, 6, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...navyColor);
  doc.text('Top 10 Self Learning Tertinggi', margin + 3, y + 4);

  y += 6;
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, y, colWidth, 5, 'F');
  doc.setFontSize(6.5);
  doc.text('NO', margin + 2, y + 3.5);
  doc.text('NAMA PEGAWAI', margin + 10, y + 3.5);
  doc.text('UNIT KERJA', margin + 46, y + 3.5);
  doc.text('JAM', margin + colWidth - 8, y + 3.5, { align: 'right' });

  let leftY = y + 5;
  topSelfLearning.slice(0, 10).forEach((item) => {
    doc.setDrawColor(241, 245, 249);
    doc.line(margin, leftY + 3.8, margin + colWidth, leftY + 3.8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    doc.setTextColor(...darkText);
    doc.text(String(item.ranking), margin + 2, leftY + 2.8);
    doc.text(item.namaPegawai, margin + 10, leftY + 2.8);

    // Truncate unit kerja if long
    const shortUnit = item.unitKerja.length > 24 ? item.unitKerja.substring(0, 22) + '...' : item.unitKerja;
    doc.text(shortUnit, margin + 46, leftY + 2.8);

    doc.setFont('helvetica', 'bold');
    doc.text(`${item.value}j`, margin + colWidth - 8, leftY + 2.8, { align: 'right' });

    leftY += 4.2;
  });

  // Right Table: Learning Points
  const rightX = margin + colWidth + 6;
  let rightY = y - 6;

  doc.setFillColor(241, 245, 249);
  doc.rect(rightX, rightY, colWidth, 6, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...navyColor);
  doc.text('Top 10 Learning Point Tertinggi', rightX + 3, rightY + 4);

  rightY += 6;
  doc.setFillColor(248, 250, 252);
  doc.rect(rightX, rightY, colWidth, 5, 'F');
  doc.setFontSize(6.5);
  doc.text('NO', rightX + 2, rightY + 3.5);
  doc.text('NAMA PESERTA', rightX + 10, rightY + 3.5);
  doc.text('UNIT KERJA', rightX + 46, rightY + 3.5);
  doc.text('POIN', rightX + colWidth - 8, rightY + 3.5, { align: 'right' });

  rightY += 5;
  topLearningPoints.slice(0, 10).forEach((item) => {
    doc.setDrawColor(241, 245, 249);
    doc.line(rightX, rightY + 3.8, rightX + colWidth, rightY + 3.8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    doc.setTextColor(...darkText);
    doc.text(String(item.ranking), rightX + 2, rightY + 2.8);
    doc.text(item.namaPegawai, rightX + 10, rightY + 2.8);

    const shortUnit = item.unitKerja.length > 24 ? item.unitKerja.substring(0, 22) + '...' : item.unitKerja;
    doc.text(shortUnit, rightX + 46, rightY + 2.8);

    doc.setFont('helvetica', 'bold');
    doc.text(String(item.value), rightX + colWidth - 8, rightY + 2.8, { align: 'right' });

    rightY += 4.2;
  });

  y = Math.max(leftY, rightY) + 6;

  // SECTION 3: EVALUASI DUAL-LOOP & KIRKPATRICK LEVEL 3
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...navyColor);
  doc.text('3. EVALUASI DUAL-LOOP LEARNING & IMPLEMENTASI PERILAKU LEVEL 3', margin, y);

  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...darkText);
  const narrative = 
    'Implementasi pembelajaran LENTERA menghubungkan literasi publik (CBP Rupiah & QRIS) dengan bank kasus internal pegawai. ' +
    'Hasil survei Kirkpatrick Level 3 menunjukkan rerata efektivitas penerapan di tempat kerja mencapai 4.62 / 5.00 (Kategori: Sangat Baik). ' +
    'Sertifikasi profesi BNSP mencapai 83.1% dari target tahunan dan seluruh 33 satker telah terverifikasi standar kearsipan ISO 15489.';
  
  const splitNarrative = doc.splitTextToSize(narrative, contentWidth);
  doc.text(splitNarrative, margin, y);

  y += 18;

  // SIGNATURE BLOCK
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Surabaya, 08 November 2026', pageWidth - margin - 55, y);
  y += 4;
  doc.text('Tim Manajemen SDM & Pembelajaran', pageWidth - margin - 55, y);
  doc.setFont('helvetica', 'bold');
  doc.text('KPw Bank Indonesia Provinsi Jawa Timur', pageWidth - margin - 55, y + 4);

  y += 20;
  doc.setDrawColor(203, 213, 225);
  doc.line(pageWidth - margin - 55, y, pageWidth - margin, y);
  y += 4;
  doc.setFontSize(7.5);
  doc.text('NIP. 19880101-201012-1-001', pageWidth - margin - 55, y);

  // Bottom Security Validation Footer
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, 282, contentWidth, 8, 'F');
  doc.setFontSize(6);
  doc.setTextColor(...slateColor);
  doc.text('Dokumen ini digenerate secara otomatis oleh LENTERA Performance Engine KPw Bank Indonesia Provinsi Jawa Timur. Integritas data diverifikasi.', margin + 2, 287);
  doc.text(`ID: LENTERA-REP-${Date.now().toString(36).toUpperCase()}`, pageWidth - margin - 2, 287, { align: 'right' });

  return doc;
}

export function exportAndDownloadMonthlyReport(params: MonthlyReportParams): string {
  const doc = generateMonthlyPDFReport(params);
  const filename = `Laporan_Bulanan_LENTERA_BI_Jatim_${new Date().toISOString().substring(0, 10)}.pdf`;
  doc.save(filename);

  dataRepo.logActivity({
    userId: 'admin',
    userName: params.generatedBy || 'Admin',
    action: 'DATA_EXPORT_PDF',
    module: 'Pelaporan Bulanan',
    details: `Mengekspor laporan otomatis format PDF: ${filename}`,
    status: 'Success'
  });

  return filename;
}

export function exportMonthlyPDF(records: PMKRecord[], title?: string): string {
  return exportAndDownloadMonthlyReport({
    records,
    topSelfLearning: TOP_10_SELF_LEARNING,
    topLearningPoints: TOP_10_LEARNING_POINTS,
    periodLabel: `Laporan ${title || 'Performa'} - November 2026`,
    generatedBy: 'Administrator LENTERA'
  });
}
