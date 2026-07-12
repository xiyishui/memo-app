import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: '个人备忘录',
  description: '一个简单好用的个人备忘录应用',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <nav className="nav-bar">
          <div className="container">
            <Link href="/">📝 个人备忘录</Link>
          </div>
        </nav>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
