'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Terminal } from 'lucide-react';
import { developerNavItems } from '@/data/developer-nav-items';

/**
 * DeveloperNav — Breadcrumb + secondary top-navigation strip.
 * Renders the current path as a breadcrumb trail, and shows a
 * compact scrollable tab row of developer sections on mobile.
 */
export const DeveloperNav = () => {
  const pathname = usePathname();

  // Build breadcrumb segments from the current pathname
  const segments = pathname
    .split('/')
    .filter(Boolean)
    .map((seg, i, arr) => ({
      label: seg
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' '),
      href: '/' + arr.slice(0, i + 1).join('/'),
    }));

  const isActive = (href: string) => {
    if (href === '/developer') return pathname === '/developer';
    return pathname.startsWith(href);
  };

  return (
    <div className="border-b border-white/10 bg-slate-900/40 backdrop-blur-xl">
      {/* Breadcrumb */}
      <div className="px-4 sm:px-6 lg:px-8 h-10 flex items-center gap-1.5 text-xs text-blue-300/50">
        <Terminal size={12} className="text-indigo-400 flex-shrink-0" />
        {segments.map((seg, i) => (
          <span key={seg.href} className="flex items-center gap-1.5">
            <ChevronRight size={11} className="text-blue-300/30" />
            {i === segments.length - 1 ? (
              <span className="text-indigo-300 font-semibold">{seg.label}</span>
            ) : (
              <Link
                href={seg.href}
                className="hover:text-blue-200 transition-colors"
              >
                {seg.label}
              </Link>
            )}
          </span>
        ))}
      </div>

      {/* Horizontal tab nav — visible only on small screens where sidebar is hidden */}
      <nav
        className="lg:hidden flex gap-1 px-4 pb-2 overflow-x-auto scrollbar-hide"
        aria-label="Developer portal sections"
      >
        {developerNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              id={`dev-tab-${item.name.toLowerCase().replace(/\s+/g, '-').replace(/[&]/g, 'and')}`}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                whitespace-nowrap flex-shrink-0 transition-all duration-200
                ${
                  active
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/30'
                    : 'text-blue-300/50 hover:text-blue-200 hover:bg-white/5 border border-transparent'
                }`}
            >
              <Icon size={13} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
