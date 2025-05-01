import type { Metadata } from 'next';
import { Geist } from '@/app/(fonts)/geist/font/sans'; // Corrected import path
import { Geist_Mono } from '@/app/(fonts)/geist/font/mono'; // Corrected import path
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: '优先流', // Updated title to Chinese
  description: '通过优先级管理您的任务。', // Updated description to Chinese
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Set default to dark mode, apply light theme via 'dark' class if needed
    <html lang="zh-CN">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        Geist.variable,
        Geist_Mono.variable
      )}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
