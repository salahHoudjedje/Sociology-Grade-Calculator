"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { BookUser } from 'lucide-react'; // Icon for name fields

export function IntroScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const router = useRouter();

  const handleContinue = () => {
    // Basic validation: ensure names are entered
    if (firstName.trim() && lastName.trim()) {
      // Store names in localStorage (simple approach for now)
      localStorage.setItem('studentFirstName', firstName);
      localStorage.setItem('studentLastName', lastName);
      router.push('/calculator');
    } else {
      // Basic feedback - could use toast notifications
      alert('الرجاء إدخال الاسم الأول واللقب');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-lg animate-fadeIn">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">تطبيق حساب المعدل</CardTitle>
          <CardDescription>ليسانس علم الاجتماع - السنة الثالثة</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="flex items-center gap-2">
               <BookUser className="text-muted-foreground" />
               <span>الاسم الأول (بالعربية)</span>
             </Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="أدخل اسمك الأول"
              required
              className="text-right" // Ensure text aligns right for Arabic
            />
          </div>
          <div className="space-y-2">
             <Label htmlFor="lastName" className="flex items-center gap-2">
               <BookUser className="text-muted-foreground" />
               <span>اللقب (بالعربية)</span>
             </Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="أدخل لقبك"
              required
              className="text-right" // Ensure text aligns right for Arabic
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
             className="w-full bg-accent hover:bg-accent/90 text-accent-foreground transition-colors duration-200"
             onClick={handleContinue}
           >
            متابعة
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
