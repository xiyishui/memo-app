import './globals.css';
import { AuthProvider } from './auth';

export const metadata = {
  title: '个人备忘录',
  description: '一个简单好用的个人备忘录应用',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}