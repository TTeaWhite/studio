import type { Metadata } from 'next';
import { Geist } from '@/app/(fonts)/geist/font/sans';
import { Geist_Mono } from '@/app/(fonts)/geist/font/mono';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';
import Header from '@/components/layout/header'; // Import Header

export const metadata: Metadata = {
  title: '优先流',
  description: '通过优先级管理您的任务。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        Geist.variable,
        Geist_Mono.variable
      )}>
        <Header /> {/* Add Header */}
        <main>{children}</main> {/* Wrap children in main */}
        <Toaster />
      </body>
    </html>
  );
}
