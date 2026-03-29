import { navItems } from '@/types/sidebar-items';
import {
  LayoutDashboard,
  BookOpen,
  Webhook,
  KeyRound,
  Layers,
  Code2,
  Activity,
  LifeBuoy,
} from 'lucide-react';

export const developerNavItems: navItems[] = [
  {
    name: 'Dashboard',
    href: '/developer',
    icon: LayoutDashboard,
  },
  {
    name: 'API Documentation',
    href: '/developer/docs',
    icon: BookOpen,
  },
  {
    name: 'Webhooks',
    href: '/developer/webhooks',
    icon: Webhook,
  },
  {
    name: 'API Keys',
    href: '/developer/api-keys',
    icon: KeyRound,
  },
  {
    name: 'SDKs & Libraries',
    href: '/developer/sdks',
    icon: Layers,
  },
  {
    name: 'Code Examples',
    href: '/developer/examples',
    icon: Code2,
  },
  {
    name: 'API Status',
    href: '/developer/status',
    icon: Activity,
  },
  {
    name: 'Support',
    href: '/developer/support',
    icon: LifeBuoy,
  },
];
