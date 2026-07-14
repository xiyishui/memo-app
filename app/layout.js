import './globals.css';
import Link from 'next/link';
import { AuthProvider } from './auth';
import AuthNav from './AuthNav';

export const metadata = {
  title: '个人备忘录',
  description: '一个简单好用的个人备忘录应用',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <AuthProvider>
          <AuthNav />
          <main className="container">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
