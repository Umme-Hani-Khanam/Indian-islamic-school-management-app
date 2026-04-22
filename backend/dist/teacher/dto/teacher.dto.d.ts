export declare class CreateMarkDto {
    studentId: string;
    subjectId: string;
    marks: number;
}
export declare class CreateRemarkDto {
    studentId: string;
    comment: string;
    type: 'POSITIVE' | 'NEGATIVE';
}
