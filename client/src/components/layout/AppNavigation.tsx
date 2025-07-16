/**
 * AppNavigation Component
 * 
 * Responsive navigation system that adapts to different devices:
 * - Mobile: Hamburger menu with slide-out drawer
 * - Tablet: Compact navigation with dropdowns
 * - Desktop: Full navigation with dropdowns
 * 
 * Features:
 * - Performance optimized (minimal re-renders)
 * - Keyboard accessible
 * - Responsive across all screen sizes
 * - Animated with reduced motion support
 */

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'wouter';
import { usePerformance } from '@/context/PerformanceContext';
import { cn } from '@/lib/utils';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

// Import icons from Lucide React
import { Menu, X, ChevronDown, User, Home, Compass, Trophy, BookOpen, Briefcase, Settings } from 'lucide-react';

interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  children?: NavigationItem[];
  badge?: string | number;
  badgeColor?: string;
}

interface AppNavigationProps {
  logo?: string;
  items: NavigationItem[];
  actions?: React.ReactNode;
  userMenu?: React.ReactNode;
  sticky?: boolean;
  transparent?: boolean;
  className?: string;
  colorScheme?: 'light' | 'dark';
}

export function AppNavigation({
  logo = '/logo.png',
  items,
  actions,
  userMenu,
  sticky = true,
  transparent = false,
  className,
  colorScheme = 'light',
}: AppNavigationProps) {
  const [location] = useLocation();
  const { isMobile, isTablet, enableAnimations } = usePerformance();
  
  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // State to track which dropdown is open
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  // Refs for detecting clicks outside navigation components
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const dropdownRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  
  // Close the mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
      
      // Check if click is outside any open dropdown
      if (openDropdown) {
        const dropdownEl = dropdownRefs.current.get(openDropdown);
        if (dropdownEl && !dropdownEl.contains(event.target as Node)) {
          setOpenDropdown(null);
        }
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);
  
  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location]);
  
  // Close mobile menu when resizing to desktop
  useEffect(() => {
    if (!isMobile && !isTablet) {
      setMobileMenuOpen(false);
    }
  }, [isMobile, isTablet]);
  
  // Toggle dropdown
  const handleDropdownToggle = (label: string) => {
    setOpenDropdown(prev => prev === label ? null : label);
  };
  
  // Save dropdown ref
  const saveDropdownRef = (label: string, ref: HTMLDivElement | null) => {
    if (ref) {
      dropdownRefs.current.set(label, ref);
    }
  };
  
  // Generate navigation items
  const renderNavItems = (navItems: NavigationItem[], mobile = false) => {
    return navItems.map((item, index) => {
      const isActive = location === item.href;
      const hasChildren = item.children && item.children.length > 0;
      const isDropdownOpen = openDropdown === item.label;
      
      // Classes for nav items
      const linkClasses = mobile
        ? cn(
            'flex items-center py-3 px-4 text-lg w-full',
            isActive ? 'font-medium text-primary' : 'text-foreground/80 hover:text-foreground',
          )
        : cn(
            'flex items-center py-2 px-3 relative text-sm font-medium rounded-md transition-colors',
            isActive 
              ? 'text-primary'
              : 'text-foreground/80 hover:text-foreground hover:bg-muted/50',
          );
      
      const mainLink = (
        <>
          {/* Icon */}
          {item.icon && (
            <span className={cn("mr-2", mobile ? "text-xl" : "text-base")}>
              {item.icon}
            </span>
          )}
          
          {/* Label */}
          <span>{item.label}</span>
          
          {/* Badge */}
          {item.badge && (
            <span 
              className={cn(
                "ml-2 px-1.5 py-0.5 text-xs rounded-full",
                item.badgeColor || "bg-primary text-primary-foreground"
              )}
            >
              {item.badge}
            </span>
          )}
          
          {/* Dropdown indicator */}
          {hasChildren && (
            <ChevronDown 
              className={cn(
                "ml-1 h-4 w-4 transition-transform",
                isDropdownOpen ? "transform rotate-180" : ""
              )} 
            />
          )}
        </>
      );
      
      // If this item has children (dropdown)
      if (hasChildren) {
        return (
          <div 
            key={item.label} 
            className={mobile ? "w-full" : "relative"}
            ref={el => saveDropdownRef(item.label, el)}
          >
            {/* Mobile dropdown shows as expandable section */}
            {mobile ? (
              <div className="w-full">
                <button
                  className={linkClasses}
                  onClick={() => handleDropdownToggle(item.label)}
                >
                  {mainLink}
                </button>
                
                {/* Dropdown content */}
                <div 
                  className={cn(
                    "overflow-hidden transition-all duration-300 bg-muted/30 pl-4",
                    isDropdownOpen 
                      ? "max-h-96 opacity-100" 
                      : "max-h-0 opacity-0"
                  )}
                >
                  {item.children?.map(child => (
                    <Link 
                      key={child.label} 
                      href={child.href}
                      className="flex items-center py-2 px-4 text-foreground/70 hover:text-foreground"
                    >
                      {child.icon && <span className="mr-2">{child.icon}</span>}
                      {child.label}
                      {child.badge && (
                        <span 
                          className={cn(
                            "ml-2 px-1.5 py-0.5 text-xs rounded-full",
                            child.badgeColor || "bg-primary text-primary-foreground"
                          )}
                        >
                          {child.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              // Desktop dropdown shows as popup menu
              <div>
                <button
                  className={linkClasses}
                  onClick={() => handleDropdownToggle(item.label)}
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  {mainLink}
                </button>
                
                {/* Dropdown menu */}
                <div 
                  className={cn(
                    "absolute top-full left-0 mt-1 py-2 bg-popover shadow-lg rounded-md min-w-44 z-50 overflow-hidden transition-all",
                    enableAnimations && "duration-200",
                    isDropdownOpen 
                      ? "opacity-100 translate-y-0" 
                      : "opacity-0 -translate-y-2 pointer-events-none"
                  )}
                >
                  {item.children?.map(child => (
                    <Link 
                      key={child.label} 
                      href={child.href}
                      className="flex items-center px-4 py-2 text-sm hover:bg-muted/50 text-foreground/80 hover:text-foreground"
                    >
                      {child.icon && <span className="mr-2">{child.icon}</span>}
                      {child.label}
                      {child.badge && (
                        <span 
                          className={cn(
                            "ml-2 px-1.5 py-0.5 text-xs rounded-full",
                            child.badgeColor || "bg-primary text-primary-foreground"
                          )}
                        >
                          {child.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      }
      
      // Regular link (no children)
      return (
        <Link
          key={item.label}
          href={item.href}
          className={linkClasses}
        >
          {mainLink}
        </Link>
      );
    });
  };
  
  return (
    <nav
      className={cn(
        "w-full z-50",
        sticky && "sticky top-0",
        transparent 
          ? "bg-background/80 backdrop-blur-sm" 
          : "bg-background border-b",
        colorScheme === 'dark' && "bg-slate-900 text-white border-slate-800",
        className
      )}
    >
      {/* Desktop and Tablet Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              {logo && (
                <OptimizedImage
                  src={logo}
                  alt="Lifetime GPS"
                  width={32}
                  height={32}
                  className="mr-2"
                  priority
                />
              )}
              <span className="text-lg font-semibold">Lifetime GPS</span>
            </Link>
          </div>
          
          {/* Main Navigation - Desktop only */}
          {!isMobile && (
            <div className="hidden md:flex items-center space-x-1">
              {renderNavItems(items)}
            </div>
          )}
          
          {/* Right-side actions */}
          <div className="flex items-center">
            {/* Custom action buttons - Desktop only */}
            {!isMobile && actions && (
              <div className="hidden md:flex items-center mr-4">
                {actions}
              </div>
            )}
            
            {/* User menu - Desktop only */}
            {!isMobile && userMenu && (
              <div className="hidden md:block">
                {userMenu}
              </div>
            )}
            
            {/* Mobile menu button */}
            {(isMobile || isTablet) && (
              <button
                onClick={() => setMobileMenuOpen(prev => !prev)}
                className="ml-2 p-2 rounded-md text-foreground/80 hover:text-foreground hover:bg-muted/50"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Drawer */}
      <div
        ref={mobileMenuRef}
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-background shadow-lg transform transition-transform ease-in-out duration-300",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full",
          colorScheme === 'dark' && "bg-slate-900"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-md text-foreground/80 hover:text-foreground hover:bg-muted/50"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex flex-col py-2">
          {/* Mobile navigation items */}
          {renderNavItems(items, true)}
          
          {/* Mobile actions */}
          {actions && (
            <div className="mt-4 px-4 py-2 border-t">
              {actions}
            </div>
          )}
          
          {/* Mobile user menu */}
          {userMenu && (
            <div className="mt-2 px-4 py-2 border-t">
              {userMenu}
            </div>
          )}
        </div>
      </div>
      
      {/* Overlay when mobile menu is open */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          aria-hidden="true"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
}

// Preset navigation items with icons
export const defaultNavItems: NavigationItem[] = [
  {
    label: 'Home',
    href: '/',
    icon: <Home className="h-5 w-5" />
  },
  {
    label: 'Explore',
    href: '/explore',
    icon: <Compass className="h-5 w-5" />,
    children: [
      {
        label: 'Careers',
        href: '/explore/careers',
        icon: <Briefcase className="h-4 w-4" />
      },
      {
        label: 'Trades',
        href: '/explore/trades',
        icon: <BookOpen className="h-4 w-4" />
      },
      {
        label: 'Opportunities',
        href: '/explore/opportunities',
        icon: <Compass className="h-4 w-4" />
      }
    ]
  },
  {
    label: 'My Journey',
    href: '/journey',
    icon: <Trophy className="h-5 w-5" />,
    badge: 'New',
    badgeColor: 'bg-green-500 text-white',
    children: [
      {
        label: 'Assessment',
        href: '/journey/assessment',
      },
      {
        label: 'Roadmap',
        href: '/journey/roadmap',
      },
      {
        label: 'Progress',
        href: '/journey/progress',
      }
    ]
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: <Settings className="h-5 w-5" />
  }
];