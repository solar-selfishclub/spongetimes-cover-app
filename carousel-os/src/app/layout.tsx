import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '스폰지클럽 캐러셀 OS',
  description: '인스타그램 캐러셀 6장을 텍스트 입력만으로 생성하는 도구',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
