import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Noto_Kufi_Arabic } from 'next/font/google'; // Import Arabic font
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster for notifications

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// Configure Arabic font
const notoKufiArabic = Noto_Kufi_Arabic({
  subsets: ['arabic'],
  variable: '--font-noto-kufi-arabic',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'تطبيق حساب المعدل - Sociology Grade Calculator',
  description: 'Calculate your semester average for Sociology (ليسانس علم الاجتماع)',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl"> {/* Set default language to Arabic and direction to RTL */}
      <body className={`${inter.variable} ${notoKufiArabic.variable} antialiased font-sans`}>
        {children}
        <Toaster /> {/* Add Toaster component here */}
      </body>
    </html>
  );
}
