export interface Subject {
  id: string;
  name: string;
  coefficient: number;
  lectureGrade: number | null;
  practicalGrade: number | null;
  hasLecture: boolean;
  subjectAverage: number | null;
}
