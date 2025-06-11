export default function manifest() {
  return {
    name: 'DeSo NextJS Starter App',
    short_name: 'DeSo Starter',
    description: 'DeSo App designed by @brootle',
    start_url: '/',
    display: 'standalone',
    background_color: '#181A20',
    theme_color: '#181A20', 
    icons: [
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },      
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}