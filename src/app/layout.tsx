import type { Metadata } from 'next';
import { Geist } from '@/app/(fonts)/geist/font/sans'; // Corrected import path and name
import { Geist_Mono } from '@/app/(fonts)/geist/font/mono'; // Corrected import path
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'PriorityFlow',
  description: 'Manage your tasks with priorities.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        Geist.variable, // Corrected variable name
        Geist_Mono.variable
      )}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
