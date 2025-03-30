import '@/styles/global.css'

import { Providers } from '@/context/Providers';
import { MainLayout } from '@/layouts/MainLayout';

export const metadata = {
  title: "DeSo NextJS Starter App",
  description: "Designed by @brootle",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ colorScheme: 'dark' }}>
      <body>
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
}