import './globals.css';
import { PlayerProvider } from '@/contexts/PlayerContext';

export const metadata = {
  title: 'YTMusic Player — Nghe nhạc YouTube miễn phí',
  description: 'Nghe nhạc từ YouTube dưới dạng audio — hỗ trợ phát nền khi tắt màn hình. Listen to YouTube as audio with background playback.',
  keywords: 'youtube, music, audio, player, background playback, nghe nhac',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'YTMusic',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0a0a0f',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>
        <div className="app-bg-glow" aria-hidden="true" />
        <PlayerProvider>
          {children}
        </PlayerProvider>
      </body>
    </html>
  );
}
