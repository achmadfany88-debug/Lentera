export type UserRole = 'Super Admin' | 'Admin' | 'Reviewer' | 'Pegawai';
export type UserStatus = 'Aktif' | 'Nonaktif';

export type NavTabId = 
  | 'dashboard'
  | 'realisasi-pmk'
  | 'sertifikasi'
  | 'analisis-kompetensi'
  | 'bank-kasus'
  | 'pembelajaran-internal'
  | 'survei-level-3'
  | 'data-pmk'
  | 'performa-pegawai'
  | 'manajemen-user'
  | 'log-aktivitas'
  | 'tentang-lentera';

export interface User {
  id: string;
  username: string;
  fullName: string;
  nip: string;
  email: string;
  role: UserRole;
  unitKerja: string;
  status: UserStatus;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
  passwordHash: string;
  salt: string;
  allowedMenus?: NavTabId[]; // Role-based access control per user
}

export type AuditAction = 
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'LOGOUT'
  | 'USER_CREATE'
  | 'USER_UPDATE'
  | 'USER_DELETE'
  | 'USER_STATUS_CHANGE'
  | 'DATA_UPLOAD'
  | 'DATA_EXPORT_PDF'
  | 'DATA_EXPORT_EXCEL'
  | 'FILTER_APPLIED'
  | 'CACHE_REFRESH'
  | 'SYNC_DISPATCHED'
  | 'PMK_REGISTER'
  | 'PMK_LIMIT_UPDATE'
  | 'TOPIC_REQUEST'
  | 'CERTIFICATE_UPLOAD'
  | 'SURVEY_CREATED'
  | 'SURVEY_SUBMITTED'
  | 'COURSE_CREATED'
  | 'COURSE_COMPLETED';

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: AuditAction;
  module: string;
  details: string;
  ipAddress: string;
  status: 'Success' | 'Warning' | 'Error';
}

export interface FilterState {
  tahun: string;
  periode: string;
  unitKerja: string;
  kategori: string;
  jenisProgram: string;
  sertifikasi: string;
  statusPmk: string;
}

export type CertType = 'BNSP' | 'ISO 15489' | 'PUR / LSB' | 'Tanpa Sertifikasi' | 'Lainnya';

export interface PMKRecord {
  id: string;
  nip: string;
  namaPegawai: string;
  unitKerja: string;
  judulProgram: string;
  kategori: string;
  jenisProgram: string;
  jamSelfLearning: number;
  learningPoint: number;
  sertifikasi: CertType;
  statusPmk: 'Selesai' | 'On-Going' | 'Terjadwal';
  tahun: string;
  periode: string;
  tanggalSelesai: string;
  nilaiSurveiLevel3: number;
}

export interface LeaderboardItem {
  ranking: number;
  namaPegawai: string;
  rawNama: string;
  unitKerja: string;
  value: number;
  unitCode?: string;
}

// Case Study & Social Feedback
export interface CaseComment {
  id: string;
  authorName: string;
  authorUnit: string;
  authorRole: string;
  timestamp: string;
  comment: string;
  emojiReaction?: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  authorUnit: string;
  targetAudience: string;
  date: string;
  summary: string;
  category: string;
  downloads: number;
  dualLoopImpact: string;
  tags: string[];
  feedbackType?: 'Feedback' | 'Pertanyaan' | 'Studi Kasus';
  issueTopic?: string;
  likes: number;
  hasLiked?: boolean;
  comments: CaseComment[];
}

// Upcoming PMK Session (15 Upcoming Sessions)
export interface RegisteredParticipant {
  id: string;
  nip: string;
  namaPegawai: string;
  unitKerja: string;
  registeredAt: string;
  email: string;
}

export interface UpcomingPMKSession {
  id: string;
  batchNumber: number;
  topicTitle: string;
  executionDate: string; // YYYY-MM-DD
  executionTime: string; // e.g. 08:30 - 15:30 WIB
  location: string;
  certType: 'BNSP' | 'ISO 15489' | 'PUR / LSB' | 'Tanpa Sertifikasi';
  trainerName: string;
  maxParticipants: number;
  registeredParticipants: RegisteredParticipant[];
  registrationDeadline: string; // ISO Date String for countdown
  status: 'Open' | 'Full' | 'Closed';
  description: string;
}

// PMK Topic Request by Employee
export interface PMKTopicRequest {
  id: string;
  topicTitle: string;
  rationale: string;
  targetCompetency: string;
  proposedByNip: string;
  proposedByName: string;
  unitKerja: string;
  submittedAt: string;
  status: 'Menunggu Review' | 'Disetujui' | 'Dijadwalkan';
  adminNotes?: string;
}

// Survey Level 3 (Kirkpatrick Form)
export interface SurveyQuestion {
  id: string;
  questionText: string;
  type: 'scale' | 'text'; // scale 1-5 or descriptive
}

export interface SurveyLevel3Form {
  id: string;
  title: string;
  description: string;
  targetProgram: string;
  targetUnit: string;
  createdAt: string;
  isPublished: boolean;
  publishedBy: string;
  questions: SurveyQuestion[];
  responsesCount: number;
  averageScore?: number;
}

export interface SurveySubmission {
  id: string;
  surveyId: string;
  participantNip: string;
  participantName: string;
  unitKerja: string;
  submittedAt: string;
  answers: Record<string, string | number>;
  averageScore: number;
}

// Internal Learning Course
export interface CourseLesson {
  id: string;
  title: string;
  durationMinutes: number;
  videoUrl?: string;
  contentMarkdown: string;
  keyPoints: string[];
}

export interface CourseQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface InternalCourse {
  id: string;
  title: string;
  description: string;
  category: string;
  instructor: string;
  level: 'Fundamental' | 'Intermediate' | 'Advanced' | 'Sertifikasi';
  certType?: CertType;
  totalDurationHours: number;
  learningPoints: number;
  rating: number;
  enrolledStudentsCount: number;
  lessons: CourseLesson[];
  quiz: CourseQuizQuestion[];
  publishedBy: string;
  publishedAt: string;
  isPublished: boolean;
}

export interface CourseEnrollment {
  id: string;
  courseId: string;
  nip: string;
  fullName: string;
  unitKerja: string;
  email: string;
  enrolledAt: string;
  progressPercent: number;
  quizScore?: number;
  isCompleted: boolean;
  completedAt?: string;
}

// Employee Digital Certificate
export interface DigitalCertificate {
  id: string;
  certNumber: string;
  nip: string;
  recipientName: string;
  unitKerja: string;
  programTitle: string;
  certType: 'BNSP' | 'ISO 15489' | 'PUR / LSB';
  issueDate: string;
  validUntil: string;
  fileUrl?: string;
  uploadedByRole: 'Admin' | 'Pegawai';
  uploadedByName: string;
  status: 'Terverifikasi' | 'Menunggu Verifikasi';
}

// Employee Performance Matrix
export interface EmployeePerformance {
  nip: string;
  fullName: string;
  unitKerja: string;
  totalPmkAttended: number;
  pmkHistory: Array<{
    programTitle: string;
    year: string;
    certType: CertType;
    score: number;
  }>;
  totalSelfLearningHours: number;
  totalLearningPoints: number;
  behaviorScoreLevel3: number; // 1-5 scale
  performanceStatus: 'Top Performer' | 'High Potential' | 'On Track' | 'Perlu Pendampingan';
  internalCoursesCompleted: number;
  overallPerformanceScore: number; // 0 - 100
}

export interface PushNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'urgent';
  linkTab?: string;
}
