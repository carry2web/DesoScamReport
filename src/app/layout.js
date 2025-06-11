import '@/styles/global.css'

import { Providers } from '@/context/Providers';
import { MainLayout } from '@/layouts/MainLayout';

import { ToastUI } from '@/components/ToastUI';

export const metadata = {
  title: 'DeSo NextJS Starter App',
  description: 'DeSo App designed by @brootle',
  icons: {
    icon: [
      { url: '/icon.svg', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
}

export const viewport = {
  themeColor: '#181A20',
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