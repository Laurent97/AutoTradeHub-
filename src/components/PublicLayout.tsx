import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

interface PublicLayoutProps {
  children: ReactNode;
  showBreadcrumbs?: boolean;
}

export default function PublicLayout({ children, showBreadcrumbs = true }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow">
        {showBreadcrumbs && (
          <div className="container mx-auto px-4 py-6">
            <Breadcrumbs />
          </div>
        )}
        <div className={showBreadcrumbs ? "container mx-auto px-4 pb-8" : ""}>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
