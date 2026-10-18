export interface NavSubItem {
  id: string;
  label: string;
  href: string;
  badge?: {
    text: string;
    variant?: 'primary' | 'success' | 'warning' | 'info' | 'default';
  };
  exact?: boolean;
}

export interface NavItem {
  id: string;
  label: string;
  href?: string;
  icon: string; // Lucide icon name or identifier
  badge?: {
    text: string;
    variant?: 'primary' | 'success' | 'warning' | 'info' | 'default';
  };
  children?: NavSubItem[];
  exact?: boolean;
}

export interface NavSection {
  id: string;
  title: string;
  items: NavItem[];
}

export interface SidebarNavigationProps {
  currentPath?: string;
  role?: 'admin' | 'reseller' | 'user';
  userPermissions?: string[];
  onNavigate?: (href: string) => void;
}
