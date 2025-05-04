
"use client";

import { useState, useEffect } from 'react';
import type { Subject } from '@/types/subject';
import { initialSubjects, TOTAL_COEFFICIENT } from '@/data/subjects';
import { calculateSubjectAverage, calculateSemesterAverage, isFailingGrade } from '@/lib/calculation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, BookOpen, Sigma, Percent, TrendingUp, TrendingDown, RotateCcw } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Function to create a fresh copy of initial subjects with null grades
const getInitialSubjectsState = (): Subject[] =>
  JSON.parse(JSON.stringify(initialSubjects)).map((s: Subject) => ({
    ...s,
    lectureGrade: null,
    practicalGrade: null,
    subjectAverage: null,
  }));


export function GradeCalculator() {
  const [subjects, setSubjects] = useState<Subject[]>(getInitialSubjectsState());
  const [semesterAverage, setSemesterAverage] = useState<number | null>(null);
  const [studentName, setStudentName] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    const firstName = localStorage.getItem('studentFirstName') || '';
    const lastName = localStorage.getItem('studentLastName') || '';
    setStudentName(`${firstName} ${lastName}`.trim());
  }, []);

   const handleGradeChange = (id: string, gradeType: 'lecture' | 'practical', value: string) => {
    const grade = value === '' ? null : parseFloat(value);

     if (value !== '' && (isNaN(grade) || grade < 0 || grade > 20)) {
       toast({
         title: "خطأ في الإدخال",
         description: `العلامة يجب أن تكون بين 0 و 20. المدخل "${value}" غير صالح.`,
         variant: "destructive",
       });
       return;
     }

    setSubjects(prevSubjects =>
      prevSubjects.map(subject => {
        if (subject.id === id) {
           const updatedSubject = {
             ...subject,
             [gradeType === 'lecture' ? 'lectureGrade' : 'practicalGrade']: grade,
           };
           const subjAvg = calculateSubjectAverage(updatedSubject);
           return { ...updatedSubject, subjectAverage: subjAvg };
        }
        return subject;
      })
    );
     triggerSemesterCalculation(); // Recalculate semester average on every valid grade change
  };

   const triggerSemesterCalculation = () => {
     // Use the current subjects state directly
     const finalAverage = calculateSemesterAverage(subjects);
     setSemesterAverage(finalAverage);
   };

    // Recalculate semester average whenever subjects state changes
    // This ensures the average updates correctly after state changes from handleGradeChange
    useEffect(() => {
      triggerSemesterCalculation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subjects]); // Dependency array includes subjects

   const handleReset = () => {
     setSubjects(getInitialSubjectsState());
     setSemesterAverage(null);
     toast({
       title: "إعادة تعيين",
       description: "تم مسح جميع العلامات والمعدل.",
     });
   };


  const renderGradeInput = (subject: Subject, gradeType: 'lecture' | 'practical') => {
    const isDisabled = gradeType === 'lecture' && !subject.hasLecture;
     const value = gradeType === 'lecture' ? subject.lectureGrade : subject.practicalGrade;

    return (
      <Input
        type="number"
        min="0"
        max="20"
        step="0.25"
        value={value ?? ''}
        onChange={(e) => handleGradeChange(subject.id, gradeType, e.target.value)}
        placeholder={isDisabled ? "N/A" : "0-20"}
        disabled={isDisabled}
        className={cn(
          "w-24 text-center",
           isDisabled && "bg-muted/50 cursor-not-allowed",
           !isDisabled && value !== null && isFailingGrade(value) && "border-destructive ring-destructive focus-visible:ring-destructive text-destructive",
          !isDisabled && value !== null && !isFailingGrade(value) && "border-green-500 ring-green-500 focus-visible:ring-green-500 text-green-700"
        )}
        aria-label={`${subject.name} ${gradeType === 'lecture' ? 'علامة المحاضرة' : 'علامة التطبيق'} `}
      />
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen">
      <Card className="w-full max-w-4xl mx-auto shadow-xl animate-fadeIn">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary flex items-center gap-2 justify-center">
            <GraduationCap /> تطبيق حساب المعدل
          </CardTitle>
           {studentName && <CardDescription className="text-center text-lg">مرحباً بك، {studentName}</CardDescription>}
          <CardDescription className="text-center">أدخل علاماتك لحساب معدلك الفصلي للسنة الثالثة ليسانس علم الاجتماع.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3 min-w-[200px] text-right"><BookOpen className="inline-block ml-1" size={18}/> اسم المقياس</TableHead>
                  <TableHead className="text-center">علامة المحاضرات</TableHead>
                  <TableHead className="text-center">علامة الأعمال التطبيقية</TableHead>
                  <TableHead className="text-center"><Sigma className="inline-block ml-1" size={18}/> المعامل</TableHead>
                  <TableHead className="text-center"><Percent className="inline-block ml-1" size={18}/> معدل المقياس</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects.map((subject) => (
                  <TableRow key={subject.id} className="transition-colors hover:bg-secondary/50">
                    <TableCell className="font-medium text-right">{subject.name}</TableCell>
                    <TableCell className="text-center">{renderGradeInput(subject, 'lecture')}</TableCell>
                    <TableCell className="text-center">{renderGradeInput(subject, 'practical')}</TableCell>
                    <TableCell className="text-center">{subject.coefficient}</TableCell>
                    <TableCell className="text-center">
                       {subject.subjectAverage !== null ? (
                         <Badge
                           variant={isFailingGrade(subject.subjectAverage) ? "destructive" : "default"}
                           className={cn(
                            !isFailingGrade(subject.subjectAverage) && "bg-accent text-accent-foreground",
                            "text-sm font-semibold"
                           )}
                         >
                           {subject.subjectAverage.toFixed(2)}
                         </Badge>
                       ) : (
                         <span className="text-muted-foreground">-</span>
                       )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
         <CardFooter className="flex flex-col items-center gap-4 mt-6">
            {semesterAverage !== null && (
             <div className="text-center p-4 border border-primary rounded-lg bg-primary/10 w-full animate-fadeIn">
               <p className="text-lg font-semibold text-primary flex items-center justify-center gap-2">
                  المعدل الفصلي النهائي:
                 <span
                   className={cn(
                     "text-2xl font-bold",
                     isFailingGrade(semesterAverage) ? "text-destructive" : "text-accent"
                   )}
                 >
                   {semesterAverage.toFixed(2)}
                 </span>
                 {isFailingGrade(semesterAverage) ? <TrendingDown className="text-destructive" /> : <TrendingUp className="text-accent" />}
               </p>
               <p className="text-sm text-muted-foreground mt-1">
                 (مجموع (معدل المقياس * المعامل) / {TOTAL_COEFFICIENT})
               </p>
             </div>
           )}
            {semesterAverage === null && subjects.some(s => s.subjectAverage === null && ((s.hasLecture && (s.lectureGrade === null || s.practicalGrade === null)) || (!s.hasLecture && s.practicalGrade === null))) && (
                 <p className="text-center text-destructive text-sm">
                     الرجاء إكمال إدخال جميع العلامات المطلوبة أو التأكد من صحتها (0-20) لحساب المعدل.
                 </p>
             )}

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full md:w-auto border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <RotateCcw className="ml-2" size={18} />
                  إعادة تعيين الكل
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent dir="rtl"> {/* Ensure dialog is RTL */}
                <AlertDialogHeader>
                  <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                  <AlertDialogDescription>
                    سيؤدي هذا الإجراء إلى مسح جميع العلامات المدخلة والمعدل المحسوب. لا يمكن التراجع عن هذا الإجراء.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReset} className="bg-destructive hover:bg-destructive/90">
                    تأكيد المسح
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

         </CardFooter>
      </Card>
    </div>
  );
}
