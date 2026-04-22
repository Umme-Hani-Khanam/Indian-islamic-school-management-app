export interface Class {
  id: string;
  name: string;
  section: string;
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  classId: string;
  parentId: string;
}

export interface Teacher {
  id: string;
  userId: string;
  employeeId: string;
  department: string;
  performanceRanking?: number;
  guidanceEfficiency?: number;
  monthlyScore?: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
}

export interface TeacherAssignment {
  id: string;
  teacherId: string; // references Teacher.id
  classId: string;
  subjectId: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  date: string; // ISO string
  status: 'PRESENT' | 'ABSENT' | 'LATE';
}

export interface Marks {
  id: string;
  studentId: string;
  subjectId: string;
  teacherId: string;
  date: string; // ISO string 
  score: number;
  total: number;
  examType: string;
}

export interface Remarks {
  id: string;
  studentId: string;
  teacherId: string;
  date: string;
  comment: string;
  type: 'POSITIVE' | 'NEGATIVE';
}

export interface DisciplineIssue {
  id: string;
  studentId: string;
  date: string;
  description: string;
  severity: 'MINOR' | 'MAJOR' | 'RED_ALERT';
  raisedBy: 'CHILD' | 'OTHER';
  proofImageUrl?: string;
}

export interface HomeworkTask {
  id: string;
  studentId: string;
  subjectId: string;
  title: string;
  isCompleted: boolean;
}

export interface DailyPerformance {
  date: string;
  score: number; // e.g. out of 100
}

export interface MonthlyProgress {
  month: string;
  score: number;
}

export interface AssignedTeacher {
  teacher: Teacher;
  subject: Subject;
}

export interface AlertHistory {
  date: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  note: string;
  updatedBy: string; // userId
}

export interface Alert {
  id: string;
  studentId: string;
  title: string;
  description: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  raisedByRole: 'HEADMASTER' | 'TEACHER' | 'PARENT';
  createdByUserId: string;
  assignedResolverId?: string;
  resolvedByUserId?: string;
  proofImageUrl?: string;
  history: AlertHistory[];
  createdAt: string;
  updatedAt: string;
}

// Full profile response aggregate
export interface StudentProfileResponse {
  student: Student;
  classDetails: Class | undefined;
  subjects: { subject: Subject; marks: Marks[] }[];
  attendance: Attendance[];
  remarks: Remarks[];
  positiveRemarks: Remarks[];
  negativeRemarks: Remarks[];
  alerts: Alert[]; // Unified alerts
  dailyPerformance: DailyPerformance[];
  monthlyProgress: MonthlyProgress[];
  assignedTeachers: AssignedTeacher[];
  homeworkTasks: HomeworkTask[];
  ratingScore: number;
}

export interface ClassResponse {
  id: string;
  name: string;
  section: string;
}

export interface StudentResponse {
  id: string;
  name: string;
  rollNumber: string;
}

export interface SchoolOverview {
  enrollmentCount: number;
  classCount: number;
  teacherCount: number;
  criticalAlerts: number;
  staffAttendance: string;
  weakPerformanceClasses: string[];
}
