import React, { ReactNode } from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Music,
  User,
  Menu,
  X,
  Home,
  LogOut,
  Book
} from 'lucide-react';
import { useState } from 'react';
import { PageProps } from '@/types';

interface AppLayoutProps {
  children: ReactNode;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  current?: boolean;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { url, props } = usePage<PageProps>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { post } = useForm();

  const handleLogout = () => {
    post('/logout');
  };

  const navigation: NavigationItem[] = [
    {
      name: 'Dashboard',
      href: '/',
      icon: Home,
      current: url === '/',
    },
    {
      name: 'Soundboard',
      href: '/soundboard',
      icon: Music,
      current: url.startsWith('/soundboard'),
    },
    {
      name: 'Characters',
      href: '/characters',
      icon: User,
      current: url.startsWith('/characters'),
    },
    {
      name: 'Compendium',
      href: '/compendium',
      icon: Book,
      current: url.startsWith('/compendium'),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile menu */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden",
        sidebarOpen ? "block" : "hidden"
      )}>
        <div className="fixed inset-0 bg-black/20" onClick={() => setSidebarOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-64 bg-card border-r">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-lg font-semibold">Kritikus Hub</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <nav className="px-2 py-4">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      item.current
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile user section */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {props.auth?.user?.name}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="h-8 w-8 p-0"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:bg-card lg:border-r">
        <div className="flex h-16 items-center px-4">
          <h1 className="text-lg font-semibold">Kritikus</h1>
        </div>
        <nav className="px-2 py-4">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    item.current
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {props.auth?.user?.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {props.auth?.user?.email}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="h-8 w-8 p-0"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile menu button */}
        <div className="sticky top-0 z-40 flex h-16 items-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            className="ml-4"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </Button>
          <h1 className="ml-4 text-lg font-semibold">Kritikus Hub</h1>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
