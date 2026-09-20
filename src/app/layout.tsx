import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { AgentDrawer } from '@/components/agent-drawer';
import { Providers } from '@/components/providers';
import { Footer } from '@/components/footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'EduPath AI — Your AI Career Agent That Learns How You Learn',
  description: 'An adaptive AI career agent that continuously assesses skill gaps, generates personalized roadmaps, and dynamically adapts based on evaluation evidence.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground flex flex-col antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        <Providers>
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          <Footer />
          <AgentDrawer />
        </Providers>
      </body>
    </html>
  );
}