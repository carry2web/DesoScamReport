import '@/styles/global.css'

import { Providers } from '@/context/Providers';
import { MainLayout } from '@/layouts/MainLayout';

import { ToastUI } from '@/components/ToastUI';

export const metadata = {
  title: 'DeSo Scam Report - Community Shield Protocol',
  description: 'Protecting the DeSo ecosystem from scammers through human-verified investigations and decentralized reporting.',
  icons: {
    icon: [
      { url: '/icon.svg', sizes: 'any' },
      { url: '/logo.svg', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
}

export const viewport = {
  themeColor: '#1f2937',
  colorScheme: 'dark',
}

export default function RootLayout({ children, modal }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <MainLayout>
            {children}
            {modal}
          </MainLayout>
        </Providers>
        <ToastUI />
      </body>
    </html>
  );
}