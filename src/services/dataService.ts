import { 
  PMKRecord, 
  User, 
  AuditLog, 
  PushNotification, 
  CaseStudy, 
  LeaderboardItem,
  UpcomingPMKSession,
  PMKTopicRequest,
  SurveyLevel3Form,
  SurveySubmission,
  InternalCourse,
  CourseEnrollment,
  DigitalCertificate,
  EmployeePerformance,
  NavTabId,
  CertType
} from '../types';
import { appCache } from './cache';

export const ADMIN_SALT = 'e7b1a9c3d4f58201';

export const ALL_MENU_IDS: NavTabId[] = [
  'dashboard',
  'realisasi-pmk',
  'sertifikasi',
  'analisis-kompetensi',
  'bank-kasus',
  'pembelajaran-internal',
  'survei-level-3',
  'data-pmk',
  'performa-pegawai',
  'manajemen-user',
  'log-aktivitas',
  'tentang-lentera',
];

export const INITIAL_ADMIN_USER: User = {
  id: 'usr-admin-001',
  username: 'Admin',
  fullName: 'Administrator LENTERA',
  nip: '19880101-201012-1-001',
  email: 'admin.lentera@bi.go.id',
  role: 'Super Admin',
  unitKerja: 'BI Jatim',
  status: 'Aktif',
  createdAt: '2026-01-10 08:00:00',
  lastLogin: '2026-11-08 12:00:22',
  passwordHash: '',
  salt: ADMIN_SALT,
  allowedMenus: [...ALL_MENU_IDS],
};

export const PEGAWAI_DEFAULT_MENUS: NavTabId[] = [
  'dashboard',
  'realisasi-pmk',
  'sertifikasi',
  'bank-kasus',
  'pembelajaran-internal',
  'survei-level-3',
  'data-pmk',
  'tentang-lentera',
];

export const INITIAL_PEGAWAI_USER: User = {
  id: 'usr-pegawai-001',
  username: 'Pegawai',
  fullName: 'Pegawai BI Jatim',
  nip: '19920510-201601-1-007',
  email: 'pegawai.lentera@bi.go.id',
  role: 'Pegawai',
  unitKerja: 'Unit Implementasi Kebijakan SP & PK',
  status: 'Aktif',
  createdAt: '2026-01-15 08:30:00',
  lastLogin: '2026-11-08 08:00:00',
  passwordHash: '',
  salt: '9f8e7d6c5b4a3210',
  allowedMenus: [...PEGAWAI_DEFAULT_MENUS],
};

export const INITIAL_TEAM_USERS: User[] = [
  INITIAL_ADMIN_USER,
  INITIAL_PEGAWAI_USER,
  {
    id: 'usr-002',
    username: 'fany.achmad',
    fullName: 'Achmad Fany',
    nip: '19880912-201502-1-002',
    email: 'achmadfany88@bi.go.id',
    role: 'Admin',
    unitKerja: 'Unit Distribusi Uang',
    status: 'Aktif',
    createdAt: '2026-02-15 09:30:00',
    lastLogin: '2026-11-08 07:12:00',
    passwordHash: '',
    salt: 'f8c2b3d4e5a67890',
    allowedMenus: [...ALL_MENU_IDS],
  },
  {
    id: 'usr-003',
    username: 'rahma.siti',
    fullName: 'Siti Rahmawati',
    nip: '19910405-201701-2-003',
    email: 'siti.rahma@bi.go.id',
    role: 'Reviewer',
    unitKerja: 'Unit Implementasi Kebijakan SP & PK',
    status: 'Aktif',
    createdAt: '2026-03-01 10:00:00',
    lastLogin: '2026-11-07 16:45:00',
    passwordHash: '',
    salt: 'a1b2c3d4e5f60718',
    allowedMenus: [
      'dashboard',
      'realisasi-pmk',
      'sertifikasi',
      'analisis-kompetensi',
      'bank-kasus',
      'pembelajaran-internal',
      'survei-level-3',
      'data-pmk',
      'performa-pegawai',
      'tentang-lentera',
    ],
  },
  {
    id: 'usr-004',
    username: 'budi.santoso',
    fullName: 'Budi Santoso',
    nip: '19851120-201103-1-004',
    email: 'budi.s@bi.go.id',
    role: 'Pegawai',
    unitKerja: 'Unit Keuangan',
    status: 'Aktif',
    createdAt: '2026-03-12 11:15:00',
    lastLogin: '2026-11-06 14:20:00',
    passwordHash: '',
    salt: '123456789abcdef0',
    allowedMenus: [...PEGAWAI_DEFAULT_MENUS],
  },
  {
    id: 'usr-005',
    username: 'eka.maharani',
    fullName: 'Eka Maharani',
    nip: '19930718-201902-2-005',
    email: 'eka.m@bi.go.id',
    role: 'Pegawai',
    unitKerja: 'Unit Layanan dan Pengolahan Uang',
    status: 'Aktif',
    createdAt: '2026-04-05 13:00:00',
    lastLogin: '2026-11-05 10:05:00',
    passwordHash: '',
    salt: '0fedcba987654321',
    allowedMenus: [...PEGAWAI_DEFAULT_MENUS],
  },
  {
    id: 'usr-006',
    username: 'hendra.kusuma',
    fullName: 'Hendra Kusuma',
    nip: '19890214-201402-1-006',
    email: 'hendra.k@bi.go.id',
    role: 'Pegawai',
    unitKerja: 'KPKW',
    status: 'Nonaktif',
    createdAt: '2026-04-18 14:20:00',
    lastLogin: '2026-10-15 09:00:00',
    passwordHash: '',
    salt: '4a5b6c7d8e9f0123',
    allowedMenus: [...PEGAWAI_DEFAULT_MENUS],
  }
];

// Unit Kerja List with "Unit Kehumasan" added per item 16
export const UNIT_KERJA_LIST = [
  'Semua',
  'Unit Distribusi Uang',
  'Unit Logistik, SDM, Sekre, Protokol, dan Pengamanan',
  'Unit Implementasi Kebijakan SP & PK',
  'Unit Layanan dan Pengolahan Uang',
  'Unit Keuangan',
  'KPKW',
  'Unit SPPUR',
  'Unit Koor Implementasi KEKDA WILAYAH',
  'Unit Implementasi Pengembangan IEKB & Eksyar',
  'Unit Implementasi Ketahanan Pangan',
  'Unit Kehumasan',
];

export const BANK_KASUS_CATEGORIES = [
  'Semua',
  'CBP Rupiah',
  'Digitalisasi / QRIS',
  'Perlindungan Konsumen',
  'UMKM',
  'Ekonomi Syariah',
  'Kebanksentralan',
  'Ekonomi & Inflasi',
  'Ketahanan Pangan',
  'Data & Statistik',
  'Kehumasan',
];

export const TOP_10_SELF_LEARNING: LeaderboardItem[] = [
  { ranking: 1, namaPegawai: 'An***** Sa*****', rawNama: 'Ananda Saputra', unitKerja: 'Unit Distribusi Uang', value: 98 },
  { ranking: 2, namaPegawai: 'Sa***** Na******', rawNama: 'Satria Nugroho', unitKerja: 'Unit Logistik, SDM, Sekre, Protokol, dan Pengamanan', value: 94 },
  { ranking: 3, namaPegawai: 'Sa***** Ra*****', rawNama: 'Safira Ramadhani', unitKerja: 'Unit Implementasi Kebijakan SP & PK', value: 91 },
  { ranking: 4, namaPegawai: 'Fa***** Ma******', rawNama: 'Fajar Maulana', unitKerja: 'Unit Layanan dan Pengolahan Uang', value: 89 },
  { ranking: 5, namaPegawai: 'Tr***** Hi******', rawNama: 'Tri Hidayat', unitKerja: 'Unit Layanan dan Pengolahan Uang', value: 86 },
  { ranking: 6, namaPegawai: 'Ek***** Ma******', rawNama: 'Eka Mardiana', unitKerja: 'Unit Layanan dan Pengolahan Uang', value: 82 },
  { ranking: 7, namaPegawai: 'Sa***** Ut*****', rawNama: 'Salma Utami', unitKerja: 'Unit Logistik, SDM, Sekre, Protokol, dan Pengamanan', value: 79 },
  { ranking: 8, namaPegawai: 'He***** Su*****', rawNama: 'Herman Susanto', unitKerja: 'KPKW', value: 76 },
  { ranking: 9, namaPegawai: 'De***** Yu******', rawNama: 'Dewi Yuliana', unitKerja: 'Unit Implementasi Ketahanan Pangan', value: 73 },
  { ranking: 10, namaPegawai: 'Ba***** Fe********', rawNama: 'Bagas Febriyanto', unitKerja: 'Unit Keuangan', value: 70 },
];

export const TOP_10_LEARNING_POINTS: LeaderboardItem[] = [
  { ranking: 1, namaPegawai: 'Ir***** Pu*****', rawNama: 'Irawan Purnama', unitKerja: 'Unit Keuangan', value: 1450 },
  { ranking: 2, namaPegawai: 'Ha*****', rawNama: 'Hadiyanto', unitKerja: 'KPKW', value: 1380 },
  { ranking: 3, namaPegawai: 'Fa***** Wa*****', rawNama: 'Faisal Wardhana', unitKerja: 'Unit SPPUR', value: 1320 },
  { ranking: 4, namaPegawai: 'Ag***** Pu*****', rawNama: 'Agus Purnomo', unitKerja: 'Unit Layanan dan Pengolahan Uang', value: 1290 },
  { ranking: 5, namaPegawai: 'Ha***** Ku********', rawNama: 'Hartono Kusworo', unitKerja: 'Unit Implementasi Kebijakan SP & PK', value: 1250 },
  { ranking: 6, namaPegawai: 'Re*****', rawNama: 'Renaldi', unitKerja: 'Unit Koor Implementasi KEKDA WILAYAH', value: 1210 },
  { ranking: 7, namaPegawai: 'Ri***** Pe*****', rawNama: 'Rian Permadi', unitKerja: 'Unit Layanan dan Pengolahan Uang', value: 1180 },
  { ranking: 8, namaPegawai: 'In***** Pu*****', rawNama: 'Indah Puspita', unitKerja: 'Unit Implementasi Pengembangan IEKB & Eksyar', value: 1140 },
  { ranking: 9, namaPegawai: 'An***** Ca*****', rawNama: 'Andi Cahyono', unitKerja: 'Unit Layanan dan Pengolahan Uang', value: 1110 },
  { ranking: 10, namaPegawai: 'Fi***** Na*******', rawNama: 'Firman Nasution', unitKerja: 'Unit Logistik, SDM, Sekre, Protokol, dan Pengamanan', value: 1080 },
];

export const PROGRAM_LIST = [
  'Dual-Loop SP & Kebijakan PK',
  'Literasi CBP Rupiah & Edukasi Publik',
  'Audit Manajemen Rekod & Kearsipan ISO 15489',
  'Sertifikasi Kompetensi Pengelolaan Uang Rupiah (BNSP)',
  'Standarisasi Kasir & Verifikasi Keaslian Uang (PUR / LSB)',
  'Analisis Makroprudensial & KEKDA Wilayah',
  'Akselerasi Digitalisasi Sistem Pembayaran & QRIS',
  'E-Learning Cyber Defense & Data Privacy Bank Sentral',
  'Workshop Ekonomi & Keuangan Syariah Inklusif',
  'Strategi Komunikasi Kebijakan Publik & Kehumasan',
  'Leadership & Execution Excellence Forum',
];

const FIRST_NAMES = [
  'Ananda', 'Satria', 'Safira', 'Fajar', 'Tri', 'Eka', 'Salma', 'Herman', 'Dewi', 'Bagas',
  'Irawan', 'Hadiyanto', 'Faisal', 'Agus', 'Hartono', 'Renaldi', 'Rian', 'Indah', 'Andi', 'Firman',
  'Rizky', 'Nadia', 'Bima', 'Ayu', 'Dimas', 'Putri', 'Reza', 'Siti', 'Bayu', 'Lestari',
  'Arif', 'Maya', 'Gilang', 'Nabila', 'Yoga', 'intan', 'Wahyu', 'Kartika', 'Aditya', 'Ratna',
  'Dian', 'Hendra', 'Citra', 'Taufik', 'Mega', 'lukman', 'Farah', 'Ilham', 'Widya', 'Rama'
];

const LAST_NAMES = [
  'Saputra', 'Nugroho', 'Ramadhani', 'Maulana', 'Hidayat', 'Mardiana', 'Utami', 'Susanto', 'Yuliana', 'Febriyanto',
  'Purnama', 'Kusuma', 'Wardhana', 'Purnomo', 'Kusworo', 'Pratama', 'Permadi', 'Puspita', 'Cahyono', 'Nasution',
  'Wibowo', 'Santoso', 'Rahmawati', 'Setiawan', 'Handayani', 'Wijaya', 'Laksamana', 'Syahputra', 'Anggraini', 'Hakim',
  'Gunawan', 'Permatasari', 'Kurniawan', 'Oktaviani', 'Budiman', 'Maharani', 'Suryadi', 'Pratiwi', 'firdaus', 'winarno'
];

export function getRealisticEmployeeName(index: number): string {
  if (index >= 1 && index <= 10) {
    return TOP_10_SELF_LEARNING[index - 1].rawNama;
  }
  if (index >= 11 && index <= 20) {
    return TOP_10_LEARNING_POINTS[index - 11].rawNama;
  }
  const f = FIRST_NAMES[(index * 7) % FIRST_NAMES.length];
  const l = LAST_NAMES[(index * 13 + 3) % LAST_NAMES.length];
  const capF = f.charAt(0).toUpperCase() + f.slice(1);
  const capL = l.charAt(0).toUpperCase() + l.slice(1);
  return `${capF} ${capL}`;
}

// Generate 304 master records
export function generateInitialPMKData(): PMKRecord[] {
  const records: PMKRecord[] = [];
  const units = UNIT_KERJA_LIST.slice(1);
  const categories = [
    'Teknis Kebanksentralan',
    'Digital & IT',
    'Manajerial',
    'Kepatuhan & Hukum',
    'Operasional & Kas',
    'Kehumasan'
  ];
  const programTypes = ['Self Learning', 'Workshop', 'Sertifikasi Profesi', 'E-Learning', 'On the Job Training'];

  for (let i = 1; i <= 304; i++) {
    const id = `pmk-2026-${String(i).padStart(4, '0')}`;
    const nip = `199${Math.floor(10 + (i % 80))}0${(i % 9) + 1}${String(10 + (i % 18))}-201${Math.floor(i % 10)}0${(i % 8) + 1}-1-${String(i).padStart(3, '0')}`;
    
    // Exact quotas
    let sertifikasi: CertType = 'Tanpa Sertifikasi';
    if (i <= 172) {
      sertifikasi = 'BNSP';
    } else if (i <= 172 + 33) {
      sertifikasi = 'ISO 15489';
    } else if (i <= 172 + 33 + 2) {
      sertifikasi = 'PUR / LSB';
    } else {
      sertifikasi = 'Tanpa Sertifikasi';
    }

    const unitKerja = units[(i - 1) % units.length];
    const programIndex = (i - 1) % PROGRAM_LIST.length;
    const judulProgram = PROGRAM_LIST[programIndex];
    const kategori = categories[programIndex % categories.length];
    const jenisProgram = programTypes[(i - 1) % programTypes.length];
    const jamSelfLearning = 20 + Math.floor(((i * 11) % 79));
    const learningPoint = 300 + Math.floor(((i * 37) % 1150));
    const statusPmk: 'Selesai' | 'On-Going' | 'Terjadwal' = 
      i % 12 === 0 ? 'On-Going' : (i % 30 === 0 ? 'Terjadwal' : 'Selesai');
    const surveyScore = Math.round((4.0 + ((i % 10) / 10)) * 10) / 10;

    const namaPegawai = getRealisticEmployeeName(i);

    records.push({
      id,
      nip,
      namaPegawai,
      unitKerja,
      judulProgram,
      kategori,
      jenisProgram,
      jamSelfLearning,
      learningPoint,
      sertifikasi,
      statusPmk,
      tahun: '2026',
      periode: i % 4 === 0 ? 'Q1' : (i % 4 === 1 ? 'Q2' : (i % 4 === 2 ? 'Q3' : 'Q4')),
      tanggalSelesai: `2026-10-${String((i % 28) + 1).padStart(2, '0')}`,
      nilaiSurveiLevel3: Math.min(5.0, surveyScore),
    });
  }

  return records;
}

// 15 Upcoming PMK Sessions
export function generateUpcomingPMKSessions(): UpcomingPMKSession[] {
  const now = new Date();
  const sessions: UpcomingPMKSession[] = [];
  const certOptions: ('BNSP' | 'ISO 15489' | 'PUR / LSB' | 'Tanpa Sertifikasi')[] = [
    'BNSP', 'PUR / LSB', 'ISO 15489', 'BNSP', 'Tanpa Sertifikasi',
    'PUR / LSB', 'BNSP', 'ISO 15489', 'BNSP', 'PUR / LSB',
    'ISO 15489', 'BNSP', 'Tanpa Sertifikasi', 'PUR / LSB', 'BNSP'
  ];

  const topics = [
    'Sertifikasi Pengelolaan Uang Rupiah & Anti-Uang Palsu Batch IV',
    'Standarisasi Manajemen Rekod Transaksi Keuangan ISO 15489',
    'Uji Kompetensi Kasir Bank Sentral dan Teller PUR / LSB 2026',
    'Akselerasi QRIS Antarnegara & Mitigasi Risiko Transaksi Digital',
    'Strategi Komunikasi Kebijakan Publik & Kehumasan Efektif BI Jatim',
    'Audit Kepatuhan Kearsipan Dinamis ISO 15489 Tingkat Lanjut',
    'Workshop Implementasi CBP Rupiah di Wilayah Terdepan & 3T',
    'Analitik Big Data Transaksi Keuangan & Neraca Pangan Regional',
    'Sertifikasi Profesi Penanganan Uang Rupiah Lusuh & Khazanah Kas',
    'Ekonomi & Keuangan Syariah: Standardisasi Halal Value Chain',
    'Perlindungan Konsumen Sistem Pembayaran & Penanganan Pengaduan',
    'Cyber Defense & Incident Response Karyawan Bank Sentral',
    'Mitigasi Inflasi Volatile Food & Sinergi GNPIP Jawa Timur',
    'Manajemen Likuiditas Perbankan & Kebijakan Makroprudensial',
    'Leadership Execution Excellence bagi Calon Asisten Manajer'
  ];

  for (let i = 1; i <= 15; i++) {
    const daysAhead = 3 + i * 3;
    const targetDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
    const deadlineDate = new Date(targetDate.getTime() - 2 * 24 * 60 * 60 * 1000);

    const maxParticipants = 25 + (i % 3) * 5; // 25, 30, 35
    const regCount = Math.floor(10 + (i * 3) % 18);

    const initialParticipants: { id: string; nip: string; namaPegawai: string; unitKerja: string; registeredAt: string; email: string }[] = [];
    for (let p = 1; p <= regCount; p++) {
      const empName = getRealisticEmployeeName((i * 5 + p) % 250 + 1);
      initialParticipants.push({
        id: `reg-${i}-${p}`,
        nip: `199${(p * 7) % 90}-201${p % 9}-1-0${p}`,
        namaPegawai: empName,
        unitKerja: UNIT_KERJA_LIST[(p % (UNIT_KERJA_LIST.length - 1)) + 1],
        registeredAt: new Date(now.getTime() - (regCount - p) * 3600000).toISOString().replace('T', ' ').substring(0, 19),
        email: `${empName.toLowerCase().replace(/\s+/g, '.')}@bi.go.id`
      });
    }

    sessions.push({
      id: `pmk-session-${i}`,
      batchNumber: 202600 + i,
      topicTitle: topics[i - 1],
      executionDate: targetDate.toISOString().substring(0, 10),
      executionTime: '08:30 - 16:00 WIB',
      location: i % 2 === 0 ? 'Auditorium KPw Bank Indonesia Provinsi Jawa Timur' : 'Ruang Pelatihan Serbaguna Lt. 4 BI Jatim',
      certType: certOptions[i - 1],
      trainerName: i % 3 === 0 ? 'Master Trainer Bank Indonesia Institute (BINS)' : 'Lembaga Sertifikasi Profesi (LSP) Perbankan',
      maxParticipants,
      registeredParticipants: initialParticipants,
      registrationDeadline: deadlineDate.toISOString(),
      status: regCount >= maxParticipants ? 'Full' : 'Open',
      description: `Sesi pelatihan intensif untuk memperkuat kompetensi pegawai dalam bidang ${topics[i - 1]} dengan kurikulum standar asesmen terkini.`
    });
  }

  return sessions;
}

// Initial Bank Kasus with 11 Categories, Reactions, Likes & Comments
export const INITIAL_CASE_STUDIES: CaseStudy[] = [
  {
    id: 'CS-01',
    title: 'Akselerasi QRIS Antarnegara & Digitalisasi Pasar Tradisional Wonokromo',
    authorUnit: 'Unit Implementasi Kebijakan SP & PK',
    targetAudience: 'Pedagang Pasar & Pelaku UMKM Retail',
    date: '2026-10-24',
    summary: 'Studi kasus implementasi pembayaran nirsentuh QRIS di pasar tradisional Surabaya, mengatasi friksi literasi keuangan pedagang melalui pendampingan mikro.',
    category: 'Digitalisasi / QRIS',
    downloads: 342,
    dualLoopImpact: 'Umpan balik pasar menjadi masukan kurikulum modul pembelajaran internal pegawai sistem pembayaran ritel.',
    tags: ['QRIS', 'Digitalisasi', 'Pasar Tradisional', 'Inklusi Keuangan'],
    feedbackType: 'Studi Kasus',
    issueTopic: 'Penetrasi QRIS Pasar Basah',
    likes: 48,
    hasLiked: false,
    comments: [
      {
        id: 'c1',
        authorName: 'Siti Rahmawati',
        authorUnit: 'Unit Implementasi Kebijakan SP & PK',
        authorRole: 'Reviewer',
        timestamp: '2 jam yang lalu',
        comment: 'Kasus ini sangat relevan untuk dieksplorasi lebih lanjut terutama terkait kendala jaringan seluler pedagang sayur.',
        emojiReaction: '💡'
      },
      {
        id: 'c2',
        authorName: 'Achmad Fany',
        authorUnit: 'Unit Distribusi Uang',
        authorRole: 'Admin',
        timestamp: '1 jam yang lalu',
        comment: 'Sangat setuju, data di Wonokromo ini bisa menjadi model bagi pasar tradisional lain di Madura.',
        emojiReaction: '👏'
      }
    ]
  },
  {
    id: 'CS-02',
    title: 'Edukasi CBP Rupiah di Gugusan Kepulauan Sumenep & Madura',
    authorUnit: 'Unit Distribusi Uang',
    targetAudience: 'Masyarakat Pesisir & Pelajar 3T',
    date: '2026-09-18',
    summary: 'Eksplorasi penarikan uang lusuh dan sosialisasi Cinta, Bangga, Paham (CBP) Rupiah menggunakan kapal kas keliling di pulau terluar.',
    category: 'CBP Rupiah',
    downloads: 418,
    dualLoopImpact: 'Tantangan logistik maritim ditransformasikan menjadi SOP operasional distribusi uang kepulauan.',
    tags: ['CBP Rupiah', 'Kas Keliling', 'Kepulauan', 'Clean Money Policy'],
    feedbackType: 'Feedback',
    issueTopic: 'Tantangan Distribusi Kas Maritim 3T',
    likes: 62,
    hasLiked: true,
    comments: [
      {
        id: 'c3',
        authorName: 'Budi Santoso',
        authorUnit: 'Unit Keuangan',
        authorRole: 'Pegawai',
        timestamp: '3 jam yang lalu',
        comment: 'Luar biasa dedikasi tim kas keliling! Semoga ada penambahan kapal untuk tahun depan.',
        emojiReaction: '🔥'
      }
    ]
  },
  {
    id: 'CS-03',
    title: 'Strategi Komunikasi Publik BI Jatim dalam Mengawal Stabilitas Rupiah',
    authorUnit: 'Unit Kehumasan',
    targetAudience: 'Media Massa, Mahasiswa & Masyarakat Umum',
    date: '2026-10-30',
    summary: 'Optimalisasi kanal media sosial dan rilis pers resmi untuk mengklarifikasi disinformasi moneter di wilayah Jawa Timur secara cepat dan persuasif.',
    category: 'Kehumasan',
    downloads: 215,
    dualLoopImpact: 'Penyusunan playbook komunikasi krisis berbasis studi sentimen publik.',
    tags: ['Kehumasan', 'Media Relation', 'Komunikasi Kebijakan', 'Anti Hoaks'],
    feedbackType: 'Pertanyaan',
    issueTopic: 'Mitigasi Berita Moneter di Media Sosial',
    likes: 35,
    hasLiked: false,
    comments: []
  },
  {
    id: 'CS-04',
    title: 'Mitigasi Volatile Food Melalui Neraca Pangan Digital & GNPIP Malang',
    authorUnit: 'Unit Implementasi Ketahanan Pangan',
    targetAudience: 'Kelompok Tani Cabai & Bawang Merah',
    date: '2026-10-05',
    summary: 'Integrasi IoT smart greenhouse dan fasilitasi pembiayaan rantai pasok untuk menstabilkan harga komoditas pangan pokok Jatim.',
    category: 'Ketahanan Pangan',
    downloads: 295,
    dualLoopImpact: 'Evaluasi program melahirkan modul analitik inflasi daerah berpresisi tinggi.',
    tags: ['GNPIP', 'Inflasi Pangan', 'IoT Pertanian', 'Neraca Pangan'],
    feedbackType: 'Studi Kasus',
    issueTopic: 'Fluktuasi Harga Komoditas Cabai',
    likes: 41,
    hasLiked: false,
    comments: []
  },
  {
    id: 'CS-05',
    title: 'Perlindungan Konsumen FinTech dan Penyelesaian Sengketa SP di Jatim',
    authorUnit: 'Unit SPPUR',
    targetAudience: 'Konsumen Jasa Sistem Pembayaran',
    date: '2026-10-12',
    summary: 'Mekanisme mediasi terintegrasi terhadap keluhan transaksi dompet digital dan kegagalan transfer BI-FAST.',
    category: 'Perlindungan Konsumen',
    downloads: 180,
    dualLoopImpact: 'Penyempurnaan modul mitigasi komplain nasabah untuk seluruh staf frontliner.',
    tags: ['Perlindungan Konsumen', 'BI-FAST', 'Fintech', 'Mediasi'],
    feedbackType: 'Feedback',
    issueTopic: 'Penanganan Friksi Transaksi BI-FAST',
    likes: 29,
    hasLiked: false,
    comments: []
  },
  {
    id: 'CS-06',
    title: 'Kurasi UMKM Binaan Unggulan Ekspor dan Digital Onboarding Jatim',
    authorUnit: 'Unit Implementasi Pengembangan IEKB & Eksyar',
    targetAudience: 'Pelaku Usaha Mikro, Kecil, dan Menengah',
    date: '2026-09-29',
    summary: 'Standardisasi proses kurasi produk kopi dan kriya Jawa Timur menuju pasar global.',
    category: 'UMKM',
    downloads: 310,
    dualLoopImpact: 'Modul kurasi ekspor dijadikan materi pelatihan wajib pegawai satker ekonomi daerah.',
    tags: ['UMKM', 'Ekspor', 'Kriya', 'Digital Onboarding'],
    feedbackType: 'Studi Kasus',
    issueTopic: 'Standardisasi Ekspor UMKM',
    likes: 54,
    hasLiked: false,
    comments: []
  }
];

// Initial Internal Learning Courses
export const INITIAL_INTERNAL_COURSES: InternalCourse[] = [
  {
    id: 'CRS-01',
    title: 'Masterclass Dual-Loop Learning & Kebijakan Sistem Pembayaran',
    description: 'Pelajari konsep fundamental dan transformasi model pembelajaran organisasi bank sentral dalam menghadapi disrupsi sistem pembayaran digital.',
    category: 'Teknis Kebanksentralan',
    instructor: 'Dr. Hendra Wibowo, S.E., M.Ec. (Senior Advisor BINS)',
    level: 'Advanced',
    certType: 'BNSP',
    totalDurationHours: 8,
    learningPoints: 120,
    rating: 4.95,
    enrolledStudentsCount: 142,
    publishedBy: 'Administrator LENTERA',
    publishedAt: '2026-10-15',
    isPublished: true,
    lessons: [
      {
        id: 'les-1',
        title: 'Bab 1: Konsep Single-Loop vs Double-Loop Learning',
        durationMinutes: 45,
        contentMarkdown: 'Single-loop learning berfokus pada deteksi dan koreksi kesalahan operasional tanpa mengubah tujuan atau nilai dasar. Sebaliknya, double-loop learning mempertanyakan norma dan asumsi yang mendasari kebijakan.',
        keyPoints: [
          'Definisi Chris Argyris tentang Organizational Learning',
          'Aplikasi koreksi deviasi di sistem perbankan sentral',
          'Metamorfosis umpan balik publik menjadi inovasi regulasi'
        ]
      },
      {
        id: 'les-2',
        title: 'Bab 2: Integrasi Literasi Publik & Penetrasi QRIS Jawa Timur',
        durationMinutes: 60,
        contentMarkdown: 'Evolusi transaksi digital membutuhkan pemahaman mendalam tentang perilaku pedagang pasar tradisional.',
        keyPoints: [
          'Studi kasus friksi pedagang di pasar basah Wonokromo',
          'Pemanfaatan data transaksi untuk penyesuaian regulasi',
          'Keamanan data nasabah dan anti-fraud'
        ]
      }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Apakah perbedaan mendasar antara Single-Loop dan Double-Loop Learning?',
        options: [
          'Single-loop mengoreksi tindakan dalam aturan yang ada; Double-loop mengevaluasi dan merestrukturisasi asumsi/aturan dasar.',
          'Single-loop hanya berlaku untuk pimpinan; Double-loop untuk staf.',
          'Single-loop berbasis teori; Double-loop berbasis digital.',
          'Tidak ada perbedaan, keduanya adalah metode yang sama.'
        ],
        correctIndex: 0,
        explanation: 'Double-loop learning secara aktif menelaah kembali variabel dasar dan asumsi yang melandasi suatu tindakan.'
      },
      {
        id: 'q2',
        question: 'Bagaimana LENTERA mengaplikasikan Double-Loop Learning di Bank Indonesia Jawa Timur?',
        options: [
          'Hanya menghitung jam kehadiran seminar',
          'Menghubungkan data studi kasus literasi publik kembali ke kurikulum pembelajaran internal pegawai',
          'Menghapus ujian sertifikasi profesi',
          'Mengabaikan masukan dari masyarakat'
        ],
        correctIndex: 1,
        explanation: 'LENTERA menyerap umpan balik masyarakat sebagai masukan bagi kurikulum dan kebijakan baru.'
      }
    ]
  },
  {
    id: 'CRS-02',
    title: 'Sertifikasi Keahlian Pengelolaan Uang Rupiah (PUR / LSB & BNSP)',
    description: 'Panduan lengkap standar uji kompetensi kasir, verifikasi keaslian uang, dan manajemen kas khazanah Bank Indonesia.',
    category: 'Operasional & Kas',
    instructor: 'Ir. Bambang Sugiarto (Lead Assessor LSP Perbankan)',
    level: 'Sertifikasi',
    certType: 'PUR / LSB',
    totalDurationHours: 16,
    learningPoints: 250,
    rating: 4.90,
    enrolledStudentsCount: 172,
    publishedBy: 'Administrator LENTERA',
    publishedAt: '2026-09-20',
    isPublished: true,
    lessons: [
      {
        id: 'les-3',
        title: 'Bab 1: Fitur Pengaman Rupiah Emisi Terbaru & 3D Detection',
        durationMinutes: 50,
        contentMarkdown: 'Uji petik keaslian rupiah memerlukan penguasaan teknologi benang pengaman dan rectoverso terkini.',
        keyPoints: [
          'Identifikasi unsur pengaman terbuka dan semi-tertutup',
          'Teknik pemilahan uang tidak layak edar (UTLE)',
          'Prosedur kas keliling kepulauan terluar'
        ]
      }
    ],
    quiz: [
      {
        id: 'q3',
        question: 'Ciri utama uang rupiah asli dengan fitur rectoverso adalah:',
        options: [
          'Logo Bank Indonesia yang saling mengisi secara sempurna jika diterawangkan ke cahaya',
          'Tekstur kertas yang sangat licin mengkilap',
          'Tinta yang dapat luntur jika terkena air',
          'Warna uang berubah setiap jam'
        ],
        correctIndex: 0,
        explanation: 'Rectoverso merupakan gambar saling isi logo BI yang presisi ketika diterawang.'
      }
    ]
  },
  {
    id: 'CRS-03',
    title: 'Audit Manajemen Rekod & Kearsipan Berbasis Standar ISO 15489',
    description: 'Tata kelola penyimpanan, retensi, dan keamanan arsip digital untuk memenuhi audit kepatuhan lembaga bank sentral.',
    category: 'Kepatuhan & Hukum',
    instructor: 'Dewi Anggraini, M.Hum. (Auditor ISO Kearsipan)',
    level: 'Intermediate',
    certType: 'ISO 15489',
    totalDurationHours: 10,
    learningPoints: 150,
    rating: 4.88,
    enrolledStudentsCount: 98,
    publishedBy: 'Administrator LENTERA',
    publishedAt: '2026-10-01',
    isPublished: true,
    lessons: [
      {
        id: 'les-4',
        title: 'Bab 1: Prinsip Tata Kelola Rekod Dinamis',
        durationMinutes: 40,
        contentMarkdown: 'Standar ISO 15489 menetapkan kerangka kerja pengelolaan dokumen transaksi keuangan dan arsip risalah rapat.',
        keyPoints: [
          'Metadata indexing dokumen perbankan',
          'Jadwal Retensi Arsip (JRA) Bank Indonesia',
          'SOP pemusnahan arsip rahasia'
        ]
      }
    ],
    quiz: [
      {
        id: 'q4',
        question: 'Tujuan utama penerapan standar ISO 15489 dalam pengelolaan kearsipan adalah:',
        options: [
          'Menjamin integritas, keandalan, dan kemudahan temu kembali dokumen penting untuk audit',
          'Mengurangi penggunaan komputer',
          'Menjual berkas lama ke pihak ketiga',
          'Membuat dokumen menjadi tidak terbaca'
        ],
        correctIndex: 0,
        explanation: 'ISO 15489 menjamin rekam jejak, keaslian, dan integritas dokumen secara global.'
      }
    ]
  }
];

// Initial Digital Certificates
export const INITIAL_CERTIFICATES: DigitalCertificate[] = [
  {
    id: 'CERT-001',
    certNumber: 'BI-BNSP-PUR-2026-0812',
    nip: '199110211-201102-1-001',
    recipientName: 'Ananda Saputra',
    unitKerja: 'Unit Distribusi Uang',
    programTitle: 'Sertifikasi Kompetensi Pengelolaan Uang Rupiah (BNSP)',
    certType: 'BNSP',
    issueDate: '2026-08-15',
    validUntil: '2029-08-15',
    uploadedByRole: 'Admin',
    uploadedByName: 'Administrator LENTERA',
    status: 'Terverifikasi'
  },
  {
    id: 'CERT-002',
    certNumber: 'BI-ISO15489-2026-0341',
    nip: '199120312-201203-1-002',
    recipientName: 'Satria Nugroho',
    unitKerja: 'Unit Logistik, SDM, Sekre, Protokol, dan Pengamanan',
    programTitle: 'Audit Manajemen Rekod Kearsipan ISO 15489',
    certType: 'ISO 15489',
    issueDate: '2026-09-10',
    validUntil: '2028-09-10',
    uploadedByRole: 'Admin',
    uploadedByName: 'Administrator LENTERA',
    status: 'Terverifikasi'
  },
  {
    id: 'CERT-003',
    certNumber: 'BI-LSB-PUR-2026-0119',
    nip: '199130413-201304-1-003',
    recipientName: 'Safira Ramadhani',
    unitKerja: 'Unit Layanan dan Pengolahan Uang',
    programTitle: 'Standarisasi Teller & Kasir Bank Sentral PUR / LSB',
    certType: 'PUR / LSB',
    issueDate: '2026-10-05',
    validUntil: '2029-10-05',
    uploadedByRole: 'Admin',
    uploadedByName: 'Administrator LENTERA',
    status: 'Terverifikasi'
  }
];

// Repository Storage Keys
const STORAGE_KEYS = {
  USERS: 'lentera_users_data',
  PMK: 'lentera_pmk_data',
  UPCOMING_SESSIONS: 'lentera_upcoming_pmk_sessions',
  TOPIC_REQUESTS: 'lentera_pmk_topic_requests',
  CASES: 'lentera_bank_kasus_data',
  COURSES: 'lentera_internal_courses',
  ENROLLMENTS: 'lentera_course_enrollments',
  CERTIFICATES: 'lentera_digital_certificates',
  SURVEYS: 'lentera_surveys_level3',
  SURVEY_SUBMISSIONS: 'lentera_survey_submissions',
  AUDIT: 'lentera_audit_logs',
  NOTIFS: 'lentera_notifications',
};

export class DataRepository {
  private static instance: DataRepository;
  private users: User[] = [];
  private pmkData: PMKRecord[] = [];
  private upcomingSessions: UpcomingPMKSession[] = [];
  private topicRequests: PMKTopicRequest[] = [];
  private cases: CaseStudy[] = [];
  private courses: InternalCourse[] = [];
  private enrollments: CourseEnrollment[] = [];
  private certificates: DigitalCertificate[] = [];
  private surveys: SurveyLevel3Form[] = [];
  private surveySubmissions: SurveySubmission[] = [];
  private auditLogs: AuditLog[] = [];
  private notifications: PushNotification[] = [];

  private constructor() {
    this.init();
  }

  public static getInstance(): DataRepository {
    if (!DataRepository.instance) {
      DataRepository.instance = new DataRepository();
    }
    return DataRepository.instance;
  }

  private init() {
    // 1. Users
    try {
      const savedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      if (savedUsers) {
        const parsed: User[] = JSON.parse(savedUsers);
        const existingPegawai = parsed.find(u => u.username.toLowerCase() === 'pegawai');
        if (!existingPegawai) {
          parsed.splice(1, 0, INITIAL_PEGAWAI_USER);
        } else {
          existingPegawai.allowedMenus = [...PEGAWAI_DEFAULT_MENUS];
          existingPegawai.status = 'Aktif';
        }
        this.users = parsed;
        this.saveUsers();
      } else {
        this.users = [...INITIAL_TEAM_USERS];
        this.saveUsers();
      }
    } catch {
      this.users = [...INITIAL_TEAM_USERS];
    }

    // 2. PMK Data
    try {
      const savedPmk = localStorage.getItem(STORAGE_KEYS.PMK);
      if (savedPmk) {
        let parsed: PMKRecord[] = JSON.parse(savedPmk);
        let modified = false;
        if (parsed.length === 305) {
          parsed = parsed.slice(0, 304);
          modified = true;
        }
        parsed.forEach((r, idx) => {
          if (r.namaPegawai.startsWith('Pegawai BI ')) {
            r.namaPegawai = getRealisticEmployeeName(idx + 1);
            modified = true;
          }
        });
        this.pmkData = parsed;
        if (modified) this.savePmk();
      } else {
        this.pmkData = generateInitialPMKData();
        this.savePmk();
      }
    } catch {
      this.pmkData = generateInitialPMKData();
    }

    // 3. Upcoming PMK Sessions (15 sessions)
    try {
      const savedSessions = localStorage.getItem(STORAGE_KEYS.UPCOMING_SESSIONS);
      if (savedSessions) {
        const parsed: UpcomingPMKSession[] = JSON.parse(savedSessions);
        let modified = false;
        parsed.forEach((s, sIdx) => {
          s.registeredParticipants.forEach((p, pIdx) => {
            if (p.namaPegawai.startsWith('Peserta Sesi')) {
              p.namaPegawai = getRealisticEmployeeName(((sIdx + 1) * 5 + (pIdx + 1)) % 250 + 1);
              modified = true;
            }
          });
        });
        this.upcomingSessions = parsed;
        if (modified) this.saveUpcomingSessions();
      } else {
        this.upcomingSessions = generateUpcomingPMKSessions();
        this.saveUpcomingSessions();
      }
    } catch {
      this.upcomingSessions = generateUpcomingPMKSessions();
    }

    // 4. Topic Requests
    try {
      const savedRequests = localStorage.getItem(STORAGE_KEYS.TOPIC_REQUESTS);
      if (savedRequests) {
        this.topicRequests = JSON.parse(savedRequests);
      } else {
        this.topicRequests = [
          {
            id: 'REQ-01',
            topicTitle: 'Pelatihan Investigasi Transaksi Kripto & AML di Perbankan Jatim',
            rationale: 'Kebutuhan identifikasi aliran dana mencurigakan pada aset digital di satker pengawasan.',
            targetCompetency: 'Sistem Pembayaran & Kepatuhan',
            proposedByNip: '19851120-201103-1-004',
            proposedByName: 'Budi Santoso',
            unitKerja: 'Unit Keuangan',
            submittedAt: '2026-11-05 10:30',
            status: 'Menunggu Review'
          },
          {
            id: 'REQ-02',
            topicTitle: 'Workshop Pemanfaatan AI untuk Analisis Sentimen Berita Kehumasan',
            rationale: 'Membantu pemantauan persepsi publik terhadap kebijakan moneter secara otomatis.',
            targetCompetency: 'Kehumasan & Data Analytics',
            proposedByNip: '19930718-201902-2-005',
            proposedByName: 'Eka Maharani',
            unitKerja: 'Unit Kehumasan',
            submittedAt: '2026-11-06 14:15',
            status: 'Disetujui'
          }
        ];
        this.saveTopicRequests();
      }
    } catch {
      this.topicRequests = [];
    }

    // 5. Cases
    try {
      const savedCases = localStorage.getItem(STORAGE_KEYS.CASES);
      if (savedCases) {
        this.cases = JSON.parse(savedCases);
      } else {
        this.cases = [...INITIAL_CASE_STUDIES];
        this.saveCases();
      }
    } catch {
      this.cases = [...INITIAL_CASE_STUDIES];
    }

    // 6. Courses
    try {
      const savedCourses = localStorage.getItem(STORAGE_KEYS.COURSES);
      if (savedCourses) {
        this.courses = JSON.parse(savedCourses);
      } else {
        this.courses = [...INITIAL_INTERNAL_COURSES];
        this.saveCourses();
      }
    } catch {
      this.courses = [...INITIAL_INTERNAL_COURSES];
    }

    // 7. Certificates
    try {
      const savedCerts = localStorage.getItem(STORAGE_KEYS.CERTIFICATES);
      if (savedCerts) {
        this.certificates = JSON.parse(savedCerts);
      } else {
        this.certificates = [...INITIAL_CERTIFICATES];
        this.saveCertificates();
      }
    } catch {
      this.certificates = [...INITIAL_CERTIFICATES];
    }

    // 8. Surveys Level 3
    try {
      const savedSurveys = localStorage.getItem(STORAGE_KEYS.SURVEYS);
      if (savedSurveys) {
        this.surveys = JSON.parse(savedSurveys);
      } else {
        this.surveys = [
          {
            id: 'SRV-001',
            title: 'Survei Dampak Implementasi Pelatihan CBP Rupiah di Unit Satker',
            description: 'Evaluasi perilaku kerja nyata setelah 3 bulan mengikuti pelatihan CBP Rupiah & Sertifikasi BNSP.',
            targetProgram: 'Sertifikasi BNSP Pengelolaan Uang Rupiah',
            targetUnit: 'Semua Satker',
            createdAt: '2026-10-10',
            isPublished: true,
            publishedBy: 'Administrator LENTERA',
            responsesCount: 42,
            averageScore: 4.68,
            questions: [
              {
                id: 'sq1',
                questionText: 'Seberapa sering Anda menerapkan teknik verifikasi keaslian uang sesuai standar yang dipelajari dalam pekerjaan sehari-hari?',
                type: 'scale'
              },
              {
                id: 'sq2',
                questionText: 'Apakah waktu penyelesaian transaksi kas Anda mengalami peningkatan kecepatan dan akurasi?',
                type: 'scale'
              },
              {
                id: 'sq3',
                questionText: 'Apakah atasan langsung Anda memberikan dukungan dan ruang dalam menerapkan metode kerja baru?',
                type: 'scale'
              },
              {
                id: 'sq4',
                questionText: 'Jelaskan kendala utama atau inovasi yang telah Anda terapkan di unit kerja Anda:',
                type: 'text'
              }
            ]
          }
        ];
        this.saveSurveys();
      }
    } catch {
      this.surveys = [];
    }

    // 9. Audit Logs
    try {
      const savedAudit = localStorage.getItem(STORAGE_KEYS.AUDIT);
      if (savedAudit) {
        this.auditLogs = JSON.parse(savedAudit);
      } else {
        this.auditLogs = [];
      }
    } catch {
      this.auditLogs = [];
    }

    // 10. Notifications
    try {
      const savedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFS);
      if (savedNotifs) {
        this.notifications = JSON.parse(savedNotifs);
      } else {
        this.notifications = [];
      }
    } catch {
      this.notifications = [];
    }
  }

  // Save helpers
  public saveUsers() {
    try { localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(this.users)); } catch {}
  }
  public savePmk() {
    try { localStorage.setItem(STORAGE_KEYS.PMK, JSON.stringify(this.pmkData)); } catch {}
  }
  public saveUpcomingSessions() {
    try { localStorage.setItem(STORAGE_KEYS.UPCOMING_SESSIONS, JSON.stringify(this.upcomingSessions)); } catch {}
  }
  public saveTopicRequests() {
    try { localStorage.setItem(STORAGE_KEYS.TOPIC_REQUESTS, JSON.stringify(this.topicRequests)); } catch {}
  }
  public saveCases() {
    try { localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(this.cases)); } catch {}
  }
  public saveCourses() {
    try { localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(this.courses)); } catch {}
  }
  public saveCertificates() {
    try { localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(this.certificates)); } catch {}
  }
  public saveSurveys() {
    try { localStorage.setItem(STORAGE_KEYS.SURVEYS, JSON.stringify(this.surveys)); } catch {}
  }
  public saveAudit() {
    try { localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(this.auditLogs)); } catch {}
  }
  public saveNotifs() {
    try { localStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(this.notifications)); } catch {}
  }

  // User Management
  public getUsers(): User[] {
    return this.users;
  }

  public addUser(user: User, actorName = 'Admin'): User {
    if (!user.allowedMenus || user.allowedMenus.length === 0) {
      user.allowedMenus = user.role === 'Super Admin' || user.role === 'Admin'
        ? [...ALL_MENU_IDS]
        : ['dashboard', 'realisasi-pmk', 'sertifikasi', 'bank-kasus', 'pembelajaran-internal', 'survei-level-3', 'data-pmk', 'performa-pegawai', 'tentang-lentera'];
    }
    this.users.unshift(user);
    this.saveUsers();
    this.logActivity({
      userId: user.id,
      userName: actorName,
      action: 'USER_CREATE',
      module: 'Manajemen Pengguna',
      details: `Menambahkan user ${user.fullName} (${user.username}, Role: ${user.role}, Unit: ${user.unitKerja})`,
      status: 'Success'
    });
    return user;
  }

  public updateUser(updatedUser: User, actorName = 'Admin'): User {
    const idx = this.users.findIndex(u => u.id === updatedUser.id);
    if (idx !== -1) {
      this.users[idx] = updatedUser;
      this.saveUsers();
      this.logActivity({
        userId: updatedUser.id,
        userName: actorName,
        action: 'USER_UPDATE',
        module: 'Manajemen Pengguna',
        details: `Memperbarui data user ${updatedUser.fullName} (Status: ${updatedUser.status}, Role: ${updatedUser.role})`,
        status: 'Success'
      });
    }
    return updatedUser;
  }

  public deleteUser(userId: string, actorName = 'Admin'): boolean {
    const target = this.users.find(u => u.id === userId);
    if (!target) return false;
    this.users = this.users.filter(u => u.id !== userId);
    this.saveUsers();
    this.logActivity({
      userId,
      userName: actorName,
      action: 'USER_DELETE',
      module: 'Manajemen Pengguna',
      details: `Menghapus user ${target.fullName} (${target.username})`,
      status: 'Warning'
    });
    return true;
  }

  // PMK Master Records
  public getPMKData(): PMKRecord[] {
    return this.pmkData;
  }

  public importPMKRecords(newRecords: PMKRecord[], actorName = 'Admin'): void {
    this.pmkData = [...newRecords, ...this.pmkData];
    this.savePmk();
    appCache.invalidate('pmk');
    this.logActivity({
      userId: 'admin',
      userName: actorName,
      action: 'DATA_UPLOAD',
      module: 'Data PMK',
      details: `Mengimpor ${newRecords.length} rekod PMK dari berkas Excel`,
      status: 'Success'
    });
  }

  public deletePMKRecord(id: string, actorName = 'Admin'): boolean {
    const prevLen = this.pmkData.length;
    this.pmkData = this.pmkData.filter(r => r.id !== id);
    if (this.pmkData.length < prevLen) {
      this.savePmk();
      this.logActivity({
        userId: 'admin',
        userName: actorName,
        action: 'USER_DELETE',
        module: 'Data PMK',
        details: `Menghapus rekod PMK ID: ${id}`,
        status: 'Success'
      });
      return true;
    }
    return false;
  }

  public updatePMKRecord(updated: PMKRecord, actorName = 'Admin'): void {
    const idx = this.pmkData.findIndex(r => r.id === updated.id);
    if (idx !== -1) {
      this.pmkData[idx] = updated;
      this.savePmk();
      this.logActivity({
        userId: 'admin',
        userName: actorName,
        action: 'USER_UPDATE',
        module: 'Data PMK',
        details: `Memperbarui rekod PMK untuk ${updated.namaPegawai} (${updated.judulProgram})`,
        status: 'Success'
      });
    }
  }

  // Upcoming PMK Sessions & Registration
  public getUpcomingSessions(): UpcomingPMKSession[] {
    return this.upcomingSessions;
  }

  public registerToPMKSession(sessionId: string, user: { nip: string; fullName: string; unitKerja: string; email: string }): { success: boolean; message: string } {
    const session = this.upcomingSessions.find(s => s.id === sessionId);
    if (!session) return { success: false, message: 'Sesi PMK tidak ditemukan.' };

    const alreadyRegistered = session.registeredParticipants.some(p => p.nip === user.nip);
    if (alreadyRegistered) {
      return { success: false, message: 'Anda sudah terdaftar dalam sesi pelatihan ini.' };
    }

    if (session.registeredParticipants.length >= session.maxParticipants) {
      return { success: false, message: 'Kuota sesi PMK ini sudah penuh.' };
    }

    session.registeredParticipants.push({
      id: `reg-${Date.now()}`,
      nip: user.nip,
      namaPegawai: user.fullName,
      unitKerja: user.unitKerja,
      registeredAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      email: user.email,
    });

    if (session.registeredParticipants.length >= session.maxParticipants) {
      session.status = 'Full';
    }

    this.saveUpcomingSessions();
    this.logActivity({
      userId: user.nip,
      userName: user.fullName,
      action: 'PMK_REGISTER',
      module: 'Data PMK',
      details: `Registrasi berhasil untuk sesi ${session.topicTitle} (Batch: ${session.batchNumber})`,
      status: 'Success'
    });

    return { success: true, message: `Pendaftaran berhasil untuk sesi ${session.topicTitle}` };
  }

  public cancelPMKRegistration(sessionId: string, nip: string, actorName?: string): { success: boolean; message: string } {
    const session = this.upcomingSessions.find(s => s.id === sessionId);
    if (!session) return { success: false, message: 'Sesi PMK tidak ditemukan.' };

    const target = session.registeredParticipants.find(p => p.nip === nip);
    if (!target) {
      return { success: false, message: 'Data pendaftaran peserta tidak ditemukan.' };
    }

    session.registeredParticipants = session.registeredParticipants.filter(p => p.nip !== nip);
    if (session.registeredParticipants.length < session.maxParticipants) {
      session.status = 'Open';
    }

    this.saveUpcomingSessions();
    this.logActivity({
      userId: nip,
      userName: actorName || target.namaPegawai,
      action: 'USER_UPDATE',
      module: 'Data PMK',
      details: `Membatalkan pendaftaran sesi PMK: ${session.topicTitle} untuk ${target.namaPegawai} (${target.unitKerja})`,
      status: 'Warning'
    });

    return { success: true, message: `Pendaftaran ${target.namaPegawai} pada sesi "${session.topicTitle}" berhasil dibatalkan.` };
  }

  public updateSessionLimit(sessionId: string, newMaxParticipants: number, actorName = 'Admin'): boolean {
    const session = this.upcomingSessions.find(s => s.id === sessionId);
    if (!session) return false;

    session.maxParticipants = newMaxParticipants;
    if (session.registeredParticipants.length >= session.maxParticipants) {
      session.status = 'Full';
    } else {
      session.status = 'Open';
    }

    this.saveUpcomingSessions();
    this.logActivity({
      userId: 'admin',
      userName: actorName,
      action: 'PMK_LIMIT_UPDATE',
      module: 'Data PMK',
      details: `Mengubah limit kuota sesi ${session.topicTitle} menjadi ${newMaxParticipants} peserta`,
      status: 'Success'
    });

    return true;
  }

  public deleteUpcomingSession(sessionId: string, actorName = 'Admin'): boolean {
    const target = this.upcomingSessions.find(s => s.id === sessionId);
    if (!target) return false;

    this.upcomingSessions = this.upcomingSessions.filter(s => s.id !== sessionId);
    this.saveUpcomingSessions();
    this.logActivity({
      userId: 'admin',
      userName: actorName,
      action: 'USER_DELETE',
      module: 'Data PMK',
      details: `Menghapus sesi PMK mendatang: ${target.topicTitle}`,
      status: 'Warning'
    });
    return true;
  }

  public updateUpcomingSession(updated: UpcomingPMKSession, actorName = 'Admin'): boolean {
    const idx = this.upcomingSessions.findIndex(s => s.id === updated.id);
    if (idx !== -1) {
      this.upcomingSessions[idx] = updated;
      this.saveUpcomingSessions();
      this.logActivity({
        userId: 'admin',
        userName: actorName,
        action: 'USER_UPDATE',
        module: 'Data PMK',
        details: `Memperbarui jadwal sesi PMK: ${updated.topicTitle} (Batch: ${updated.batchNumber})`,
        status: 'Success'
      });
      return true;
    }
    return false;
  }

  // Topic Requests
  public getTopicRequests(): PMKTopicRequest[] {
    return this.topicRequests;
  }

  public addTopicRequest(request: Omit<PMKTopicRequest, 'id' | 'submittedAt' | 'status'>): PMKTopicRequest {
    const newReq: PMKTopicRequest = {
      id: `REQ-${Date.now().toString(36).toUpperCase()}`,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Menunggu Review',
      ...request,
    };
    this.topicRequests.unshift(newReq);
    this.saveTopicRequests();
    this.logActivity({
      userId: request.proposedByNip,
      userName: request.proposedByName,
      action: 'TOPIC_REQUEST',
      module: 'Data PMK',
      details: `Mengajukan usulan topik PMK: "${request.topicTitle}" (${request.unitKerja})`,
      status: 'Success'
    });
    return newReq;
  }

  public updateTopicRequestStatus(id: string, status: 'Menunggu Review' | 'Disetujui' | 'Dijadwalkan', notes?: string): void {
    const target = this.topicRequests.find(r => r.id === id);
    if (target) {
      target.status = status;
      if (notes) target.adminNotes = notes;
      this.saveTopicRequests();
    }
  }

  // Bank Kasus Social System
  public getCases(): CaseStudy[] {
    return this.cases;
  }

  public addCase(caseItem: Omit<CaseStudy, 'id' | 'date' | 'downloads' | 'likes' | 'comments'>): CaseStudy {
    const newCase: CaseStudy = {
      id: `CS-${String(this.cases.length + 1).padStart(2, '0')}`,
      date: new Date().toISOString().substring(0, 10),
      downloads: 0,
      likes: 0,
      comments: [],
      ...caseItem,
    };
    this.cases.unshift(newCase);
    this.saveCases();
    return newCase;
  }

  public toggleLikeCase(caseId: string): void {
    const item = this.cases.find(c => c.id === caseId);
    if (item) {
      if (item.hasLiked) {
        item.likes = Math.max(0, item.likes - 1);
        item.hasLiked = false;
      } else {
        item.likes += 1;
        item.hasLiked = true;
      }
      this.saveCases();
    }
  }

  public addCommentToCase(caseId: string, comment: { authorName: string; authorUnit: string; authorRole: string; comment: string; emojiReaction?: string }): void {
    const item = this.cases.find(c => c.id === caseId);
    if (item) {
      item.comments.push({
        id: `com-${Date.now()}`,
        timestamp: 'Baru saja',
        ...comment,
      });
      this.saveCases();
    }
  }

  public deleteCase(caseId: string): boolean {
    const prev = this.cases.length;
    this.cases = this.cases.filter(c => c.id !== caseId);
    if (this.cases.length < prev) {
      this.saveCases();
      return true;
    }
    return false;
  }

  public editCase(updated: CaseStudy): void {
    const idx = this.cases.findIndex(c => c.id === updated.id);
    if (idx !== -1) {
      this.cases[idx] = updated;
      this.saveCases();
    }
  }

  // Survey Level 3 (Google Form Style)
  public getSurveys(): SurveyLevel3Form[] {
    return this.surveys;
  }

  public addSurvey(form: Omit<SurveyLevel3Form, 'id' | 'createdAt' | 'responsesCount'>): SurveyLevel3Form {
    const newSurvey: SurveyLevel3Form = {
      id: `SRV-${Date.now()}`,
      createdAt: new Date().toISOString().substring(0, 10),
      responsesCount: 0,
      ...form,
    };
    this.surveys.unshift(newSurvey);
    this.saveSurveys();
    this.logActivity({
      userId: 'admin',
      userName: form.publishedBy,
      action: 'SURVEY_CREATED',
      module: 'Survei Level 3',
      details: `Menerbitkan instrumen survei evaluasi: "${form.title}"`,
      status: 'Success'
    });
    return newSurvey;
  }

  public submitSurveyResponse(submission: Omit<SurveySubmission, 'id' | 'submittedAt'>): void {
    const newSub: SurveySubmission = {
      id: `sub-${Date.now()}`,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ...submission,
    };
    this.surveySubmissions.push(newSub);

    const survey = this.surveys.find(s => s.id === submission.surveyId);
    if (survey) {
      survey.responsesCount += 1;
      const prevTotal = (survey.averageScore || 4.5) * (survey.responsesCount - 1);
      survey.averageScore = Math.round(((prevTotal + submission.averageScore) / survey.responsesCount) * 100) / 100;
      this.saveSurveys();
    }

    this.logActivity({
      userId: submission.participantNip,
      userName: submission.participantName,
      action: 'SURVEY_SUBMITTED',
      module: 'Survei Level 3',
      details: `Mengirim evaluasi survei Kirkpatrick Level 3`,
      status: 'Success'
    });
  }

  public deleteSurvey(surveyId: string): boolean {
    const prev = this.surveys.length;
    this.surveys = this.surveys.filter(s => s.id !== surveyId);
    if (this.surveys.length < prev) {
      this.saveSurveys();
      return true;
    }
    return false;
  }

  public updateSurvey(updated: SurveyLevel3Form, actorName = 'Admin'): boolean {
    const idx = this.surveys.findIndex(s => s.id === updated.id);
    if (idx !== -1) {
      this.surveys[idx] = updated;
      this.saveSurveys();
      this.logActivity({
        userId: 'admin',
        userName: actorName,
        action: 'USER_UPDATE',
        module: 'Survei Level 3',
        details: `Memperbarui formulir survei evaluasi: "${updated.title}"`,
        status: 'Success'
      });
      return true;
    }
    return false;
  }

  // Internal Courses
  public getCourses(): InternalCourse[] {
    return this.courses;
  }

  public addCourse(course: Omit<InternalCourse, 'id' | 'enrolledStudentsCount' | 'publishedAt'>): InternalCourse {
    const newCourse: InternalCourse = {
      id: `CRS-${Date.now().toString(36).toUpperCase()}`,
      enrolledStudentsCount: 0,
      publishedAt: new Date().toISOString().substring(0, 10),
      ...course,
    };
    this.courses.unshift(newCourse);
    this.saveCourses();
    this.logActivity({
      userId: 'admin',
      userName: course.publishedBy,
      action: 'COURSE_CREATED',
      module: 'Pembelajaran Internal',
      details: `Mempublikasikan modul pembelajaran baru: "${course.title}"`,
      status: 'Success'
    });
    return newCourse;
  }

  public enrollInCourse(enrollment: Omit<CourseEnrollment, 'id' | 'enrolledAt' | 'progressPercent' | 'isCompleted'>): CourseEnrollment {
    const newEnroll: CourseEnrollment = {
      id: `enr-${Date.now()}`,
      enrolledAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      progressPercent: 0,
      isCompleted: false,
      ...enrollment,
    };
    this.enrollments.push(newEnroll);

    const course = this.courses.find(c => c.id === enrollment.courseId);
    if (course) {
      course.enrolledStudentsCount += 1;
      this.saveCourses();
    }

    return newEnroll;
  }

  public completeCourseLesson(enrollmentId: string, quizScore: number): void {
    const enr = this.enrollments.find(e => e.id === enrollmentId);
    if (enr) {
      enr.progressPercent = 100;
      enr.isCompleted = true;
      enr.quizScore = quizScore;
      enr.completedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);

      // Add learning points and hours to participant
      const course = this.courses.find(c => c.id === enr.courseId);
      if (course) {
        const participant = this.pmkData.find(p => p.nip === enr.nip);
        if (participant) {
          participant.jamSelfLearning += course.totalDurationHours;
          participant.learningPoint += course.learningPoints;
          this.savePmk();
        }
      }
    }
  }

  public deleteCourse(courseId: string): boolean {
    const prev = this.courses.length;
    this.courses = this.courses.filter(c => c.id !== courseId);
    if (this.courses.length < prev) {
      this.saveCourses();
      return true;
    }
    return false;
  }

  public updateCourse(updated: InternalCourse, actorName = 'Admin'): boolean {
    const idx = this.courses.findIndex(c => c.id === updated.id);
    if (idx !== -1) {
      this.courses[idx] = updated;
      this.saveCourses();
      this.logActivity({
        userId: 'admin',
        userName: actorName,
        action: 'USER_UPDATE',
        module: 'Pembelajaran Internal',
        details: `Memperbarui modul pembelajaran: "${updated.title}"`,
        status: 'Success'
      });
      return true;
    }
    return false;
  }

  // Digital Certificates (BNSP, ISO 15489, PUR / LSB)
  public getCertificates(): DigitalCertificate[] {
    return this.certificates;
  }

  public addCertificate(cert: Omit<DigitalCertificate, 'id'>): DigitalCertificate {
    const newCert: DigitalCertificate = {
      id: `CERT-${Date.now()}`,
      ...cert,
    };
    this.certificates.unshift(newCert);
    this.saveCertificates();
    this.logActivity({
      userId: cert.nip,
      userName: cert.uploadedByName,
      action: 'CERTIFICATE_UPLOAD',
      module: 'Sertifikasi',
      details: `Unggah sertifikat digital: ${cert.programTitle} (${cert.certType}) untuk ${cert.recipientName}`,
      status: 'Success'
    });
    return newCert;
  }

  public updateCertificate(updated: DigitalCertificate, actorName = 'Admin'): boolean {
    const idx = this.certificates.findIndex(c => c.id === updated.id);
    if (idx !== -1) {
      this.certificates[idx] = updated;
      this.saveCertificates();
      this.logActivity({
        userId: updated.nip,
        userName: actorName,
        action: 'USER_UPDATE',
        module: 'Sertifikasi',
        details: `Memperbarui sertifikat digital: ${updated.programTitle} (${updated.certType}) untuk ${updated.recipientName}`,
        status: 'Success'
      });
      return true;
    }
    return false;
  }

  public deleteCertificate(id: string, actorName = 'Admin'): boolean {
    const target = this.certificates.find(c => c.id === id);
    const prev = this.certificates.length;
    this.certificates = this.certificates.filter(c => c.id !== id);
    if (this.certificates.length < prev) {
      this.saveCertificates();
      if (target) {
        this.logActivity({
          userId: target.nip,
          userName: actorName,
          action: 'USER_DELETE',
          module: 'Sertifikasi',
          details: `Menghapus sertifikat digital: ${target.programTitle} (${target.recipientName})`,
          status: 'Warning'
        });
      }
      return true;
    }
    return false;
  }

  // Summary Metrics Overrides (Synced between Dashboard & Sertifikasi)
  public getSummaryMetricsOverrides(): {
    totalPeserta: number;
    program: number;
    denganSertifikasi: number;
    tanpaSertifikasi: number;
    bnsp: number;
    iso15489: number;
    purLsb: number;
  } | null {
    try {
      const saved = localStorage.getItem('lentera_cert_summary_overrides');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  }

  public saveSummaryMetricsOverrides(
    overrides: {
      totalPeserta: number;
      program: number;
      denganSertifikasi: number;
      tanpaSertifikasi: number;
      bnsp: number;
      iso15489: number;
      purLsb: number;
    },
    actorName = 'Admin'
  ): void {
    try {
      localStorage.setItem('lentera_cert_summary_overrides', JSON.stringify(overrides));
      this.logActivity({
        userId: 'admin',
        userName: actorName,
        action: 'USER_UPDATE',
        module: 'Sertifikasi',
        details: `Memperbarui ringkasan statistik sertifikasi (Total Peserta: ${overrides.totalPeserta}, Dengan Sertifikasi: ${overrides.denganSertifikasi}, Tanpa Sertifikasi: ${overrides.tanpaSertifikasi})`,
        status: 'Success'
      });
    } catch {}
  }

  public resetSummaryMetricsOverrides(actorName = 'Admin'): void {
    try {
      localStorage.removeItem('lentera_cert_summary_overrides');
      this.logActivity({
        userId: 'admin',
        userName: actorName,
        action: 'USER_UPDATE',
        module: 'Sertifikasi',
        details: 'Mereset ringkasan statistik sertifikasi ke perhitungan otomatis data peserta',
        status: 'Success'
      });
    } catch {}
  }

  // Employee Performance Matrix Generator & Editor
  public getEmployeePerformanceList(): EmployeePerformance[] {
    let customOverrides: Record<string, Partial<EmployeePerformance>> = {};
    try {
      const saved = localStorage.getItem('lentera_employee_performance_overrides');
      if (saved) customOverrides = JSON.parse(saved);
    } catch {}

    const uniqueEmployeesMap = new Map<string, EmployeePerformance>();

    this.pmkData.forEach((rec, idx) => {
      if (!uniqueEmployeesMap.has(rec.nip)) {
        const override = customOverrides[rec.nip];
        const totalPmk = override?.totalPmkAttended ?? (1 + (idx % 4));
        const behaviorScore = override?.behaviorScoreLevel3 ?? (rec.nilaiSurveiLevel3 || 4.6);
        const internalCompleted = override?.internalCoursesCompleted ?? (1 + (idx % 3));
        const hours = override?.totalSelfLearningHours ?? rec.jamSelfLearning;
        const points = override?.totalLearningPoints ?? rec.learningPoint;
        const overallScore = override?.overallPerformanceScore ?? Math.min(99, Math.round((behaviorScore / 5.0) * 60 + Math.min(40, (hours / 50) * 40)));

        let status: 'Top Performer' | 'High Potential' | 'On Track' | 'Perlu Pendampingan' = 'On Track';
        if (override?.performanceStatus) {
          status = override.performanceStatus;
        } else if (overallScore >= 90) {
          status = 'Top Performer';
        } else if (overallScore >= 80) {
          status = 'High Potential';
        } else if (overallScore >= 70) {
          status = 'On Track';
        } else {
          status = 'Perlu Pendampingan';
        }

        uniqueEmployeesMap.set(rec.nip, {
          nip: rec.nip,
          fullName: override?.fullName ?? rec.namaPegawai,
          unitKerja: override?.unitKerja ?? rec.unitKerja,
          totalPmkAttended: totalPmk,
          pmkHistory: override?.pmkHistory ?? [
            {
              programTitle: rec.judulProgram,
              year: rec.tahun,
              certType: rec.sertifikasi,
              score: Math.round(behaviorScore * 20),
            },
            {
              programTitle: 'Workshop Analisis & Kompetensi Regional',
              year: '2025',
              certType: 'BNSP',
              score: 88,
            }
          ],
          totalSelfLearningHours: hours,
          totalLearningPoints: points,
          behaviorScoreLevel3: behaviorScore,
          performanceStatus: status,
          internalCoursesCompleted: internalCompleted,
          overallPerformanceScore: overallScore,
        });
      }
    });

    return Array.from(uniqueEmployeesMap.values());
  }

  public updateEmployeePerformance(
    originalNip: string,
    updated: {
      nip: string;
      fullName: string;
      unitKerja: string;
      totalPmkAttended: number;
      totalSelfLearningHours: number;
      totalLearningPoints: number;
      behaviorScoreLevel3: number;
      performanceStatus: 'Top Performer' | 'High Potential' | 'On Track' | 'Perlu Pendampingan';
    },
    actorName = 'Admin'
  ): void {
    let oldUnit = '';
    this.pmkData.forEach(rec => {
      if (rec.nip === originalNip) {
        oldUnit = rec.unitKerja;
        rec.nip = updated.nip;
        rec.namaPegawai = updated.fullName;
        rec.unitKerja = updated.unitKerja;
        rec.jamSelfLearning = updated.totalSelfLearningHours;
        rec.learningPoint = updated.totalLearningPoints;
        rec.nilaiSurveiLevel3 = updated.behaviorScoreLevel3;
      }
    });
    this.savePmk();
    appCache.invalidate('pmk');

    try {
      const saved = localStorage.getItem('lentera_employee_performance_overrides');
      const customOverrides: Record<string, Partial<EmployeePerformance>> = saved ? JSON.parse(saved) : {};
      if (originalNip !== updated.nip) {
        delete customOverrides[originalNip];
      }
      const overallScore = Math.min(99, Math.round((updated.behaviorScoreLevel3 / 5.0) * 60 + Math.min(40, (updated.totalSelfLearningHours / 50) * 40)));
      customOverrides[updated.nip] = {
        nip: updated.nip,
        fullName: updated.fullName,
        unitKerja: updated.unitKerja,
        totalPmkAttended: updated.totalPmkAttended,
        totalSelfLearningHours: updated.totalSelfLearningHours,
        totalLearningPoints: updated.totalLearningPoints,
        behaviorScoreLevel3: updated.behaviorScoreLevel3,
        performanceStatus: updated.performanceStatus,
        overallPerformanceScore: overallScore,
      };
      localStorage.setItem('lentera_employee_performance_overrides', JSON.stringify(customOverrides));
    } catch {}

    const rotationNote = oldUnit && oldUnit !== updated.unitKerja
      ? ` (Rotasi Unit Kerja: ${oldUnit} -> ${updated.unitKerja})`
      : ` (Unit Kerja: ${updated.unitKerja})`;

    this.logActivity({
      userId: updated.nip,
      userName: actorName,
      action: 'USER_UPDATE',
      module: 'Performa Pegawai',
      details: `Memperbarui data pegawai ${updated.fullName}${rotationNote}`,
      status: 'Success'
    });
  }

  // Audit Logs
  public getAuditLogs(): AuditLog[] {
    return this.auditLogs;
  }

  public logActivity(entry: Omit<AuditLog, 'id' | 'timestamp' | 'ipAddress'>): AuditLog {
    const log: AuditLog = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '10.20.4.15',
      ...entry,
    };
    this.auditLogs.unshift(log);
    if (this.auditLogs.length > 500) this.auditLogs.pop();
    this.saveAudit();
    return log;
  }

  // Notifications
  public getNotifications(): PushNotification[] {
    return this.notifications;
  }

  public markNotificationAsRead(id: string): void {
    const n = this.notifications.find(x => x.id === id);
    if (n) {
      n.read = true;
      this.saveNotifs();
    }
  }

  public markAllNotificationsAsRead(): void {
    this.notifications.forEach(n => { n.read = true; });
    this.saveNotifs();
  }

  public addNotification(notification: Omit<PushNotification, 'id' | 'timestamp' | 'read'>): PushNotification {
    const notif: PushNotification = {
      id: `notif-${Date.now()}`,
      timestamp: 'Baru saja',
      read: false,
      ...notification,
    };
    this.notifications.unshift(notif);
    this.saveNotifs();
    return notif;
  }
}

export const dataRepo = DataRepository.getInstance();
