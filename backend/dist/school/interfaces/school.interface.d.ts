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
}
export interface Subject {
    id: string;
    name: string;
    code: string;
}
export interface TeacherAssignment {
    id: string;
    teacherId: string;
    classId: string;
    subjectId: string;
}
export interface Attendance {
    id: string;
    studentId: string;
    date: string;
    status: 'PRESENT' | 'ABSENT' | 'LATE';
}
export interface Marks {
    id: string;
    studentId: string;
    subjectId: string;
    date: string;
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
}
export interface StudentProfileResponse {
    student: Student;
    classDetails: Class | undefined;
    subjects: {
        subject: Subject;
        marks: Marks[];
    }[];
    attendance: Attendance[];
    remarks: Remarks[];
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
