import type { Metadata } from 'next';
import '../styles/globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'Vulnuris Unified Log RCA Platform',
  description: 'Student Edition — Built for educational use; not a production IR tool.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <Sidebar />
          <div className="main-area">{children}</div>
        </div>
      </body>
    </html>
  );
}
