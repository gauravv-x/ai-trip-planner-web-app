"use client";

import React, { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, LayoutDashboard, Users, Plane, X, Menu } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/config", label: "Configuration", icon: Settings },
  { href: "/admin/users", label: "User Management", icon: Users },
  { href: "/admin/trips", label: "Trip Management", icon: Plane },
];

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const NavLink = ({ item }: { item: NavItem }) => (
    <Link
      href={item.href}
      onClick={() => setIsSidebarOpen(false)}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-gray-100 hover:text-gray-900
        ${
          isActive(item.href)
            ? "bg-gray-100 text-gray-900"
            : "text-gray-500"
        }
      `}
    >
      <item.icon className="h-4 w-4" />
      {item.label}
    </Link>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-white px-4 shadow-sm">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-gray-500 hover:text-gray-900"
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <h1 className="font-semibold text-lg truncate">Admin Panel</h1>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:w-64 ${
          isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"
        }`}
      >
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link
            href="/admin"
            className="flex items-center gap-2 font-semibold text-lg text-gray-900"
          >
            <Plane className="h-6 w-6 text-primary" />
            Admin Portal
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start gap-1 px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 flex flex-col">
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}