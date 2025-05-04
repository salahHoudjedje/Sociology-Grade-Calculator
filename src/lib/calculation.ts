import type { Subject } from '@/types/subject';
import { TOTAL_COEFFICIENT } from '@/data/subjects';

/**
 * Calculates the average grade for a single subject.
 * Grades must be between 0 and 20.
 * If a grade is outside this range, returns null.
 */
export function calculateSubjectAverage(subject: Subject): number | null {
  const { lectureGrade, practicalGrade, hasLecture } = subject;

  const isValidGrade = (grade: number | null): boolean => grade === null || (grade >= 0 && grade <= 20);

  if (!isValidGrade(lectureGrade) || !isValidGrade(practicalGrade)) {
    return null; // Invalid grade input
  }

  if (hasLecture) {
    if (lectureGrade !== null && practicalGrade !== null) {
      return (lectureGrade + practicalGrade) / 2;
    }
     if (lectureGrade !== null && practicalGrade === null) {
      // Assuming if practical is missing, lecture counts fully if hasLecture is true
       // Or maybe it should be null? Clarify requirement. Let's assume null for now if one is missing.
       return null;
     }
    if (lectureGrade === null && practicalGrade !== null) {
       // Same assumption as above.
      return null;
    }
    return null; // Both grades needed but missing
  } else {
    // Practical only subject
    if (practicalGrade !== null) {
      return practicalGrade;
    }
    return null; // Practical grade needed but missing
  }
}

/**
 * Calculates the final semester average based on all subject averages and coefficients.
 * Returns null if any subject average is missing or invalid.
 */
export function calculateSemesterAverage(subjects: Subject[]): number | null {
  let totalWeightedSum = 0;
  let isComplete = true;

  for (const subject of subjects) {
    const subjectAverage = calculateSubjectAverage(subject);
    if (subjectAverage === null) {
      isComplete = false; // Mark as incomplete if any subject average calculation fails
      // Update the subject's average to null in the main state if needed outside this function
    } else {
       subject.subjectAverage = subjectAverage; // Update subject average in the passed array (mutates!)
    }

    if (subject.subjectAverage === null) {
      isComplete = false; // Also check the updated subjectAverage property
      // If a grade was entered but invalid (e.g., > 20), subjectAverage would be null here
    }

    // We proceed with calculation only if the average is valid for weighting
    if (subject.subjectAverage !== null) {
         totalWeightedSum += subject.subjectAverage * subject.coefficient;
    } else {
        // If even one subject average is null (due to missing or invalid grades),
        // the final average cannot be calculated accurately.
        isComplete = false;
    }
  }


  if (!isComplete || TOTAL_COEFFICIENT === 0) {
    return null; // Cannot calculate if incomplete or total coefficient is zero
  }


  const finalAverage = totalWeightedSum / TOTAL_COEFFICIENT;
  return parseFloat(finalAverage.toFixed(2)); // Return average rounded to 2 decimal places
}

/**
 * Checks if a grade is considered failing (less than 10).
 */
export function isFailingGrade(grade: number | null): boolean {
  return grade !== null && grade < 10;
}
